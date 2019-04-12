
    //const electron = require('electron');
    //const BrowserWindow = electron.BrowserWindow;

var load = function()
{
   // var ipc = require('ipc')
    const electron = require('electron');
let $ = require("jquery")    
    var fs = require('fs')
    mainWindow  = new electron.BrowserWindow(
        {
            height : 400,
            width : 400
        }
    )

    mainWindow.webContents.openDevTools();
    //mainWindow.loadURL('http://training.nfp.com')   
    const name = electron.app.getName()   
    console.log(name)            
//     const template = [{
//         label : name,
//         submenu:[
//             { label: 'About ${name}' },
//             { type:'separator'},
//             { label:'Quit', click: _=>{electron.app.quit()}, accelerator:'CTRl+Q'},
//             {role:'about'}
//             ]
// }];
    // const menu = electron.Menu.buildFromTemplate(template);  
    // electron.Menu.setApplicationMenu(menu)    
    
    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname+'/html/test.html'); //aus-ppatel.nfp.com/TestLogs/test.html')//file://./HTML/test.html')//'https://test.salesforce.com')//file://aus-ppatel.nfp.com/TestLogs/test.txt');

   



    //BrowserWindow.getCurrentWindow().loadURL('https://test.salesforce.com');//'file://{__dirname}/test.html');
    //var t = fs.open('file:\\aus-ppatel.nfp.com\TestLogs\test.txt')
    //mainWindow.webContents = t

     //$(document).ready(function($){

// var t = $(document).ready(function()
//     {
//     $('a').on('click',function()
// {
//     mainWindow.loadURL('https://test.salesforce.com')
// });
//     })

 //});
  
};
module.exports.load = load;