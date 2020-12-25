// 0-100的分值 增加渐变
<template>
  <div class="container">
    <div class="full" :style="fullBarStyle"></div>
    <div class="current" :style="currentStyle">{{current}}MB</div>
    <div class="total" >{{total}}MB</div>
  </div>
</template>

<script>
export default {
  name: "Bar",
  props: {
    name: {
      type: String,
      required: true,
    },
    current:{
      type:Number,
      required: false
    },
    total:{
      type:Number,
      required:true
    }
  },
  data:()=>{
    return{
      styleObject: {
        color: 'red',
        fontSize: '13px'
      },
      currentStyle:{
        bottom:'0%'
      },
      fullBarStyle:{
        height:'50%'
      }
    }
  },
  watch:{
    current(val){
      const p = val/this.total * 100;
      this.currentStyle.bottom = ''+p+'%';
      this.fullBarStyle.height = ''+p+'%';
    }
  }
};
</script>

<style lang="scss" scoped>

.container{
  color:#5ee7ff;
  width:120px;
  height:200px;
  border:1px solid #5ee7ff;
  position:relative;
  .full{
    width:100%;
    height:50%;
    bottom:-1px;
    position:absolute;
    background-color: rgba(30,255,255,0.8);
    transition:0.8s height;
  }
  .total{
    width:100%;
    height:24px;
    font-size:20px;
    line-height: 24px;
    position:absolute;
    top:-24px;
    text-align:center;
  }
  .current{
    position:absolute;
    font-size:18px;
    text-align:center;
    width:100%;
    transition:0.8s bottom;

  }
}
</style>