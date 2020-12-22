const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const gpuTempratureCommand = 'nvidia-smi --query-gpu=temperature.gpu --format=csv,noheader'; // change it for your OS
/** 按顺序 获取总内存 已用内存 可用内存 温度 gpu占用百分比 */
const gpuCommand = 'nvidia-smi --format=csv,noheader --query-gpu=memory.total,memory.used,memory.free,temperature.gpu,utilization.gpu ';
// 尝试运行到c盘
async function cdToC() {
    try {
        const result1 = await execAsync(cdCommand);
        console.log('result1', result1);
        return result1.stdout;
    } catch (error) {
        console.log('Error during getting GPU temperature');
        return 'unknown';
    }
}

async function getGPUTemperature() {
    const result = await execAsync(gpuCommand, {
        env: {
            ...process.env,
            Path: 'C:\\Program Files\\NVIDIA Corporation\\NVSMI\\'
        }
    });
    if(result.stdout){
        let dataArray = result.stdout.replace('\r\n','').split(', ');
        console.log('共有内存'+dataArray[0]+', 已用'+dataArray[1]+', 可用'+dataArray[2]+',温度:'+dataArray[3]+'°, 利用率:'+dataArray[4]);
        return result.stdout.replace('\r\n','');
    }

}

async function getTemperature(){
    let temperature = await getGPUTemperature();

    let gettemp = async () =>{
        let t = await getGPUTemperature();
    }
    setInterval(gettemp,1000);
}


getTemperature();
//getGPUTemperature();
//console.log('process.env',process.env)