const os = require('os');

console.log(os.cpus());
console.log(os.freemem());
setInterval(()=>{
  let userTimes = os.cpus()[0].times['user'];
  console.log('userTImes',userTimes)
}, 1000);