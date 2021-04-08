'use strict'
const WriteBrainService = use('App/Services/WriteBrainService');
const BayesService = use('App/Services/BayesService');
const TextHelper = use("App/Helpers/Helpers");
const brainType = 'bayesClasses.bin'
const brainType2 = 'bayesEntry.bin'

class AshileyTextBayesIdentification {

    async train() {
        let entry = [];
        let classes = [];

        let textHelper = new TextHelper();
        let texts = await textHelper.returnAnyTipesText();

        await texts.forEach(async (text) => {
            let tokens = text.phrases.trim().replace(/\r\n\r\n/g, '').split(' ');

            for (let j = 0; j < tokens.length; j++) {
                entry.push(tokens[j].toString().trim());
                classes.push(text.type);
            }
        });

        let writeBrainService = new WriteBrainService();
        await writeBrainService.writeBrain(classes, brainType)
        await writeBrainService.writeBrain(entry, brainType2)

        return 'treined'

    }


    async executeBayes(phrase) {
        let writeBrainService = new WriteBrainService();
        let modelClass = await writeBrainService.readBrainBin(brainType)
        let modelEntry = await writeBrainService.readBrainBin(brainType2)
        let tokenization = phrase.trim().split(' ');

        let bayesService = new BayesService(modelClass, modelEntry);
        return await bayesService.execBayers(tokenization)

    }

}

module.exports = AshileyTextBayesIdentification;