'use strict'

const tf = require('@tensorflow/tfjs');
const getColors = require('get-image-colors');
const path = require('path');
const Helpers = use('Helpers')
const WriteBrainService = use('App/Services/WriteBrainService');
const TensorFlowService = use('App/Services/TensorFlowService');
const RGBChanelsService = use('App/Services/RGBChanelsService');

const brainType = 'rgbrain.txt';

let ashileyResponse;

class AshileyRGBpredict {

    async train(className, limit) {

        let classification = {};

        for (let k = 0; k < className.length; k++) {

            const dir = Helpers.publicPath(`train/${className[k]}`);

            for (let i = 1; i <= limit; i++) {
                let index = i.toString();
                i <= 9 ? index = '0'.concat(index) : null;
                await getColors(path.join(dir, `${className[k]}${index}.jpg`)).then(async (colors) => {
                    let rgbChanelsService = new RGBChanelsService()
                    let arrayColors = await rgbChanelsService.returnRGBChanels(colors);
                    const objectClass = { class: className[k], pixels: arrayColors }
                    classification[k + Date.now()] = objectClass;
                });
            }
        }

        if (classification) {
            let writeBrainService = new WriteBrainService();
            await writeBrainService.writeBrain(classification, brainType);
        }

        return classification;
    }

    async predictRGBChanels(fileName) {

        await getColors(path.join(Helpers.publicPath(`files/`), `${fileName}.jpg`)).then(async (colors) => {

            let rgbChanelsService = new RGBChanelsService()
            let arrayColors = await rgbChanelsService.returnRGBChanels(colors);

            const tfPidexels = tf.tensor(arrayColors)

            let tensorFlowService = new TensorFlowService();
            ashileyResponse = tensorFlowService.compare(tfPidexels, brainType);

        });

        return ashileyResponse;
    }

}

module.exports = AshileyRGBpredict;