'use strict'

const tf = require('@tensorflow/tfjs');
const getColors = require('get-image-colors');
const path = require('path');
const Helpers = use('Helpers')
const WriteBrainService = use('App/Services/WriteBrainService');
const TensorFlowService = use('App/Services/TensorFlowService');


const className = ['document', 'normal', 'porn', 'sexy', 'ugly-gesture'];
const limit = 8
const brainType = 'rgbrain.txt';

let ashileyResponse;

class AshileyRGBpredict {

    async train() {

        let classification = {};

        for (let k = 0; k < className.length; k++) {

            const dir = Helpers.publicPath(`train/${className[k]}`);

            for (let i = 1; i <= limit; i++) {
                let index = i.toString();
                index.length <= 1 ? index = '0'.concat(index) : null;
                await getColors(path.join(dir, `${className[k]}${index}.jpg`)).then(async (colors) => {
                    let arrayColors = await this.returnRGBChanels(colors);
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

            let arrayColors = await this.returnRGBChanels(colors)
            const tfPidexels = tf.tensor(arrayColors)

            let tensorFlowService = new TensorFlowService();
            ashileyResponse = tensorFlowService.compare(tfPidexels, brainType);

        });

        return ashileyResponse;
    }


    async returnRGBChanels(colors) {

        let arrayColors = [];

        for (let color = 0; color < colors.length; color++) {
            //this return is a 3 chanels rgb colors
            const rgb = colors[color].css()
                .toString()
                .replace('rgb', '')
                .replace('(', '')
                .replace(')', '')

            const arrayRgb = rgb.split(',');

            arrayColors.push(Number(arrayRgb[0]));
            arrayColors.push(Number(arrayRgb[1]));
            arrayColors.push(Number(arrayRgb[2]));
        }

        return arrayColors;
    }

}

module.exports = AshileyRGBpredict;