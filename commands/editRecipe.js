const vscode = require('vscode');
const fs = require("fs");
const path = require("path");
const util = require("../utilities");
const jsonEditor = require("../webviews/recipeJsonEditor");

module.exports = async function () {
  await util.verifyWorkspaceNamespace();

  let recipes = fs.readdirSync(path.join(util.getNamespacePath(), "recipes"));

  let recipe = await vscode.window.showQuickPick(recipes, {
    canPickMany: false,
    title: `Select a recipe from ${util.WORKSPACE.name}'s ${util.NAMESPACE}`
  });

  jsonEditor(path.join(util.getNamespacePath(), "recipes", recipe));
}