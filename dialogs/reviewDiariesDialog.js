// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const { AttachmentLayoutTypes, CardFactory } = require('botbuilder');
const { ComponentDialog,ChoicePrompt,WaterfallDialog } = require('botbuilder-dialogs');

const{LOOP_INPUT_DIALOG,LoopInputDialog} = require('./loopInputDialog')
const{ retrieveDiaryNames,reviewDiary }=require('../firebase.js')
const REVIEW_DIARIES_DIALOG='REVIEW_DIARIES_DIALOG'
const WATERFALL_DIALOG ='WATERFALL_DIALOG';
const CHOICE_PROMPT = 'CHOICE_PROMPT';

const userName='user101'


class ReviewDiariesDialog extends ComponentDialog {
    constructor() {
        super(REVIEW_DIARIES_DIALOG);
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new LoopInputDialog())
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.choiceStep.bind(this),
            this.selectionStep.bind(this),
            this.finalStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    
    async choiceStep (stepContext){
        console.log('reviewDiariesDialog.choiceStep');
        const list=await retrieveDiaryNames(userName);
        const options = {
            prompt: 'Choose the diary you wish to review and write',
            retryPrompt: 'Try Again.',
            choices: this.getChoices(list)
        };

        // Prompt the user with the configured PromptOptions.
        return await stepContext.prompt(CHOICE_PROMPT, options);
    }
    async selectionStep(stepContext)
    {
        console.log('reviewDiariesDialog.selectionStep');       
        console.log(stepContext.result.value)
        const diaryName=stepContext.result.value
        const options={
            list:[],
            diaryName
        }
        //TO DO : send last 10 texts of the selected diary
        const attachmentList=await this.getAttachmentList(userName,diaryName)
        await stepContext.context.sendActivity('Here are the last 10 messages:');
        await stepContext.context.sendActivity({attachments:attachmentList,attachmentLayout: AttachmentLayoutTypes.Carousel});

        return await stepContext.beginDialog(LOOP_INPUT_DIALOG,options)

    }
    
    async finalStep (stepContext){
        console.log('reviewDiariesDialog.finalStep');        
        console.log(stepContext.result)
        return await stepContext.endDialog();
    }
    async getAttachmentList(userName,diaryName){
        const messages=await reviewDiary(userName,diaryName)
        // i now have array of objects containing 'time' and 'data'
        console.log(messages)
        const attachments=[]
        messages.forEach((item)=>{
            attachments.push(this.createHeroCard(item.data))

        })
        return attachments
    }

    getChoices(list) {
        const cardOptions = [];
        list.map((item)=>{
            cardOptions.push({
                value:item
            })
        })

        return cardOptions;
    }
    createHeroCard(data) {
        return CardFactory.heroCard(data);
    }

}

module.exports.ReviewDiariesDialog = ReviewDiariesDialog;
module.exports.REVIEW_DIARIES_DIALOG = REVIEW_DIARIES_DIALOG;
