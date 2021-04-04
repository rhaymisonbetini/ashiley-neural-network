'use strict';

const TensorTextService = use("App/Services/TensorTextService");
const TextHelper = use("App/Helpers/Helpers");

class AshileyTextIdentification {

    async train() {

        let entry = [];
        let classes = [];
        let classesIndex = 0;
        let objClasses = [];


        let textHelper = new TextHelper();
        let texts = await textHelper.returnAnyTipesText();

        texts.forEach(async (text) => {
            objClasses.push({ classe: text.type, indice: classesIndex });
            

            text.phrases.forEach(async (phase) => {
                let phare = phase.text.trim();
                let tokens = phare.split(' ');

                entry.push(await this.arrayStringToNumber(tokens));
                classes.push([classesIndex]);
            })

            classesIndex++;
        });

        let tensorTextService = new TensorTextService();
        await tensorTextService.fit(entry, classes);
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