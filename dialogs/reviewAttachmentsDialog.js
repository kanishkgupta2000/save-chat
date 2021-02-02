// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const {AttachmentLayoutTypes, CardFactory}=require('botbuilder');
const {ComponentDialog,AttachmentPrompt,WaterfallDialog}=require('botbuilder-dialogs');
const {uploadAttachment}=require("../firebase")
const REVIEW_ATTACHMENTS_DIALOG='REVIEW_ATTACHMENTS_DIALOG'
const WATERFALL_DIALOG ='WATERFALL_DIALOG';
const ATTACHMENT_PROMPT = 'ATTACHMENT_PROMPT';

const userName='user101'

class ReviewAttachmentsDialog extends ComponentDialog{
    constructor(){
        super(REVIEW_ATTACHMENTS_DIALOG)
        this.addDialog(new AttachmentPrompt(ATTACHMENT_PROMPT))
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.initialStep.bind(this),
            this.finalStep.bind(this)
        ]))
        this.initialDialogId = WATERFALL_DIALOG;

    }


    async initialStep(stepContext){
        console.log("reviewAttachmentsDialog.initialStep")
        const options={
            prompt:"upload attachments",
            retryPrompt:"try again"
        }
        return await stepContext.prompt(ATTACHMENT_PROMPT,options)
    }
    async finalStep(stepContext)
    {
        console.log("reviewAttachmentsDialog.finalStep")
        console.log(stepContext.result)
        uploadAttachment(userName,stepContext.result)
        return await stepContext.endDialog()

    }
}
module.exports.REVIEW_ATTACHMENTS_DIALOG=REVIEW_ATTACHMENTS_DIALOG
module.exports.ReviewAttachmentsDialog=ReviewAttachmentsDialog