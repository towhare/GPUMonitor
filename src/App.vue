<template>
  <div class="full-width center-content">
    <!-- 背景 -->
    <three-background class="background" 
      :speed="Math.max(Math.min((gpuInfo.gpuUsage)/20,5),1)" 
      :playing="backgroundPlaying"
    />
    <van-switch v-model="backgroundPlaying" class="backgroundPlaying"/>
    <!-- GPU信息 -->
    <div class="gpuInfo">
      <span>{{socketConneted?'已连接':'未连接'}} </span>
      <span
        >总显存{{ gpuInfo.gpuTotalMemory }}MB,已用{{
          gpuInfo.gpuMemoryUsed
        }}MB,可用{{ gpuInfo.gpuMemoryAvailable }}MB,温度{{
          gpuInfo.gpuTemperature
        }}°,使用率{{ gpuInfo.gpuUsage }}%</span
      >
    </div>
    <temprature-bar
      name=""
      :percent="20"
      class="memory"
      :total="gpuInfo.gpuTotalMemory"
      :current="gpuInfo.gpuMemoryUsed"
    />
    <temprature-bar
      name="ramInformation"
      class="ram"
      :total="memoryInfo.total"
      :current="memoryInfo.used"
    />
    <div class="newRam">
      <div class="controlBlock">
        <div class="blockName">内存</div>
        <percentage-bar :current="ramInUseInGB" :totalNumber="totalRamMemoryInGB"/>
      </div>
      <div class="controlBlock">
        <div class="blockName">显存</div>
        <percentage-bar :current="GPURamUsedMemoryInGB" :totalNumber="GPURamTotalMemoryInGB"/>
      </div>
      <div class="controlBlock">
        <div class="blockName">显卡使用量</div>
        <percentage-bar :current="(this.gpuInfo.gpuUsage * 32 / 100)" :totalNumber="32"/>
      </div>
      
    </div>
    
    <percentage :percent="gpuInfo.gpuUsage" class="usage" />
    <div class="cpus">
      <core v-for="(item,i) in cpuInfo" :key="i" :percent="item.percent"/>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
import axios from "axios";

import Bar from "./component/tempratureBar.vue";
import PercentageBar from './component/percentageBar.vue';
import Percentage from "./component/circle.vue";
import Core from "./component/core.vue";
import THREEBackgrond from "./component/textBackground.vue";


var wallpaperPropertyListener = {
    applyUserProperties: function(properties) {
      console.log('',properties)
        if (properties.yourproperty) {
            // Do something with yourproperty
        }
        if (properties.anotherproperty) {
            // Do something with anotherproperty
        }
        // Add more properties here
    },
};

export default {
  components: {
    "temprature-bar": Bar,
    percentage: Percentage,
    "three-background": THREEBackgrond,
    "core":Core,
    PercentageBar,
  },
  data: () => {
    return {
      name: "towrabbit",
      gpuInfo: {
        gpuTotalMemory: 0,
        gpuMemoryUsed: 0,
        gpuMemoryAvailable: 0,
        gpuTemperature: 0,
        gpuUsage: 0,
      },
      cpuInfo:[
        {
          percent:0,
        }
      ],
      memoryInfo:{
        total:0,
        used:0,
      },
      socketConneted:false,
      temperature: 0,
      usage: 0,
      backgroundPlaying:true
    };
  },
  computed: {
    totalRamMemoryInGB(){
      const memoryInGB=(this.memoryInfo.total/1024);
      console.log('memoryInGB',memoryInGB)
      if(memoryInGB<=0){
        console.log('return 1')
        return 1
      } else {
        return Math.round(memoryInGB)
      }
    },
    ramInUseInGB(){
      
      return (this.memoryInfo.used/1024);
    },
    GPURamTotalMemoryInGB(){
      const gpuTotalMemoryInGB =  Math.round(this.gpuInfo.gpuTotalMemory/1024);
      if(gpuTotalMemoryInGB<=0){
        return 1;
      } else {
        return gpuTotalMemoryInGB;
      }
    },
    GPURamUsedMemoryInGB(){
      console.log('GPURamInuse',Math.round(this.gpuInfo.gpuMemoryUsed/1024))
      return Math.round(this.gpuInfo.gpuMemoryUsed/1024);
    },
    
  },
  watch: {},
  mounted: function () {
    const MB = 1024*1024;
    this.socket = io("http://localhost:3001");
    this.socket.on("connect", (item) => {
      console.log("socket connected", this.socket.id);
      this.socketConneted = true;
    });

    this.socket.on("disconnect", () => {
      console.log("disconnected", this.socket.id);
      this.socketConneted = false;
    });

    this.socket.on("hello", (message) => {
      console.log("message", message);
    });

    this.socket.on("gpuInfo", (info) => {
      this.gpuInfo.gpuTotalMemory = info.gpuTotalMemory;
      this.gpuInfo.gpuMemoryUsed = info.gpuMemoryUsed;
      this.gpuInfo.gpuMemoryAvailable = info.gpuMemoryAvailable;
      this.gpuInfo.gpuTemperature = info.gpuTemperature;
      this.gpuInfo.gpuUsage = info.gpuUsage;
      console.log('gpuUsage',this.gpuInfo.gpuUsage)
    });

    this.socket.on("ramInfo",info => {
      this.memoryInfo.total = Math.floor(info.total/MB);
      this.memoryInfo.used = Math.floor(info.used/MB);
    })

    this.socket.on("temperature", (temperature) => {
      this.temperature = temperature;
    });

    this.socket.on("cpuInfo",(cpuInfo)=>{
      const newCpuInfo = [];
      for(let cpu of cpuInfo){
        newCpuInfo.push({
          percent:Math.round((cpu.used/cpu.all)*100)
        })
      }
      this.cpuInfo = newCpuInfo;
    })
  },

  methods: {},
};
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.full-width {
  color: #53e5ff;
  background-color: #222266;
  width: 100vw;
  height: 100vh;
  .backgroundPlaying{
    position:absolute;
    top:20px;
    right:30px;
  }
  .background{
    position:fixed;
    top:0;
    left:0;
  }
  .memory {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .ram{
    position:absolute;
    top:50%;
    left:50%;
    transform: translate(55%,-50%);
  }
  .newRam{
    position:absolute;
    top:20%;
    left:50%;
    width: 70%;
    font-size:32px;
    transform: translate(-50%,-50%);
    .controlBlock{
      padding:6px;
      margin:20px 0;
      // border:2px solid #53e5ff;
      .blockName{
        text-align: center;
        margin:5px auto 10px auto;
      }
    }
  }
  .usage {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    left: calc(50% - 150px);
  }
  .cpus{
    position:absolute;
    top:50%;
    transform: translate(0,-50%);
    right:20px;
  }
}
.gpuInfo {
  font-size: 30px;
  font-weight: 100;
  color: white;
  text-shadow: 0px 0px 5px #53e5ff;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 100px;
  width: 100%;
}
</style>
