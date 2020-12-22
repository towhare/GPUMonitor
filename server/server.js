const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const gpuTempratureCommand = 'nvidia-smi --query-gpu=temperature.gpu --format=csv,noheader'; // change it for your OS
const cdCommand = 'C: ';
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
    const result = await execAsync(gpuTempratureCommand, {
        env: {
            ...process.env,
            Path: 'C:\\Program Files\\NVIDIA Corporation\\NVSMI\\'
        }
    });
    if(result.stdout){
        return result.stdout.replace('\r\n','');
    }

}
// exec(gpuTempratureCommand, {
//     env: {
//         ...process.env,
//         Path: 'C:\\Program Files\\NVIDIA Corporation\\NVSMI\\'
//     }
// }, (err, stdout, stderr) => {
//     console.log('error', err);
//     console.log('stdout', stdout);
//     console.log('stderr', stderr);
// })

async function getTemperature(){
    let temperature = await getGPUTemperature();
    if(temperature){
        console.log('温度是'+temperature+'°');
    }
}
getTemperature();
//listInfomation();
//console.log('process.env',process.env)