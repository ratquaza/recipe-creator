const vscode = require('vscode');
const fs = require("fs");
const path = require("path");

function activate(context) {
	let root = context.extensionUri;
	fs.readdirSync(path.join(root.fsPath, "commands")).forEach((f) => {
		let p = path.join(root.fsPath, "commands", f);
		let loc = path.parse(p);
		let command = vscode.commands.registerCommand(`recipe-creator.${loc.name}`, require(p));
		context.subscriptions.push(command)
	})
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}