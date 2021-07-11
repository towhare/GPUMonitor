<template>
  <div class="percentageBarContainer">
      <div v-for="i in totalNumber" :key="i" class="childBar" :style="{backgroundColor:computeColor(i),border:'2px solid #3366ff'}"></div>
  </div>
</template>

<script>
// this is a component like this : [x] [x] [x] [ ] [ ] [ ] 
export default {
    name:"PercentageBar",
    props:{
        totalNumber:{
            type:Number,
            required:false,
            default:32
        },
        current:{
            type:Number,
            required:false,
            default:30
        }

    },
    computed:{
        
    },
    data:()=>{
        return{
            
        }
    },
    methods:{
        computeColor(i){
            if(i>=(this.current+1)){
                return 'rgba(255,255,255,0)'
            }
            const percent = i/this.totalNumber;
            if(percent < 0.5){
                return '#53e5ff'
            } else if( percent>= 0.5 && percent < 0.8){
                return '#12ccff'
            } else {
                return '#12aaff'
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .percentageBarContainer{
        width:auto;
        display: flex;
        flex-wrap:wrap;
        .childBar{
            width:15px;
            height:40px;
            background-color: #ccc;
            margin-left:2px;
        }
    }
</style>