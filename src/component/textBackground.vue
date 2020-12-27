
<template>
  <div ref="threeContainer"></div>
</template>

<script>
import * as THREE from "three";
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
  },
  /**
   * @returns {{animationID:(number|null), renderer:THREE.WebglRenderer}} 
   */
  data: () => {
    return {
      animationID:null,
    };
  },
  computed: {},
  watch: {},
  mounted: function() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha:true
    });
    this.renderer.setSize(this.width,this.height);
    this.$refs.threeContainer.appendChild(this.renderer.domElement);
    this.initScene();
    this.initCamera();
    let cube = new THREE.Mesh(
      new THREE.BoxBufferGeometry(1,1,1),
      new THREE.MeshBasicMaterial({
        color:0xff0000
      })
    )
    cube.position.set(0,0,-1);
    this.scene.add(cube);
    this.cube = new THREE.Mesh(
      new THREE.BoxGeometry(1,1,1),
      new THREE.MeshBasicMaterial()
    )
    this.scene.add(this.cube);
    //this.initCubes();
    console.log('this.scene',this.scene)
    this.animate();
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
      console.log(this.camera)
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
      for(let i = 0; i < 2000;i++){
        const cubeClone = cube.clone();
        cubeClone.position.set(THREE.MathUtils.randFloat(-10,10),THREE.MathUtils.randFloat(-50,50),THREE.MathUtils.randFloat(-8,5));
        
        cubeGroup.add(cubeClone);
      }
      
      this.cubeGroup = cubeGroup;
      this.cubeGroup.position.set(0,40,0);
      this.scene.add(cubeGroup);
    },
    render(){
      this.renderer.render(this.scene, this.camera);
    },
    animate(){
      this.updateCubeGroup();
      requestAnimationFrame(this.animate);
      this.render();
    },
    updateCubeGroup(){
      if(this.cubeGroup){
        this.cubeGroup.position.y-=0.01;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>