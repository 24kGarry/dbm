import { app, BrowserWindow, Menu, globalShortcut } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */

const platform = process.platform
const env = process.env.NODE_ENV

if (env !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

const path = require('path')

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      // uncaught referenceerror module is not defined see https://stackoverflow.com/questions/66506331/electron-nodeintegration-not-working-also-general-weird-electron-behavior
      contextIsolation: false
    }
  })

  // Maximize window
  mainWindow.maximize()

  // Support copy and paste on mac
  if (platform === 'darwin') {
    const template = [
      {
        label: 'Application',
        submenu: [
          {
            label: 'About',
            role: 'about'
          },
          {
            label: 'Quit',
            accelerator: 'Command+Q',
            click: function() {
              app.quit()
            }
          }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          {
            label: 'Copy',
            accelerator: 'CmdOrCtrl+C',
            selector: 'copy:'
          },
          {
            label: 'Cut',
            accelerator: 'CmdOrCtrl+X',
            selector: 'cut:'
          },
          {
            label: 'Paste',
            accelerator: 'CmdOrCtrl+V',
            selector: 'paste:'
          },
          {
            label: 'Select All',
            accelerator: 'CmdOrCtrl+A',
            selector: 'selectAll:'
          }
        ]
      }
    ]
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
  } else {
    Menu.setApplicationMenu(null)
  }

  // Support developer mode application icon display
  if (env === 'development') {
    app.dock.setIcon(path.join(__dirname, 'assets/images/', platform, '/logo.png'))
  }

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

/**
 * About Application
 */
import config from '../../package.json'

app.setAboutPanelOptions({
  applicationName: config.name,
  description: config.description,
  applicationVersion: config.version,
  version: config.version,
  credits: config.credits,
  copyright: config.author,
  website: config.github
})

app.on('ready', () => {
  if (mainWindow == null) {
    createWindow()
  }
  // Turn on debug mode
  globalShortcut.register('CommandOrControl+Shift+L', () => {
    const focusWin = BrowserWindow.getFocusedWindow()
    focusWin && focusWin.toggleDevTools()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
