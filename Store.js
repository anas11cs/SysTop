const electron= require('electron')
const path= require('path')
const fs= require('fs')
// https://medium.com/cameron-nokes/how-to-store-user-data-in-electron-3ba6bf66bc1e
class Store {
    constructor(options)
            {
                const userDataPath = (electron.app || electron.remote.app).getPath
                ('userData')
                this.path = path.join(userDataPath, options.configName +'.json')
                this.data = parseDatafile(this.path, options.defaults)
            }
    get(key)
            {
                return this.data[key]
            }
    set (key, val)
            {
                this.data[key]=val
                fs.writeFileSync(this.path, JSON.stringify(this.data))
            }
}

function parseDatafile(filePath, defaults){
    try
        {
            return JSON.parse(fs.readFileSync(filePath))
        }
    catch(err)
        {
            return defaults
        }
}
module.exports=Store