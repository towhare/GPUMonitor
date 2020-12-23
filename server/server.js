

const { exec } = require('child_process');
const { promisify } = require('util');
const httpServer = require("http").createServer();
const execAsync = promisify(exec);

const io = require("socket.io")(httpServer,{
    cors: {
        origin: "http://localhost:8081",
        methods: ["GET", "POST"],
        allowedHeaders: ["Access-Control-Allow-Origin"],
        credentials: true
    }
});



httpServer.listen(3001);


/** 下面的内容为获取gpu相关的内容 */




/** 按顺序 获取总内存 已用内存 可用内存 温度 gpu占用百分比 */
const gpuCommand = 'nvidia-smi --format=csv,noheader --query-gpu=memory.total,memory.used,memory.free,temperature.gpu,utilization.gpu ';

async function getGPUTemperature() {
    const result = await execAsync(gpuCommand, {
        env: {
            ...process.env,
            Path: 'C:\\Program Files\\NVIDIA Corporation\\NVSMI\\'
        }
    });
    if(result.stdout){
        let dataArray = result.stdout.replace('\r\n','').split(', ');
        const data = '共有内存'+dataArray[0]+', 已用'+dataArray[1]+', 可用'+dataArray[2]+',温度:'+dataArray[3]+'°, 利用率:'+dataArray[4]
        console.log(data);
        return data;
    }

}

async function getTemperature(){
    let temperature = await getGPUTemperature();

    let gettemp = async () =>{
        let t = await getGPUTemperature();
    }
    setInterval(gettemp,1000);
}

let pool = {

}

io.on('connection', socket => {
    console.log('newConnection');
    let pushGPUInfomation = async () => {
        let info = await getGPUTemperature();
        socket.emit('gpuInfo', info);
    }
    const intervalId = setInterval(pushGPUInfomation, 1000);

    pool[socket.id] = {
        intervalId
    }

    socket.on('disconnect',function(){
        console.log('用户断开连接');
        if(pool[socket.id] && pool[socket.id].intervalId){
            console.log('清除循环');
            clearInterval(pool[socket.id].intervalId);
        }
    });

    socket.on('message',function(msg){
        console.log('message:', msg);
    })
    socket.emit("hello", "world");

    
})
//getTemperature();
