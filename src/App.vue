<template>
  <div class="full-width center-content">
      <div class="gpuInfo">
          {{gpuInfo}}
      </div>
    
  </div>
</template>

<script>
import io from 'socket.io-client';
import axios from 'axios';
export default {      
  components: {

  },
  data: () =>{
    return {
        name:'towrabbit',
        gpuInfo:''
    }
  },
  computed:{
    
  },
  watch:{

  },
  mounted: function(){
        this.socket = io('http://localhost:3001');
        this.socket.on("connect", (item) => {
            console.log('socket connected', this.socket.id);
        })

        this.socket.on("disconnect", () => {
            console.log('disconnected',this.socket.id);
        })

        this.socket.on("hello", (message) => {
            console.log("message",message)
        })
        this.socket.on("gpuInfo", (info) => {
            this.gpuInfo = info;
        })

  },

  methods: {

  }
}


</script>

<style lang="scss" scoped>
*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}
.full-width{
    display:flex;
    justify-content: center;
    align-items:center;
    background-color: #222266;
    width:100vw;
    height:100vh;
}
.gpuInfo{
    font-size:40px;
    color:white;
    text-shadow:1px chartreuse;
    text-align:center;
    
}
</style>
