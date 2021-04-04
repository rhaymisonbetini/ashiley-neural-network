'use strict'

const RNATensorFlowService = use('App/Services/RNATensorFlowService');
const RGBChanelsService = use('App/Services/RGBChanelsService');
const WriteBrainService = use('App/Services/WriteBrainService');

const Helpers = use('Helpers')

const path = require('path');
const getColors = require('get-image-colors');

const config = {
    epochs: 20000,
    activation: 'sigmoid',
    bias: 0,
    hiddenLayers: 1,
    model: 'img-class',
    dense: false,
    nOutputs: 1,
    formatIO: false
};

let ashileyResponse = {};

class AshileyRNAPredict {

    async ashileyBuildNeuralNetWork(className, limit) {

        let rnaTensorFlowService = new RNATensorFlowService(config);

        let x = [];
        let y = [];

        for (let k = 0; k < className.length; k++) {

            const dir = Helpers.publicPath(`train/${className[k]}`);

            for (let i = 1; i <= limit; i++) {
                let index = i.toString();
                console.log(index);
                i <= 9 ? index = '0'.concat(index) : index = i;

                await getColors(path.join(dir, `${className[k]}${index}.jpg`)).then(async (colors) => {
                    let rgbChanelsService = new RGBChanelsService()
                    let arrayColors = [];
                    arrayColors = await rgbChanelsService.returnRGBChanels(colors);

                    x.push(arrayColors);
                    y.push([className.indexOf(className[k])]);
                });
            }
        }

        await rnaTensorFlowService.fit(x, y)

        let existFile = Helpers.publicPath(`brainfiles/${config.model}.bin`)
        let writeBrainService = new WriteBrainService();
        if (await writeBrainService.existFile(existFile)) {
            return 'learned';
        } else {
            return false;
        }
    }


    async predictRGBChanels(fileName) {

        await getColors(path.join(Helpers.publicPath(`files/`), `${fileName}.jpg`)).then(async (colors) => {

            let rgbChanelsService = new RGBChanelsService()
            let arrayColors = await rgbChanelsService.returnRGBChanels(colors);

            let rnaTensorFlowService = new RNATensorFlowService(config);

            let predict = await rnaTensorFlowService.predict(arrayColors);

            predict = predict[0];

            ashileyResponse.classification = className[Number(parseFloat(predict).toFixed(0))].toString().trim();

            // predict > 0 ? ashileyResponse.percentPositivo = (1 - predict) * 100 : ashileyResponse.percentPositivo = (100 - predict) * 100;
            // ashileyResponse.percentNegative = 100 - ashileyResponse.percentPositivo;

            // ashileyResponse.percentNegative = parseFloat(ashileyResponse.percentNegative).toFixed(4);
            // ashileyResponse.percentPositivo = parseFloat(ashileyResponse.percentPositivo).toFixed(4);

        });

        return ashileyResponse;
    }


}

module.exports = AshileyRNAPredict;