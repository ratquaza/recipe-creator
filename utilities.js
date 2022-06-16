const fs = require("fs");
const path = require("path");
const vscode = require("vscode");

module.exports = {
  WORKSPACE: null,
  NAMESPACE: null,

  getDataPath: function() {
    return this.WORKSPACE ? path.join(this.WORKSPACE.uri.fsPath, "data") : null;
  },
  getNamespacePath: function() {
    return this.WORKSPACE && this.NAMESPACE ? path.join(this.getDataPath(), this.NAMESPACE) : null;
  },
  ensureDir: function(path) {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
  },
  requestWorkspace: async function() {
    let folders = vscode.workspace.workspaceFolders;

    if (folders.length == 0) {
      vscode.window.showErrorMessage("No workspaces opened!");
      return;
    }
  
    this.WORKSPACE = folders[0];
    if (folders.length > 1) {
      let result = await vscode.window.showQuickPick(
        folders.map(f => f.name),
        {
          canPickMany: false,
          title: "Which workspace?"
        }
      );
      this.WORKSPACE = folders.find(w => w.name == result);
    }
    vscode.window.showInformationMessage(`${this.WORKSPACE.name} selected as Workspace.`);
  },
  requestNamespace: async function() {
    if (!this.WORKSPACE) await this.requestWorkspace();
    
    let dataPath = path.join(this.WORKSPACE.uri.fsPath, "data");
    let spaces = fs.readdirSync(dataPath, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
		if (spaces.length == 0) {
			vscode.window.showErrorMessage("Workspace contains no namespaces!");
			return;
		}

		this.NAMESPACE = spaces[0];
		if (spaces.length > 1) {
			let result = await vscode.window.showQuickPick(
				spaces,
				{
					canPickMany: false,
					title: "Which namespace?"
				}
			);

			this.NAMESPACE = result;
      this.ensureDir(this.getDataPath());
      this.ensureDir(path.join(this.getNamespacePath(), "advancements"));
      this.ensureDir(path.join(this.getNamespacePath(), "functions"));
      this.ensureDir(path.join(this.getNamespacePath(), "recipes"));
		}
    vscode.window.showInformationMessage(`${this.NAMESPACE} selected as Namespace.`);
  },
  verifyWorkspaceNamespace: async function() {
    if (!this.WORKSPACE) await this.requestWorkspace();
    if (!this.NAMESPACE) await this.requestNamespace();
  }
}