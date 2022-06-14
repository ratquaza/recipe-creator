const vscode = require('vscode');
const fs = require("fs");
const path = require("path");

const TEMPORARY_ITEM = "minecraft:knowledge_book";

function ensureDir(path) {
	if (!fs.existsSync(path)) {
		fs.mkdirSync(path);
	}
}

function activate(context) {
	let disposable = vscode.commands.registerCommand('recipe-creator.createRecipe', async function () {
		// Recipe name
		let recipeName = await vscode.window.showInputBox({
			title: "Input the name of the recipe files, do not use any spaces or special characters."
		});
		// Verify name was inputted
		if (!recipeName) {
			return;
		}

		// Verify name is valid
		let reg = /^[a-zA-Z0-9-+._]+$/;
		if (!reg.test(recipeName)) {
			vscode.window.showErrorMessage("Invalid file name!");
			return;
		}

		// Select Workspace
		let folders = vscode.workspace.workspaceFolders;
		if (folders.length == 0) {
			vscode.window.showErrorMessage("No workspaces opened!");
			return;
		}

		let ws = folders[0];
		if (folders.length > 1) {
			let result = await vscode.window.showQuickPick(
				folders.map(f => f.name),
				{
					canPickMany: false,
					title: "Which workspace?"
				}
			);
			ws = folders.find(w => w.name == result);
		}
		
		// Ensure "data" folder
		let dataPath = path.join(ws.uri.fsPath, "data");
		ensureDir(dataPath);
		
		// Select namespace
		let spaces = fs.readdirSync(dataPath, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
		if (spaces.length == 0) {
			vscode.window.showErrorMessage("Workspace contains no namespaces!");
			return;
		}
		let namespace = spaces[0];
		if (spaces.length > 1) {
			let result = await vscode.window.showQuickPick(
				spaces,
				{
					canPickMany: false,
					title: "Which namespace?"
				}
			);

			namespace = result;
		}

		// Update data path and create resource variable
		dataPath = path.join(dataPath, namespace);
		let resource = `${namespace}:${recipeName}`;

		// Ensure advancements, functions and recipes folders
		ensureDir(path.join(dataPath, "advancements"));
		ensureDir(path.join(dataPath, "functions"));
		ensureDir(path.join(dataPath, "recipes"));

		let advancement = {
			criteria: {
				unlocked: {
					trigger: "minecraft:recipe_unlocked",
					conditions: {
						recipe: resource
					}
				}
			},
			rewards: {
				function: resource
			}
		}

		let recipe = {
			type: "minecraft:crafting_shaped",
			pattern: [" A ", "AAA", " A "],
			key: {
				A: {
					item: "minecraft:diamond"
				}
			},
			result: {
				item: TEMPORARY_ITEM,
				count: 1
			}
		}

		let command = `recipe take @a ${resource}
advancement revoke @s only ${resource}
clear @s ${TEMPORARY_ITEM} 1
# YOUR LOGIC HERE`;

		fs.writeFileSync(path.join(dataPath, "advancements", `${recipeName}.json`), JSON.stringify(advancement, null, 4));
		fs.writeFileSync(path.join(dataPath, "recipes", `${recipeName}.json`), JSON.stringify(recipe, null, 4));
		fs.writeFileSync(path.join(dataPath, "functions", `${recipeName}.mcfunction`), command);

		vscode.window.showInformationMessage(`Recipe ${resource} has been made. Update "recipe/${recipeName}.json" and "function/${recipeName}.json" accordingly.`);
	});

	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
