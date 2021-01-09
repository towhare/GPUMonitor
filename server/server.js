

const { exec } = require('child_process');
const { promisify } = require('util');
const httpServer = require("http").createServer();
const execAsync = promisify(exec);
const os = require('os');
const { clear } = require('console');

const startCPUs = os.cpus();
let oldCPUs = getCPUsCurrent();
const io = require("socket.io")(httpServer,{
    cors: {
        origin: ["http://localhost:8081","http://localhost:3333"],
        methods: ["GET", "POST"],
        allowedHeaders: ["Access-Control-Allow-Origin"],
        credentials: true
    }
});

httpServer.listen(3001);


/** 下面的内容为获取gpu相关的内容 */




/** 按顺序 获取总内存 已用内存 可用内存 温度 gpu占用百分比 */
const gpuCommand = 'nvidia-smi --format=csv,noheader --query-gpu=memory.total,memory.used,memory.free,temperature.gpu,utilization.gpu,encoder.stats.averageLatency';

const options = {
    env: {
        ...process.env,
        Path: 'C:\\Program Files\\NVIDIA Corporation\\NVSMI\\'
    },
    windowsHide:true
}
/** 获取当前CPU的前一秒内的时间 使用当前的占用减去之前的占用 */
function getCPUsCurrent(){
    const currentCpus = os.cpus();
    // 获取当前的使用时间
    // 只获取已使用的 和 空闲的
    const cpusFormatInfo = [];
    for(let cpu of currentCpus){
        const idleTime = cpu.times.idle;
        const usedTime = cpu.times.user + cpu.times.sys +cpu.times.irq + cpu.times.nice;
        const allTime = usedTime + idleTime;
        cpusFormatInfo.push({
            used:usedTime,
            all:allTime,
            idle:idleTime
        })
    }
    return cpusFormatInfo;
}

/** 保存一个cpu信息实例 */
class CPUInfo{
    constructor(){
        this.oldCpuInfo = this.getCPUsCurrent();
        this.date = new Date();
        this.timeNow = this.date.getTime();
        this.usedTime = 0;
    }
    getCPUsCurrent(){
        const currentCpus = os.cpus();
        // 获取当前的使用时间
        // 只获取已使用的 和 空闲的
        const cpusFormatInfo = [];
        for(let cpu of currentCpus){
            const idleTime = cpu.times.idle;
            const usedTime = cpu.times.user + cpu.times.sys +cpu.times.irq + cpu.times.nice;
            const allTime = usedTime + idleTime;
            cpusFormatInfo.push({
                used:usedTime,
                all:allTime,
                idle:idleTime
            })
        }
        return cpusFormatInfo;
    }
    /** 获取之前一秒的cpu占用 更改的部分
     * @returns {{used:number,idle:number,all:number}[]} 
    */
    getChangedCpus(){
        const now = this.date.getTime();
        this.usedTime = now - this.timeNow;
        this.timeNow = now;
        
        const currentCpus = getCPUsCurrent();
        // 获取更改的部分
        const changedCpus = [];
        for(let i = 0; i < currentCpus.length; i++){
            changedCpus.push({
                used: currentCpus[i].used - this.oldCpuInfo[i].used,
                idle: currentCpus[i].idle - this.oldCpuInfo[i].idle,
                all: currentCpus[i].all - this.oldCpuInfo[i].all
            })
        }
        this.oldCpuInfo = currentCpus;
        return changedCpus;
    }
}
const cpuInfomation = () => {
    const changedCpus = getChangedCpus();
    //console.log('changedCpus',changedCpus)
    let log = '';
    for(let i = 0; i < changedCpus.length;i++){
        log += ' --cpu'+(i+1)+': ' +Math.round((changedCpus[i].used/changedCpus[i].all)*100) + '%-- ';
    }
    //console.log(log);
}
//setInterval(cpuInfomation,2000);
async function getGPUTemperature() {
    const result = await execAsync(gpuCommand, options);
    if(result.stdout){
        let dataArray = result.stdout.replace('\r\n','').split(', ');
        // 如果是不支持的内容 则会显示[Not Supported];
        let gpuInfo = {};
        let gpuTotalMemory = Number(dataArray[0].replace(' MiB',''));
        let gpuMemoryUsed = Number(dataArray[1].replace(' MiB',''));
        let gpuMemoryAvailable = Number(dataArray[2].replace(' MiB',''));
        let gpuTemperature = Number(dataArray[3]);
        let gpuUsage = Number(dataArray[4].replace(' %',''));


        const log = '共有内存'+dataArray[0]+', 已用'+dataArray[1]+', 可用'+dataArray[2]+',温度:'+dataArray[3]+'°, 利用率:'+dataArray[4]
        gpuInfo = {
            gpuTotalMemory,
            gpuMemoryUsed,
            gpuMemoryAvailable,
            gpuTemperature,
            gpuUsage
        }
        return gpuInfo
    }
}
/** 获取温度
 * @returns {number|null} temperature 
 */
async function getTemperature(){
    const result = await execAsync(`nvidia-smi --format=csv,noheader --query-gpu=temperature.gpu`,options);
    if(result.stdout){
        const data = Number(result.stdout.replace('\r\n',''));
        if(data){
            return data;
        }
    }
    return null;
}



/** 暂存池 */
let pool = {

}

io.on('connection', socket => {
    console.log('newConnection');
    const cpuinfoInstance = new CPUInfo();
    let pushGPUInfomation = async () => {
        let info = await getGPUTemperature();
        socket.emit('gpuInfo', info);
        let temperature = await getTemperature();
        socket.emit('temperature',temperature);
    }

    let pushCPUInformation = () => {
        const cpus = cpuinfoInstance.getChangedCpus();
        socket.emit('cpuInfo',cpus);
    }

    
    const intervalId = setInterval(pushGPUInfomation, 1000);
    const cpuIntervalId = setInterval(pushCPUInformation,1000);

    pool[socket.id] = {
        intervalId,
        cpuIntervalId
    }

    socket.on('disconnect',function(){
        console.log('用户断开连接');
        if(pool[socket.id] && pool[socket.id].intervalId){
            console.log('清除循环');
            clearInterval(pool[socket.id].intervalId);
            if(typeof pool[socket.id].cpuIntervalId === 'number'){
                clearInterval(pool[socket.id].cpuIntervalId);
            }
        }
    });

    socket.on('message',function(msg){
        console.log('message:', msg);
    })
    socket.emit("hello", "world");
    
})
//getTemperature();
