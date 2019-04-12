
const electron = require('electron');
var ipc = electron.ipcMain
const browserWindow = electron
const app = electron.app
var mainWindow= null;// = new electron.BrowserWindow()
//var nforce = require('nforce')
var fs = require('fs')
var test = require('./module1')
//let Menu = electron.Menu;
//var t = fs.open('file:\\aus-ppatel.nfp.com\TestLogs\test.txt')
const http = require('http')
//var ht = http.get("http://training.nfp.com",_=>mainWindow.loadURL)
app.on('ready',_=>{
    
console.log("Started");
//loadModule();
test.load();
//var t = document.getElementById('test')
});

ipc.on('cut',
 function(t)
 {
    var request = require("request");
        var encodedPat ='{cmFjZS5qZWV0QGhvdG1haWwuY29tOkFkaXRpMDEq}';
        var options =
         {
            method: 'GET',
            headers: { 'cache-control': 'no-cache', 'authorization': `Basic ${encodedPat}` },
            url: 'https://myproject8311.visualstudio.com/My%20First%20Project/_workitems/',
            qs: { 'api-version': '1.0' }
        };
 
        request(options, function (error, response, body)
         {  
            if (error) throw new Error(error);
            console.log(body);
         });
         
        })
    
    //     otherWindow  = new electron.BrowserWindow({
    //     height : 400,
    //     width : 400,
    //    // loadURL : 'http://localhost:4444/grid/console'
    // })
    //     otherWindow.loadURL('http://localhost:4444/grid/console')



ipc.on('cut1', function(e,t){
        otherWindow  = new electron.BrowserWindow({
        height : 400,
        width : 400,
        //loadURL : 'https://youtube.com'//'http://localhost:4444/grid/admin/live'
    })
       otherWindow.loadURL(t)//'http://localhost:4444/grid/admin/live')
       
})
   
//docker run --rm -ti --name zalenium -p 4444:4444 -v /var/run/docker.sock:/var/run/docker.sock -v /tmp/videos:/home/seluser/videos --privileged dosel/zalenium start


