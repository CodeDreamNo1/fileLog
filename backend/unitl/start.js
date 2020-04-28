const child_process = require("child_process");
const child = ['interval-cn.js', 'interval-us.js', 'interval-eu.js', 'interval-au.js'];
function start() {
    for (let i = 0; i < child.length; i ++) {
        const childProcessorExec = child_process.exec("node " + child[i], function(error, stdout, stderr) {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
        });
    
        childProcessorExec.on("exit", function(code) {
            console.log("Child process exited, code: " + code);
        });
    }
}
start();
setInterval(start, 10800000) //定时任务3个小时执行一次