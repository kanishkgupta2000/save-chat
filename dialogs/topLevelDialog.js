// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ComponentDialog, ChoicePrompt, WaterfallDialog } = require('botbuilder-dialogs');

// const { MakeDiaryDialog, MAKE_DIARY_DIALOG } = require('./MakeDiaryDialog');
// const { ReviewDiariesDialog, REVIEW_DIARIES_DIALOG } = require('./reviewDiariesDialog');
// const { ReviewChatDumpDialog, REVIEW_CHAT_DUMP_DIALOG } = require('./reviewChatDumpDialog');
// const { ReviewAttachmentsDialog, REVIEW_ATTACHMENTS_DIALOG } = require('./reviewAttachmentsDialog');


const TOP_LEVEL_DIALOG = 'TOP_LEVEL_DIALOG';
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
// const MAKE_DIARY_DIALOG='MAKE_DIARY_DIALOG'
// const REVIEW_DIARIES_DIALOG='REVIEW_DIARIES_DIALOG'
// const REVIEW_CHAT_DUMP_DIALOG='REVIEW_CHAT_DUMP_DIALOG'
// const REVIEW_ATTACHMENTS_DIALOG='REVIEW_ATTACHMENTS_DIALOG'

class TopLevelDialog extends ComponentDialog {
    constructor() {
        super(TOP_LEVEL_DIALOG);
        // this.addDialog(new MakeDiaryDialog());
        // this.addDialog(new ReviewDiariesDialog());
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
            // case 'Make a new diary':
            // return await stepContext.beginDialog(MAKE_DIARY_DIALOG)
            // case 'Review Diaries':
            // return await stepContext.beginDialog(REVIEW_DIARIES_DIALOG)
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

   

    // async nameStep(stepContext) {
    //     // Create an object in which to collect the user's information within the dialog.
    //     stepContext.values.userInfo = new UserProfile();

    //     const promptOptions = { prompt: 'Please enter your name.' };

    //     // Ask the user to enter their name.
    //     return await stepContext.prompt(TEXT_PROMPT, promptOptions);
    // }

    // async ageStep(stepContext) {
    //     // Set the user's name to what they entered in response to the name prompt.
    //     stepContext.values.userInfo.name = stepContext.result;

    //     const promptOptions = { prompt: 'Please enter your age.' };

    //     // Ask the user to enter their age.
    //     return await stepContext.prompt(NUMBER_PROMPT, promptOptions);
    // }

    // async startSelectionStep(stepContext) {
    //     // Set the user's age to what they entered in response to the age prompt.
    //     stepContext.values.userInfo.age = stepContext.result;

    //     if (stepContext.result < 25) {
    //         // If they are too young, skip the review selection dialog, and pass an empty list to the next step.
    //         await stepContext.context.sendActivity('You must be 25 or older to participate.');

    //         return await stepContext.next();
    //     } else {
    //         // Otherwise, start the review selection dialog.
    //         return await stepContext.beginDialog(REVIEW_SELECTION_DIALOG);
    //     }
    // }

    // async acknowledgementStep(stepContext) {
    //     // Set the user's company selection to what they entered in the review-selection dialog.
    //     const userProfile = stepContext.values.userInfo;
    //     userProfile.companiesToReview = stepContext.result || [];

    //     await stepContext.context.sendActivity(`Thanks for participating ${ userProfile.name }`);

    //     // Exit the dialog, returning the collected user information.
    //     return await stepContext.endDialog(userProfile);
    // }
}

module.exports.TopLevelDialog = TopLevelDialog;
module.exports.TOP_LEVEL_DIALOG = TOP_LEVEL_DIALOG;
