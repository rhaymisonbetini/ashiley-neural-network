'use strict';

const TensorTextService = use("App/Services/TensorTextService");
const WriteBrainService = use('App/Services/WriteBrainService');
const TextHelper = use("App/Helpers/Helpers");
const brainType = 'Textclasses.bin'

class AshileyTextIdentification {

    async train() {

        let entry = [];
        let classes = [];
        let objClasses = [];

        let textHelper = new TextHelper();
        let texts = await textHelper.returnAnyTipesText();

        await texts.forEach(async (text, index) => {
            objClasses.push({ classe: text.type, indice: index });
            let tokens = text.phrases.trim().replace(/\r\n\r\n/g, '').split(' ');
            entry.push(await this.arrayStringToNumber(tokens));
            classes.push([index]);
        });

        let tensorTextService = new TensorTextService();
        await tensorTextService.fit(entry, classes);

        let writeBrainService = new WriteBrainService();
        await writeBrainService.writeBrain(objClasses, brainType)

        return 'treined'
    }

    async mountPharse(text) {
        let pharse;
        await text.phrases.forEach(async (phase) => {
            pharse += ' ' + phase.text.trim();
        })
        return pharse;
    }


    async predictText(textAnalise) {
        let tokenization = textAnalise.trim().split(' ');
        let exection = await this.arrayStringToNumber(tokenization);
        let tensorTextService = new TensorTextService();
        let predict = await tensorTextService.textAnalizer(exection)
        let output = await this.toClass(predict);
        return output;
    }

    async toClass(arr) {

        let writeBrainService = new WriteBrainService();
        let objClasses = await writeBrainService.readBrainBin(brainType);

        let result = '';
        let output = arr[0];
        for (let i = 0; i < objClasses.length; i++) {
            console.log(output);
            if (objClasses[i].indice == output) result = objClasses[i].classe;
        }
        return result;
    }

    async arrayStringToNumber(arr) {
        let result = [];
        let qtd = 0;
        let sum = 0;
        for (let i = 0; i < arr.length; i++) {
            let element = arr[i];
            if (element.length > 0) {
                element = [...element].map(char => char.charCodeAt(0))
                    .reduce((current, previous) => previous + current);
                sum += Math.sqrt(element);
                qtd++;
            } else {
                sum += 0;
            }
        }
        let mean = parseFloat(sum / qtd).toFixed(0);
        result.push(Number(mean));
        return result;
    }

}

module.exports = AshileyTextIdentification;