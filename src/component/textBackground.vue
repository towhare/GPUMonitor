
<template>
  <div ref="threeContainer"></div>
</template>

<script>
import * as THREE from "three";
import Stats from 'three/examples/jsm/libs/stats.module.js';
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
  watch: {},
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
      alpha:true
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
        cubeClone.position.set(THREE.MathUtils.randFloat(-10,10),THREE.MathUtils.randFloat(-30,30),THREE.MathUtils.randFloat(-8,5));
        
        cubeGroup.add(cubeClone);
      }
      
      this.cubeGroup = cubeGroup;
      this.cubeGroup2 = cubeGroup.clone();
      this.cubeGroup.position.set(0,15,0);
      this.cubeGroup2.position.set(0,75,0);
      this.scene.add(this.cubeGroup2);
      this.scene.add(cubeGroup);
    },
    render(){
      this.renderer.render(this.scene, this.camera);
    },
    animate(){
      
      requestAnimationFrame(this.animate);
      if(!this.active) return;
      const delta = this.clock.getDelta();
      const t = this.clock;
      this.updateCubeGroup(delta);
      this.timeStamp += delta;
      if (this.timeStamp > (1/this.FPS)) {
        this.stats.update();
        this.render();
        this.timeStamp = (this.timeStamp % (1/this.FPS));
      }
    },
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