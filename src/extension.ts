import * as vscode from 'vscode';
import { chatWithGPT } from './chatgpt';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "chatgpt" is now active!');

  let disposable = vscode.commands.registerCommand('chatgpt.start', async () => {
    const prompt = 'How can I help you?';
    const question = await vscode.window.showInputBox({ prompt });

    if (!question) {
      vscode.window.showInformationMessage('Question cannot be empty.');
      return;
    }

    const answer = await chatWithGPT(question);

    if (!answer) {
      vscode.window.showInformationMessage('Sorry, I was not able to generate a response.');
      return;
    }

    let response: string = '';

    const copyResponseOption = 'Copy Response';
    const showResponseOption = 'Show Response';

    const selection = await vscode.window.showInformationMessage(answer, copyResponseOption, showResponseOption);

    if (selection === copyResponseOption) {
      response = answer;
    }

    if (selection === showResponseOption) {
      vscode.window.showInformationMessage(answer);
    }

    if (response) {
      await vscode.env.clipboard.writeText(response);
      vscode.window.showInformationMessage('The response has been copied to the clipboard.');
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}