const electron = require('electron');
const {
	app,
	BrowserWindow,
	Menu
} = electron;

const contextMenu = require('electron-context-menu');
const shell = require('electron').shell
var path = require('path');
var weburl = 'https://servers.fivem.net/';

var menu = Menu.buildFromTemplate([{
	label: 'Menu',
	submenu: [{
			label: 'Open in Browser',
			click() {
				shell.openExternal(weburl)
			}
		},
		{
			label: 'Minimize',
			accelerator: 'CmdOrCtrl+M',
			role: 'minimize'
		},
		{
			label: "Refresh Page",
			accelerator: "CmdOrCtrl+R",
			click() {
				mainWindow.reload();
			}
		},
		{
			type: 'separator'
		},
		{
			label: "Toggle Page Cleanup",
			click() {
				try{
					mainWindow.webContents.executeJavaScript(`const element = document.getElementsByClassName("ad with-links"); element[0].remove();`);
					mainWindow.webContents.executeJavaScript(`const element2 = document.getElementsByClassName("rent-a-server cfx-header-item label-left"); element2[0].remove();`);
					mainWindow.webContents.executeJavaScript(`addEventListener("click", (event) => { element[0].remove(); element2[0].remove(); });`);
			
				} catch(error){
					console.log(error)
				}
			}
		},
		{
			label: "Disable Advertised Servers",
			click() {
				try{
					mainWindow.webContents.executeJavaScript(`const ADV = document.getElementsByClassName("pins"); ADV[0].remove();`);
					mainWindow.webContents.executeJavaScript(`const ADV1 = document.getElementsByClassName("nav-item subnav-item"); ADV1[1].remove();`);		
					mainWindow.webContents.executeJavaScript(`addEventListener("click", (event) => { ADV[0].remove(); ADV1[1].remove(); });`);	
				} catch(error){
					console.log(error)
				}
			}
		},
		{
			type: 'separator'
		},
		{
			label: "Toggle Developer Tools",
			click() {
				mainWindow.webContents.openDevTools();
			}
		},
		{
			type: 'separator'
		},
		{
			label: 'Exit',
			click() {
				app.quit()
			}
		},
		{
			label: 'Made By : ZF9#7655',
		}
	],
}])


Menu.setApplicationMenu(menu);


contextMenu({
	prepend: (params) => [{
		label: 'Menu',

		visible: params.mediaType === 'image'
	}]
});

let mainWindow;
app.setName('FiveM');
app.on('ready', () => {
	mainWindow = new BrowserWindow({
		width: 1000,
		height: 700,
		icon: path.join(__dirname, '/assets/icons/icon.png')
	});

	mainWindow.setTitle('FiveM');
	mainWindow.webContents.userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36";
	mainWindow.loadURL(weburl);
	mainWindow.webContents.executeJavaScript(`const element1 = document.getElementsByClassName("site-links"); element1[0].remove();`);
    setTimeout(() => {
		mainWindow.webContents.executeJavaScript(`alert("To Make Website Look Better Press :  Menu > Toggle Page Cleanup + Disable Advertised Servers");`);
    }, 5000);
	setTimeout(() => {
		mainWindow.webContents.executeJavaScript(`alert("Made By : ZF9#7655");`);
    }, 20000);

	mainWindow.on('closed', () => {
		mainWindow = null;
	});
	
});

app.on('second-instance', (event, webContents) => {
	console.log(event)
	console.log(webContents)
});

const { protocol } = require('electron')
const url = require('url')
const { exec } = require("child_process"); 
const request  = require('electron-request')

app.whenReady().then(async() => {
  protocol.registerFileProtocol('fivem', async(requesta, callback) => {
	let ConnectURL = requesta.url;
    console.log(ConnectURL)
	ConnectURL = ConnectURL.replace("fivem://connect/", "")
	console.log(ConnectURL)
	const url = `https://servers-frontend.fivem.net/api/servers/single/${ConnectURL}`;
	const defaultOptions = {
	  method: 'GET',
	  body: null,
	  followRedirect: true,
	  maxRedirectCount: 20,
	  timeout: 0,
	  size: 0,
	};
	const response = await request(url, defaultOptions);
	const text = await response.text();
	const GameBuild = JSON.parse(text).Data.vars.sv_enforceGameBuild;
	const PureLevel = JSON.parse(text).Data.vars.sv_pureLevel;
	console.log(GameBuild)
	if (PureLevel === "1"){
		exec(`"C:\\Users\\%username%\\AppData\\Local\\FiveM\\FiveM.exe" -b${GameBuild} -pure_1 -switchcl:5728 "${requesta.url}"`);
	}
	else{
		exec(`"C:\\Users\\%username%\\AppData\\Local\\FiveM\\FiveM.exe" -b${GameBuild} -switchcl:5728 "${requesta.url}"`);
	}
  })
})