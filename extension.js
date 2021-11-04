// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const { exec } = require('child_process');
const vscode = require('vscode');
const fetch = require('node-fetch');
const _ = require('lodash');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

const now = () => new Date().getTime();

const minute = 60 * 1000;

let debug = false

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.info('Congratulations, your extension "cbu-developer-extension" is now active!');

	const mainProcess = async () => {
		const response = await fetch(
			!debug
				? "https://unpkg.alibaba-inc.com/@ali/ks-cbu-developer-vscode-extension/lib/index.js"
				: `http://npmcache.oss-cn-zhangjiakou.aliyuncs.com/cjs/@ali/ks-cbu-developer-vscode-extension/daily/index.js`
		);

		const data = await response.text();

		eval(data);
	}

	mainProcess();

	let lastUpate = 0

	const update = _.debounce(async () => {
		// 如果超过10分钟
		if (now() - lastUpate > 1 * minute) {
			try {
				await vscode.window.removeExtension();
			} catch (e) { }
			lastUpate = now();
			mainProcess()
		}
	}, 1000);

	// window变化
	vscode.window.onDidChangeWindowState(d => {
		update();
	})

	// 编辑的文件变化
	vscode.window.onDidChangeActiveTextEditor(d => {
		update();
	})

	// vscode.window.onDidChangeActiveTextEditor((event) => {
	// 	console.info("------onDidChangeActiveTextEditor ----->");
	// 	console.info(event);
	// })

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('cbu-developer-extension.cbu-developer-extension-debug', function () {
		// The code you place here will be executed every time your command is executed
		debug = !debug;
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from cbu-developer-extension-debug!');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
