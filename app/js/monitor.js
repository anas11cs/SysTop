const path = require('path');
const osu = require('node-os-utils');
const {ipcRenderer}=require('electron')
const cpu = osu.cpu;
const mem = osu.mem;
const os = osu.os;

let cpuOverLoad=30
let alertFrequency=1

ipcRenderer.on('settings:get',(e, settings) => {
    cpuOverLoad =+settings.cpuOverLoad
    alertFrequency =+settings.alertFrequency
})

// 2 Second Updates
setInterval(()=>{
    cpu.usage().then((info) => {
        document.getElementById('cpu-usage').innerText=info + '%'
        document.getElementById('cpu-progress').style.width=info +  '%'
        // console.log(cpuOverLoad)
        // console.log(alertFrequency)
        //ProgressBar 
        if(info >= cpuOverLoad){
            document.getElementById('cpu-progress').style.background='red'
        } else {
            document.getElementById('cpu-progress').style.background='#30c88b'
        }
        // Check OverLoad
        if(info >= cpuOverLoad && runNotify(alertFrequency)){
            // Notification Conf.
            notifyUser({
                title: 'CPU Overload',
                body: `CPU is over ${cpuOverLoad}%`,
                icon: path.join(__dirname, 'img','icon.png')
            })
           //console.log("Noti. Pop")
            localStorage.setItem('lastNotify',+new Date())
        }
    })
    cpu.free().then((info)/*Or info*/ => {
        document.getElementById('cpu-free').innerText=info + '%'
    })
},2000)
// 1 Second Updates
setInterval(()=>{
document.getElementById('sys-uptime').innerText=secondsToDayHourMinSec(os.uptime())
},1000)
// ======= CONSTANT UPDATES BELOW ========
//Set Model
document.getElementById('cpu-model').innerText=cpu.model();
// Computer Name
document.getElementById('comp-name').innerText=`${os.hostname()}`
// Total Memory
mem.info().then(info/*Or(info)*/ => {
document.getElementById('mem-total').innerText=info.totalMemMb
})
// Operating System
document.getElementById('os').innerText=`${os.platform()} ${os.arch()}`
// ========== Helper Functions ==========
function secondsToDayHourMinSec(seconds){
    seconds=+seconds
    const d=Math.floor(seconds / (3600*24))
    const h = Math.floor((seconds % (3600 * 24)) / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)
    return `${d}d, ${h}h, ${m}m, ${s}s`
}

// Send Notification
function notifyUser(options) {
    new Notification(options.title, options)
}
function runNotify(frequency){
    if(localStorage.getItem('lastNotify') === null ){
        //Store Current TimeStamp
        localStorage.setItem('lastNotify', +new Date())
        return true
    }
    const notifyTime = new Date(parseInt(localStorage.getItem('lastNotify')))
    const now = new Date()
    const diffTime = Math.abs(now - notifyTime)
    const minutesPassed = Math.ceil(diffTime / (1000*60))
    if(minutesPassed > frequency){
        return true
    }
    else
    {
        return false
    }
}