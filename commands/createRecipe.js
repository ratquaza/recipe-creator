const vscode = require('vscode');
const fs = require("fs");
const path = require("path");
const util = require("../utilities");

const TEMPORARY_ITEM = "minecraft:knowledge_book";

module.exports = async function () {
  await util.verifyWorkspaceNamespace();

  let recipeName = await vscode.window.showInputBox({
    title: "Input the name of the recipe files, do not use any spaces or special characters."
  });
  if (!recipeName) {
    return;
  }
  if (!/^[a-zA-Z0-9-+._]+$/.test(recipeName)) {
    vscode.window.showErrorMessage("Invalid file name!");
    return;
  }

  let resource = `${util.NAMESPACE}:${recipeName}`;
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

  fs.writeFileSync(path.join(util.getNamespacePath(), "advancements", `${recipeName}.json`), JSON.stringify(advancement, null, 4));
  fs.writeFileSync(path.join(util.getNamespacePath(), "recipes", `${recipeName}.json`), JSON.stringify(recipe, null, 4));
  fs.writeFileSync(path.join(util.getNamespacePath(), "functions", `${recipeName}.mcfunction`), command);

  vscode.window.showInformationMessage(`Recipe ${resource} has been made. Update "recipe/${recipeName}.json" and "function/${recipeName}.json" accordingly.`);
}