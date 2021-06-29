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
    model: 'aluminium',
    dense: false,
    nOutputs: 1,
    formatIO: false
};


class AshileyRNAPredict {

    async ashileyBuildNeuralNetWork(className, limit) {

        let rnaTensorFlowService = new RNATensorFlowService(config);

        let x = [];
        let y = [];

        for (let k = 0; k < className.length; k++) {
            const dir = Helpers.publicPath(`aluminum/${className[k]}`);
            for (let i = 1; i <= limit; i++) {
                let index = i.toString();
                await getColors(path.join(dir, `(${index}).jpeg`)).then(async (colors) => {
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


    async predictRGBChanels(fileName, className) {
        let ashileyResponse = [];
        let possibilities = [];
        let inMemoryan = [];
        await getColors(path.join(Helpers.publicPath(`files/`), `${fileName}.jpg`)).then(async (colors) => {

            let rgbChanelsService = new RGBChanelsService()
            let arrayColors = await rgbChanelsService.returnRGBChanels(colors);

            let rnaTensorFlowService = new RNATensorFlowService(config);
            let predict = await rnaTensorFlowService.predict(arrayColors);
            await predict.forEach((pred) => {
                pred.index = className[Number(parseFloat(pred.index[0]).toFixed(0))].toString().trim();
                let verification = inMemoryan.find(el => el == pred.index);
                if (!verification) {
                    possibilities.push(pred);
                    inMemoryan.push(pred.index)
                }
            })
            ashileyResponse = predict;
        });

        return ashileyResponse;
    }
}

module.exports = AshileyRNAPredict;