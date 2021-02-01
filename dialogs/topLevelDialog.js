// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ComponentDialog, ChoicePrompt, WaterfallDialog } = require('botbuilder-dialogs');

const { MakeDiaryDialog, MAKE_DIARY_DIALOG } = require('./MakeDiaryDialog');
const { ReviewDiariesDialog, REVIEW_DIARIES_DIALOG } = require('./reviewDiariesDialog');
// const { ReviewChatDumpDialog, REVIEW_CHAT_DUMP_DIALOG } = require('./reviewChatDumpDialog');
// const { ReviewAttachmentsDialog, REVIEW_ATTACHMENTS_DIALOG } = require('./reviewAttachmentsDialog');


const TOP_LEVEL_DIALOG = 'TOP_LEVEL_DIALOG';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
// const REVIEW_CHAT_DUMP_DIALOG='REVIEW_CHAT_DUMP_DIALOG'
// const REVIEW_ATTACHMENTS_DIALOG='REVIEW_ATTACHMENTS_DIALOG'

class TopLevelDialog extends ComponentDialog {
    constructor() {
        super(TOP_LEVEL_DIALOG);
        this.addDialog(new MakeDiaryDialog());
        this.addDialog(new ReviewDiariesDialog());
        // this.addDialog(new ReviewChatDumpDialog());
        // this.addDialog(new ReviewAttachmentsDialog());
        this.addDialog(new ChoicePrompt('cardPrompt'));
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.initialStep.bind(this),
            this.choiceStep.bind(this),
            this.finalStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    
    async initialStep (stepContext){
        console.log('topLevelDialog.choiceCardStep');

        // Create the PromptOptions which contain the prompt and re-prompt messages.
        // PromptOptions also contains the list of choices available to the user.
        const options = {
            prompt: 'What would you like to do!',
            retryPrompt: 'Try Again.',
            choices: this.getChoices()
        };

        // Prompt the user with the configured PromptOptions.
        return await stepContext.prompt('cardPrompt', options);
    }
    async choiceStep(stepContext)
    {
        console.log(stepContext.result.value)
        const choice=stepContext.result.value
        switch(choice)
        {
            case 'Make a new diary':
            
            return await stepContext.beginDialog(MAKE_DIARY_DIALOG,false)
            case 'Review Diaries':
            return await stepContext.beginDialog(REVIEW_DIARIES_DIALOG)
            // case 'Review Chat Dump':
            // return await stepContext.beginDialog(REVIEW_CHAT_DUMP_DIALOG)
            // case 'Review Attachments':
            // return await stepContext.beginDialog(REVIEW_ATTACHMENTS_DIALOG)
            default:
            return await stepContext.next(null);
            
        }

       
    }
    async finalStep (stepContext){
        return await stepContext.endDialog();
    }

    getChoices() {
        const cardOptions = [
            {
                value: 'Make a new diary',
                synonyms: ['mkdir'],

            },
            {
                value: 'Review Diaries',
                synonyms: ['reviewdir']
            },
            {
                value: 'Review Chat Dump',
                synonyms: ['dump']
            },
            {
                value: 'Review Attachments',
                synonyms: ['attachment']
            },
           
        ];

        return cardOptions;
    }

}

module.exports.TopLevelDialog = TopLevelDialog;
module.exports.TOP_LEVEL_DIALOG = TOP_LEVEL_DIALOG;
