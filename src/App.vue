<template>
  <div class="full-width center-content">
    <!-- 背景 -->
    <three-background class="background" :speed="Math.max(Math.min((gpuInfo.gpuUsage)/20,5),1)" />
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
    <percentage :percent="gpuInfo.gpuUsage" class="usage" />
  </div>
</template>

<script>
import io from "socket.io-client";
import axios from "axios";

import Bar from "./component/tempratureBar.vue";
import Percentage from "./component/circle.vue";
import THREEBackgrond from "./component/textBackground.vue";
export default {
  components: {
    "temprature-bar": Bar,
    percentage: Percentage,
    "three-background": THREEBackgrond,
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
      socketConneted:false,
      temperature: 0,
      usage: 0,
    };
  },
  computed: {},
  watch: {},
  mounted: function () {
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
    });

    this.socket.on("temperature", (temperature) => {
      this.temperature = temperature;
    });
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
  background-color: #222266;
  width: 100vw;
  height: 100vh;
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
  .usage {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    left: calc(50% - 150px);
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
