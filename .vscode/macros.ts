const vscode = require("vscode");

module.exports.macroCommands = {
  OpenI18n: {
    no: 1,
    func: async () => {
      const workingDirectory = vscode.workspace.workspaceFolders[0].uri;
      console.error(workingDirectory);

      openI18nFile(
        `/${workingDirectory}/chase/frontend/i18n/en/index.ts`.replace(
          "/file:",
          "",
        ),
      );
      setTimeout(async () => {
        await vscode.commands.executeCommand(
          "workbench.action.moveEditorToNextGroup",
        );
      }, 500);
      setTimeout(() => {
        // print current working directory
        openI18nFile(
          `/${workingDirectory}/chase/frontend/i18n/de/index.ts`.replace(
            "/file:",
            "",
          ),
        );
      }, 500);
    },
  },
};

async function openI18nFile(filename) {
  const document = await vscode.workspace.openTextDocument(filename);
  await vscode.window.showTextDocument(document);
  await vscode.commands.executeCommand("workbench.action.files.save");
}
