<template>
  <div class="container">
    <div class="innerCircle" :style="styleObject"></div>  
    <div class="number">{{percent}}%</div>
  </div>
</template>

<script>
export default {
  name: "Percentage",
  props:{
    percent:{
      type:Number,
      required: false
    }
  },
  data:()=>{
    return{
      styleObject: {
        width:'100px',
        height:'100px',
        backgroundColor:'rgba(30, 238, 30, 0.5)'
      }
    }
  },
  watch:{
    percent(val){
      console.log('percenter val',val);
      this.styleObject.width = ''+(val)+'px';
      this.styleObject.height = ''+(val)+'px';
      this.styleObject.backgroundColor = 'rgba('+(Math.floor(214*(val/100))+30)+', '+(30+ Math.floor( (208)*((100-val)/100) ) )+', 30, 0.5)'
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  display: flex;
  width:100px;
  height:100px;
  border-radius: 50%;
  border:2px solid #5ee7ff;
  justify-self: center;
  justify-content: center;
  align-items: center;
  position:relative;
  .number{
    display: block;
    color:white;
  }
  .innerCircle{
    position:absolute;
    top:50%;
    left:50%;
    width: 50px;
    height: 50px;
    background-color: rgba(244, 30, 30, 0.5);
    border-radius: 50%;
    transform:translate(-50%,-50%);
    transition:all 0.7s;
  }
}
</style>