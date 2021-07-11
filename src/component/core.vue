/** cpu 核心展示组件 */
<template>
  <div class="coreflex">
    <div class="coreBox">
      <div class="top lineGroup">
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
      </div>
      <div class="bottom lineGroup">
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
      </div>
      <div class="left lineGroupCol">
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
      </div>
      <div class="right lineGroupCol">
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
      </div>
      <div class="corePercent" :style="{height:percent+'%'}"></div>
      <div class="border"></div>
    </div>
    <div class="text">{{percent}}%</div>
  </div>
</template>

<script>
export default {
  name: "Core",
  // 百分比
  props:{
    percent:{
      type:Number,
      required: false
    }
  },
  watch:{
  }
}
</script>

<style lang="scss" scoped>
.coreflex{
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 40px auto;
  .coreBox{
    width: 24px;
    height: 24px;
    margin-right:20px;
    //background-color: #53e5ff;
    position:relative;
    .lineGroup{
      width:100%;
      height:30%;
      display: flex;
      position:absolute;
      justify-content: center;
      .line{
        width:2px;
        height:100%;
        background-color:#53e5ff;
        margin:0 2px;
      }
    }
    .lineGroupCol{
      width:30%;
      height:100%;
      display: flex;
      flex-direction: column;
      position:absolute;
      justify-content: center;
      .line{
        width:100%;
        height:2px;
        background-color:#53e5ff;
        margin:2px 0;
      }
    }
    .corePercent{
      width:100%;
      position:absolute;
      bottom:0;
      background-color:  #53e5ff;
      transition:all 1s;
    }
    .border{
      width:100%;
      height: 100%;
      border:2px solid #53e5ff;
    }
    .top{
      top:-30%;
      left:0;
    }
    .bottom{
      bottom:-30%;
      left:0
    }
    .left{
      left:-30%;
    }
    .right{
      right:-30%;
    }
  }
  .text{
    color:#53e5ff;
    width:60px;
  }
}
</style>