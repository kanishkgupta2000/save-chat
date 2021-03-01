// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const {AttachmentLayoutTypes, CardFactory}=require('botbuilder');
const {ComponentDialog,AttachmentPrompt,WaterfallDialog}=require('botbuilder-dialogs');
const {uploadAttachment,retrieveAttachments}=require("../firebase")
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
        //need to send a message activity here 
        console.log("reviewAttachmentsDialog.initialStep")

        const attachmentList=await this.getAttachmentList(userName)
        await stepContext.context.sendActivity('Here are the last 10 messages:');
        await stepContext.context.sendActivity({attachments:attachmentList,attachmentLayout: AttachmentLayoutTypes.Carousel});
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

    async getAttachmentList(userName){
        console.log("getAttachmentList")
        const attachmentData=await retrieveAttachments(userName)
        //NOT STOPPING HERE 
        console.log("check after retrieval")
        console.log(attachmentData)
        // i now have array of objects containing 'time' and 'data'
        const attachments=[]
        attachmentData.forEach((item)=>{
            attachments.push(this.createHeroCard(item))

        })

        // attachments.push(this.createHeroCard("ss"))
        // attachments.push(this.createHeroCard("ss"))
        return attachments
    }

    // createHeroCard(url) {
    //     return CardFactory.heroCard('Image',CardFactory.images([url]));
    // }

    createHeroCard({url,fileName,fileType}) {
        return CardFactory.heroCard(
            fileName,
            CardFactory.images([url]),
            CardFactory.actions([
                {
                    type: 'openUrl',
                    title: 'Click to download',
                    value: url
                }
            ])
        );
    }
}



module.exports.REVIEW_ATTACHMENTS_DIALOG=REVIEW_ATTACHMENTS_DIALOG
module.exports.ReviewAttachmentsDialog=ReviewAttachmentsDialog