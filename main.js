'use strict'

// Import parts of electron to use
const { app, BrowserWindow ,ipcMain } = require('electron')
const path = require('path')
const url = require('url')

//Imports for the database handling
const queryManager = require("./src/dataBase/querys.js")
const basicManage = require("./src/dataBase/UserDataManagment/mainWinBasic.js")



// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// Keep a reference for dev mode
let dev = false

// Broken:
// if (process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)) {
//   dev = true
// }

if (process.env.NODE_ENV !== undefined && process.env.NODE_ENV === 'development') {
  dev = true
}

// Temporary fix broken high-dpi scale factor on Windows (125% scaling)
// info: https://github.com/electron/electron/issues/9691
if (process.platform === 'win32') {
  app.commandLine.appendSwitch('high-dpi-support', 'true')
  app.commandLine.appendSwitch('force-device-scale-factor', '1')
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1200,
    minHeight:650,
    show: false,
    icon: './assets/icon.ico',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
        //below one gives us permission to load machine files which we use to play !important
      webSecurity: false,	
    },
    frame:false
  })


  let indexPath

  if (dev && process.argv.indexOf('--noDevServer') === -1) {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'index.html',
      slashes: true
    })
  } else {
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'index.html'),
      slashes: true
    })
  }

  mainWindow.loadURL(indexPath)

  // Don't show until we are ready and loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()

    // Open the DevTools automatically if developing
    if (dev) {
      const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer')

      installExtension(REACT_DEVELOPER_TOOLS)
        .catch(err => console.log('Error loading React DevTools: ', err))
      mainWindow.webContents.openDevTools()
    }
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)



// -------------------------------------------------------------------------//
// database connection and entry retrivals start
// -------------------------------------------------------------------------//

function getNewDetail(name) {
  // console.log(name);
	mainWindow.webContents.send('logs:MainWindow:Update',name);
}

ipcMain.on('logs:MainWindow:call',(e , data)=>{
	// console.log(data[0])
	if(data[0]==='getData'){
		// we are also executing getIds with getData in basicManageof getData case:
		basicManage.acceptcall(['getData',userData],getNewDetail)
	}
	else{
		basicManage.acceptcall(data,getNewDetail)
	}
})

// window.onload = () => {
//   queryManager.CreateIfNotExist();
// }
// -------------------------------------------------------------------------//
// database connection and entry retrivals close
// -------------------------------------------------------------------------//














// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})










// Stop error
app.allowRendererProcessReuse = true
