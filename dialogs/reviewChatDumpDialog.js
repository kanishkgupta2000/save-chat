// try using the review chat dump and loopInput diaogs here 
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const { AttachmentLayoutTypes, CardFactory } = require('botbuilder');
const { ComponentDialog,ChoicePrompt,WaterfallDialog } = require('botbuilder-dialogs');

const{LOOP_INPUT_DIALOG,LoopInputDialog} = require('./loopInputDialog')
const{ retrieveChatDump }=require('../firebase.js')
const REVIEW_CHAT_DUMP_DIALOG='REVIEW_CHAT_DUMP_DIALOG'
const WATERFALL_DIALOG ='WATERFALL_DIALOG';
const CHOICE_PROMPT = 'CHOICE_PROMPT';

const userName='user101'


class ReviewChatDumpDialog extends ComponentDialog {
    constructor() {
        super(REVIEW_CHAT_DUMP_DIALOG);
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new LoopInputDialog())
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.initialStep.bind(this),
            this.finalStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    
    async initialStep(stepContext)
    {
        console.log('reviewChatDumpDialog.initialStep');       
        const options={
            list:[],
            diaryName:null
        }
        //TO DO : send last 10 texts of the selected diary
        const attachmentList=await this.getAttachmentList(userName)
        await stepContext.context.sendActivity('Here are the messages:');
        await stepContext.context.sendActivity({attachments:attachmentList,attachmentLayout: AttachmentLayoutTypes.Carousel});

        return await stepContext.beginDialog(LOOP_INPUT_DIALOG,options)

    }
    
    async finalStep (stepContext){
        console.log('reviewDiariesDialog.finalStep');        
        console.log(stepContext.result)
        return await stepContext.endDialog();
    }

    async getAttachmentList(userName){
        const messages=await retrieveChatDump(userName)
        // i now have array of objects containing 'time' and 'data'
        console.log(messages)
        const attachments=[]
        messages.forEach((item)=>{
            attachments.push(this.createHeroCard(item.data))

        })
        return attachments
    }
    
    createHeroCard(data) {
        return CardFactory.heroCard(data);
    }

}

module.exports.ReviewChatDumpDialog = ReviewChatDumpDialog;
module.exports.REVIEW_CHAT_DUMP_DIALOG = REVIEW_CHAT_DUMP_DIALOG;
