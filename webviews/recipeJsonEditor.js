const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const util = require("../utilities")

module.exports = function(recipePath) {
  let recipeJson = JSON.parse(fs.readFileSync(recipePath));
  let recipeInfo = path.parse(recipePath);
  let panel = vscode.window.createWebviewPanel(
    "recipeJsonEditor",
    recipeInfo.name + ".json Recipe",
    vscode.ViewColumn.Two,
    {
      enableScripts: true
    }
  );

  panel.onDidDispose(() => {
    fs.writeFileSync(recipePath, JSON.stringify(recipeJson, null, 4));
  });

  panel.webview.onDidReceiveMessage((msg) => {
    switch (msg.command) {
      case "toggleShaped":
        recipeJson.type = msg.value ? "minecraft:crafting_shaped" : "minecraft:crafting_shapeless"
    }
  })

  let gridSize = 3;

  let HTML = `<!DOCTYPE html>
  <head>
    <style>
      * { box-sizing: border-box; }

      #craftingGrid {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

        overflow: hidden;
        width: ${gridSize * 3}vw;
        height: ${gridSize * 3}vw;

        border-radius: ${gridSize/3}vw;
      }

      .flexBreak {
        flex-basis: 100%;
        height: 0;
      }

      #craftingGrid input {
        width: ${gridSize}vw;
        height: ${gridSize}vw;
        font-size: ${gridSize * 0.6}vw;
        text-align: center;

        border: ${gridSize * 0.01}vw solid black;

        background-color: burlywood;
      }

      #craftingGrid input:nth-of-type(odd) {
        background-color: bisque;
      }
    </style>
  </head>
  <body>
    <input name="isshaped" id="isshaped" type="checkbox" ` + (recipeJson.type == "minecraft:crafting_shaped" ? "checked" : "") + `>Is Shaped?</input>
    <br/>
    <div id="craftingGrid">
      <input maxlength="1" class="gridInput"/><input maxlength="1" class="gridInput"/><input maxlength="1" class="gridInput"/><div class="flexBreak"></div>
      <input maxlength="1" class="gridInput"/><input maxlength="1" class="gridInput"/><input maxlength="1" class="gridInput"/><div class="flexBreak"></div>
      <input maxlength="1" class="gridInput"/><input maxlength="1" class="gridInput"/><input maxlength="1" class="gridInput"/>
    </div>
    <script>
      const vscode = acquireVsCodeApi();

      const keys = [];
        
      document.getElementById("isshaped").onchange = function() {
        vscode.postMessage({ command: "toggleShaped", value: this.checked })
      }
    </script>
  </body>
  </html>`;

  panel.webview.html = HTML;
}