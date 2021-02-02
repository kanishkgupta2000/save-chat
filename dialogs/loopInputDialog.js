// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ComponentDialog,TextPrompt ,WaterfallDialog } = require('botbuilder-dialogs');
const { addMessageToDiary }=require('../firebase')


const LOOP_INPUT_DIALOG='LOOP_INPUT_DIALOG'
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const TEXT_PROMPT = 'TEXT_PROMPT';
const userName='user101'

class LoopInputDialog extends ComponentDialog {
    constructor() {
        super(LOOP_INPUT_DIALOG);
        this.data='data-array'
        this.exitPhrase='>exit'
        this.addDialog(new TextPrompt(TEXT_PROMPT))
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.inputStep.bind(this),
            this.loopStep.bind(this),
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    
    async inputStep (stepContext){
        console.log('loopInputDialog.inputStep');

        const list = stepContext.options.list;
        stepContext.values[this.data] = list;
        const promptOptions = { prompt: '\\>exit or keep typing your data!' };
        return await stepContext.prompt(TEXT_PROMPT, promptOptions);
    }

    async loopStep(stepContext)
    {

        console.log('loopInputDialog.loopStep');
        const diaryName=stepContext.options.diaryName
        const list = stepContext.values[this.data];
        const userInput = stepContext.result;
        const done = userInput === this.exitPhrase;

        if(done)
        {
            console.log(list)
            const options={
                diaryName,
                list
            }
            // add a message telling that you have now exited, type anything to get started again 
            return await stepContext.endDialog(options);

        }
        else{
            list.push(userInput)
            addMessageToDiary(userName,diaryName,userInput)
            //TO DO : -> should be saved as soon as text sent , to prevent loss of data in case of abruption

            const options={
                diaryName,
                list
            }
            return await stepContext.replaceDialog(LOOP_INPUT_DIALOG, options);

        }

    }
}

module.exports.LoopInputDialog = LoopInputDialog;
module.exports.LOOP_INPUT_DIALOG = LOOP_INPUT_DIALOG;
