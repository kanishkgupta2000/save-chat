// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ComponentDialog,TextPrompt ,WaterfallDialog } = require('botbuilder-dialogs');

const{LOOP_INPUT_DIALOG,LoopInputDialog} = require('./loopInputDialog')
const{ isDiaryNameUnique,makeDiary}=require('../firebase.js')
const MAKE_DIARY_DIALOG='MAKE_DIARY_DIALOG'
const WATERFALL_DIALOG ='WATERFALL_DIALOG';
const TEXT_PROMPT      ='TEXT_PROMPT';
const userName='user101'

class MakeDiaryDialog extends ComponentDialog {
    constructor() {
        super(MAKE_DIARY_DIALOG);
       this.addDialog(new TextPrompt(TEXT_PROMPT))
        this.addDialog(new LoopInputDialog())
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.initialStep.bind(this),
            this.validationStep.bind(this),
            this.finalStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    
    async initialStep (stepContext){
        console.log('makeDiaryDialog.initialStep');
        //OPTIONAL: present user with currently registered diary names
        const promptOptions = { prompt: stepContext.options==true ?'This name has already been taken, try another name' : 'Name of the diary you wish to make?' };
        return await stepContext.prompt(TEXT_PROMPT, promptOptions);
    }
    async validationStep(stepContext)
    {
        console.log('makeDiaryDialog.validationStep');        
        const diaryName=stepContext.result
        console.log(diaryName);
        const isUnique=await isDiaryNameUnique(diaryName,userName)
        if(isUnique)
        {
            makeDiary(diaryName,userName) 
            
            const options={
                diaryName,
                list:[]
            }
            return await stepContext.beginDialog(LOOP_INPUT_DIALOG,options)
        }
        else{
            console.log('diary name not unique')
            return await stepContext.replaceDialog(MAKE_DIARY_DIALOG,true);
        }

    }
    
    async finalStep (stepContext){
        console.log('makeDiaryDialog.finalStep');        
        console.log(stepContext.result)
        return await stepContext.endDialog();
    }

}

module.exports.MakeDiaryDialog = MakeDiaryDialog;
module.exports.MAKE_DIARY_DIALOG = MAKE_DIARY_DIALOG;
