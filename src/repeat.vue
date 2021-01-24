
<template>
  <div ref="threeContainer" :style="{width:'100%',height:'100%',}"></div>
</template>

<script>
import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module.js';
import {Line2} from 'three/examples/jsm/lines/Line2.js'
import {LineMaterial} from './js/LineMaterial2.js';
import {LineGeometry} from 'three/examples/jsm/lines/LineGeometry.js';
export default {
  name: "THREEBackgrond",
  props: {
    width: {
      type: Number,
      default: window.innerWidth,
    },
    height: {
      type: Number,
      default: window.innerHeight,
    },
    speed:{
      type:Number,
      default:1
    },
    FPS:{
      type:Number,
      default:60
    },
    playing:{
      type:Boolean,
      default:true
    }
  },
  /**
   * @returns {{animationID:(number|null), renderer:THREE.WebglRenderer}} 
   */
  data: () => {
    return {
      animationID:null,
      active:true,
    };
  },
  computed: {},
  watch: {
    playing(value){
      if(value){
        this.loadCubeGroupPosition();
        this.clock.start();
      } else {
        this.saveCubeGroupPosition();
        this.clock.stop();
      }
    }
  },
  mounted: function() {
    window.onfocus = ()=>{
      this.active = true;
      this.loadCubeGroupPosition();
      this.clock.start();
    };
    window.onblur = () => {
      this.active = false;
      this.saveCubeGroupPosition();
      this.clock.stop();
    };
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.renderer.setSize(this.width,this.height);
    this.$refs.threeContainer.appendChild(this.renderer.domElement);
    this.initScene();
    this.initCamera();
    this.clock = new THREE.Clock();
    this.clock.start();
    let cube = new THREE.Mesh(
      new THREE.BoxBufferGeometry(1,1,1),
      new THREE.MeshBasicMaterial({
        color:0xff0000
      })
    )
    cube.position.set(0,0,-1);
    //this.scene.add(cube);
    this.cube = new THREE.Mesh(
      new THREE.BoxGeometry(1,1,1),
      new THREE.MeshBasicMaterial()
    )
    //this.scene.add(this.cube);
    this.initCubes();
    console.log('this.scene',this.scene)
    this.stats = new Stats();
    this.$refs.threeContainer.appendChild( this.stats.dom );
    this.initControls();
    this.initSpecialMaterial();
    this.animate();
    this.timeStamp = 0;
    
  },
  beforeDestroy(){
    if(this.animationID !== null) {
      cancelAnimationFrame(this.animationID);
      if(this.scene){
        this.scene.traverse((item)=>{
          if(item.geometry){
            item.geometry.dispose();
          }
          if(item.material){
            item.material.dispose();
          }
        })
      }
      if(this.renderer){
        console.log('this.renderer',this.renderer)
      }
    }
    if(this.stats){
      this.$refs.threeContainer.removeChild(this.stats.dom);
    }
  },
  methods:{
    initCamera(){
      this.camera = new THREE.PerspectiveCamera(
        45,
        this.width / this.height,
        0.1,
        100
      );
      this.camera.position.set(0,0,10);
      this.camera.lookAt(new THREE.Vector3(0,0,0));
    },
    initScene(){
      this.scene = new THREE.Scene();
    },
    initControls(){
      if(this.camera && this.scene){
        this.controls = new OrbitControls(this.camera,this.renderer.domElement);
      }
    },
    initCubes(){
      const cube = new THREE.Mesh(
        new THREE.BoxBufferGeometry(0.1,0.1,0.1),
        new THREE.MeshBasicMaterial({
          color:0x33eeee
        })
      )
      const cubeGroup = new THREE.Group();
      for(let i = 0; i < 1000;i++){
        const cubeClone = cube.clone();
        cubeClone.position.set(THREE.MathUtils.randFloat(-30,30),THREE.MathUtils.randFloat(-30,30),THREE.MathUtils.randFloat(-30,30));
        
        cubeGroup.add(cubeClone);
      }
      
      this.cubeGroup = cubeGroup;
      this.cubeGroup.position.set(0,15,0);
      this.scene.add(cubeGroup);
    },
    // 使用自定义的材质
    initSpecialMaterial(){
      const glsl = x => x[0].trim();
      // 顶点着色器按照 MeshBasicMaterial;
      const vert = glsl`
        varying vec2 vUv;
        #include <common>
        #include <uv_pars_vertex>
        #include <uv2_pars_vertex>
        #include <envmap_pars_vertex>
        #include <color_pars_vertex>
        #include <fog_pars_vertex>
        #include <morphtarget_pars_vertex>
        #include <skinning_pars_vertex>
        #include <logdepthbuf_pars_vertex>
        #include <clipping_planes_pars_vertex>
        void main() {
          #include <uv_vertex>
          #include <uv2_vertex>
          #include <color_vertex>
          #include <skinbase_vertex>
          #ifdef USE_ENVMAP
          #include <beginnormal_vertex>
          #include <morphnormal_vertex>
          #include <skinnormal_vertex>
          #include <defaultnormal_vertex>
          #endif
          #include <begin_vertex>
          #include <morphtarget_vertex>
          #include <skinning_vertex>
          #include <project_vertex>
          #include <logdepthbuf_vertex>
          #include <worldpos_vertex>
          #include <clipping_planes_vertex>
          #include <envmap_vertex>
          #include <fog_vertex>
        }
      `;
      const vert2 = glsl`
        varying vec2 vUv;
        void main()	{
          vUv = uv;
          gl_Position = vec4( position, 1.0 );
        }
      `
      const frag = glsl`
        precision highp float;
        uniform float time;
        uniform vec2 u_resolution;
        varying vec2 vUv;
        uniform sampler2D sampleTexture;
        uniform vec2 textureWidthAndHeight;
        void main() {
          vec2 st = gl_FragCoord.xy/u_resolution.xy;
          vec2 c1 = gl_FragCoord.xy/(u_resolution);
          c1.x = c1.x * (u_resolution.x/u_resolution.y);
          c1 *= (u_resolution.y/textureWidthAndHeight.y);
          c1.x *= (textureWidthAndHeight.y/textureWidthAndHeight.x);
          
          vec4 color = texture2D(sampleTexture, c1);
          gl_FragColor = color;//vec4(color,1.0);
        }
      `;
      // z值在相机距离片源近时为0;
      const texture = new THREE.TextureLoader().load("https://tow.oss-cn-hangzhou.aliyuncs.com/res/style3.png");
      texture.minFilter = THREE.NearestFilter;
      texture.magFilter = THREE.NearestFilter;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;


      const texture2 = new THREE.TextureLoader().load("https://tow.oss-cn-hangzhou.aliyuncs.com/res/style2.png");
      texture2.minFilter = THREE.NearestFilter;
      texture2.magFilter = THREE.NearestFilter;
      texture2.wrapS = THREE.RepeatWrapping;
      texture2.wrapT = THREE.RepeatWrapping;

      this.uniforms = {
        time: { type:'f', value:1.0 },
        u_resolution: {type:'v2', value:new THREE.Vector2(100,100) },
        sampleTexture: { type: "t", value:texture },
        textureWidthAndHeight: { type:'v2', value:new THREE.Vector2(16,16)}
      }

      this.uniforms2 = {
        time: { type:'f', value:1.0 },
        u_resolution: {type:'v2', value:new THREE.Vector2(100,100) },
        sampleTexture: { type: "t", value:texture2 },
        textureWidthAndHeight: { type:'v2', value:new THREE.Vector2(16,16)}
      }

      
      const geometry = new THREE.PlaneBufferGeometry(2, 2);
      const material = new THREE.ShaderMaterial({
        uniforms:this.uniforms,
        vertexShader:vert,
        fragmentShader:frag,
        transparent:true
      })

      const material2 = new THREE.ShaderMaterial({
        uniforms:this.uniforms2,
        vertexShader:vert,
        fragmentShader:frag,
        transparent:true
      })
      const geometry2 = new THREE.CircleGeometry( 1, 32 );
      const style2Mesh = new THREE.Mesh(geometry2, material2);
      style2Mesh.position.set(0,2,0);
      this.scene.add(style2Mesh);
      

      const basicMaterial = new THREE.MeshBasicMaterial({
        color:0x00a0e9,
        wireframe:true
      })
      const mesh = new THREE.Mesh(geometry,material);
      const mesh2 = new THREE.Mesh(geometry,basicMaterial);
      this.scene.add(mesh2);
      this.scene.add(mesh);

      this.onResize();
      window.addEventListener('resize',this.onResize,false);

    },
    onResize(){
      this.renderer.setSize(window.innerWidth,window.innerHeight);
      this.uniforms2.u_resolution.value.x = this.renderer.domElement.width;
      this.uniforms2.u_resolution.value.y = this.renderer.domElement.height;
      this.uniforms.u_resolution.value.x = this.renderer.domElement.width;
      this.uniforms.u_resolution.value.y = this.renderer.domElement.height;
    },
    render(){
      this.renderer.render(this.scene, this.camera);
    },
    animate(){
      
      requestAnimationFrame(this.animate);
      //if(!this.active || !this.playing) return;
      const delta = this.clock.getDelta();
      const t = this.clock;

      if(this.lineMaterial){
        this.lineMaterial.dashOffset+=0.04;
      }
      this.timeStamp += delta;
      this.stats.update();
        this.render();
      if (this.timeStamp > (1/this.FPS)) {
        
        this.timeStamp = (this.timeStamp % (1/this.FPS));
      }
    },
    /** 保存当前位置状态 */
    saveCubeGroupPosition(){
      if(this.cubeGroup && this.cubeGroup2){
        this.cubeGroup1Y = this.cubeGroup.position.y;
        this.cubeGroup2Y = this.cubeGroup2.position.y;
      }
    },
    loadCubeGroupPosition(){
      if( typeof this.cubeGroup1Y === 'number' && typeof this.cubeGroup2Y === 'number' ) {
        if(this.cubeGroup){
          this.cubeGroup.position.y = this.cubeGroup1Y;
        }
        if(this.cubeGroup2){
          this.cubeGroup2.position.y = this.cubeGroup2Y;
        }
      }
    },
    updateCubeGroup(delta,t){
      if(this.cubeGroup){
        this.cubeGroup.position.y-=delta*this.speed;
        if(this.cubeGroup.position.y< - 75){
          this.cubeGroup.position.y = 45
        }
      }
      if(this.cubeGroup2){
        this.cubeGroup2.position.y-=delta*this.speed;
        if(this.cubeGroup2.position.y < - 75){
          
          this.cubeGroup2.position.y = 45
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>

</style>