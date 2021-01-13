
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
    this.initDashLine();
    console.log('this.scene',this.scene)
    this.stats = new Stats();
    this.$refs.threeContainer.appendChild( this.stats.dom );
    this.initControls();
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
    // 新增虚线线条
    initDashLine(){
      //创建路径 此处为圆形
      let pointsNumber = 500;
      let curve = new THREE.EllipseCurve(
        0,0,
        3,3,
        0, 2*Math.PI,
        false,
        0
      )
      let curve3 = new THREE.EllipseCurve(
        0,0,
        6,6,
        0, 2*Math.PI,
        false,
        0
      )
      let points = curve.getPoints(pointsNumber);

      let cubeBezierCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3( -5, 0, 4 ),
      new THREE.Vector3( -3, 2, 0 ),
      new THREE.Vector3( 5, 2, 0 ),
      new THREE.Vector3( 2, 0, -4 )
    );
      let points2 = cubeBezierCurve.getPoints(80);

      const geometry2 = new LineGeometry();
      let positions = [];
      let colors = [];
      const color = new THREE.Color();
      for(let point of points){
        positions.push(point.x,point.y,0);
        color.setHSL(1,1.0,0.5);
        colors.push(color.r, color.g, color.b);
      }

      let positions2 = [];
      for(let point of points2){
        positions2.push(point.x,point.y,point.z);
      }
      geometry2.setPositions(positions);


      let geometry3 = new LineGeometry();
      geometry3.setPositions(positions2);
      
      const lineMaterial = new LineMaterial({
        color:0xff00ff,//设置颜色
        linewidth:3,// 宽度
        dashScale:2,
        dashSize:2, // 复制的总长 2个单位一个循环
        dashOffset:0,
        lines:[0.1,0.4,0.5,0.8] // 指的是在0.1-0.4  0.5 -0.8中间挖空 最终的结果是 长度
        // 总长为2个单位 类似于 [-   -   ------------]
      })
      
      
      lineMaterial.resolution.set(window.innerWidth,window.innerHeight); //将界面的宽高传进去对宽度至关重要
      lineMaterial.defines.USE_DASH = "";// 是否设置为点划线
      lineMaterial.needsUpdate = true;
      

      const lineMaterial2 = new LineMaterial({
        color:0xcccc00,// 黄色
        linewidth:2,// 宽度
        dashScale:5,//越大越密集 默认值为1
        dashSize:5,
        dashOffset:0,//偏移量
        lines:[
          0.5,1.0,
          1.2,1.7,
          1.9,2.4
        ] // 在0.5-1.0 1.2-1.7 1.9-2.4之间挖空 类似于[--  -  -  ---------------]
      })
      lineMaterial2.defines.USE_DASH = "";// 设置为点划线
      lineMaterial2.resolution.set(window.innerWidth,window.innerHeight);
      lineMaterial2.needsUpdate = true;


      const dashedMaterial = new THREE.LineDashedMaterial( { scale: 2, dashSize: 1, gapSize: 1 } );
      

      this.line = new Line2(geometry2,lineMaterial);
      this.line.computeLineDistances();
      this.line.scale.set(1,1,1);
      this.scene.add(this.line);

      // 第二条贝塞尔曲线
      
      console.log('添加第二条曲线');
      let line2 = new Line2(geometry3, lineMaterial2);
      line2.computeLineDistances();
      line2.scale.set(1,1,1);
      this.scene.add(line2);
      const material3 = lineMaterial2.clone();
      material3.color = new THREE.Color(0x0033ee);//复制并且更改颜色
      this.lineMaterial = material3;

      console.log('添加第三条曲线');
      let line3 = new Line2(geometry3, material3);
      line3.computeLineDistances();
      line3.rotation.set(0.3,0.3,0.3);
      this.scene.add(line3);
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
      //if(!this.active || !this.playing) return;
      const delta = this.clock.getDelta();
      const t = this.clock;

      if(this.lineMaterial){
        this.lineMaterial.dashOffset+=0.04;
      }
      this.timeStamp += delta;
      if (this.timeStamp > (1/this.FPS)) {
        this.stats.update();
        this.render();
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