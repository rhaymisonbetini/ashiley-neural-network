'use strict';

const tf = require('@tensorflow/tfjs');
const Helpers = use('Helpers')
const Jimp = require('jimp');
const WriteBrainService = use('App/Services/WriteBrainService');
const TensorFlowService = use('App/Services/TensorFlowService');


const size = 900;
const brainType = 'contourBrain.bin';

let ashileyClassification = {};
let ashileyResponse;

class AshileyContourPredict {

    async trainContour(className, limit = 8) {

        for (let k = 0; k < className.length; k++) {

            const dir = Helpers.publicPath(`train/${className[k]}`);

            for (let i = 1; i <= limit; i++) {
                let index = i.toString();
                i <= 9 ? index = '0'.concat(index) : null;
                let dirFile = `${dir}/${className[k]}${index}.jpg`;
                let classFullName = className[k] + index;
                await this.resizeJimp(dirFile, classFullName, className[k]);
            }
        }

        let writeBrainService = new WriteBrainService();
        await writeBrainService.writeBrain(ashileyClassification, brainType);

        return writeBrainService;

    }

    async resizeJimp(dirFile, className, typeName) {
        await Jimp.read(dirFile).then(async (image) => {

            let fileTemp = Helpers.publicPath(`temp/${className}.jpg`);

            await image.resize(size, size).quality(100).writeAsync(fileTemp);
            await this.createArrayColorsByJimp(fileTemp, typeName);

        }).catch(function (error) {
            console.log(error);
        })

        return;
    }


    async createArrayColorsByJimp(fileTemp, typeName) {

        await Jimp.read(fileTemp).then(async (image) => {

            let arrayColors = await this.convertArrayColor(image);

            ashileyClassification[Date.now()] = { class: typeName, pixels: arrayColors }

        }).catch(function (error) {
            console.log(error);
        })

        return;
    }


    async predictContour(fileName) {


        let dirFile = Helpers.publicPath(`files/${fileName}.jpg`);

        await Jimp.read(dirFile).then(async (image) => {

            let fileTemp = Helpers.publicPath(`temp/${fileName}.jpg`);

            await image.resize(size, size).quality(100).writeAsync(fileTemp)

            let writeBrainService = new WriteBrainService();

            if (await writeBrainService.existFile(fileTemp)) {
                ashileyResponse = await this.initComparation(fileTemp)
                await writeBrainService.removeFile(fileTemp);
            }

        }).catch(function (error) {
            console.log(error);
        })

        return ashileyResponse;

    }

    async initComparation(fileTemp) {

        let predict;

        await Jimp.read(fileTemp).then(async (image) => {

            let arrayColors = await this.convertArrayColor(image);
            const tfPidexels = tf.tensor(arrayColors);
            let tensorFlowService = new TensorFlowService();
            predict = await tensorFlowService.compare(tfPidexels, brainType);
        }).catch(function (error) {
            console.log(error);
        })

        return predict;
    }

    async convertArrayColor(image) {

        let arrayColors = [];
        for (let x = 0; x < size; x++) {

            for (let y = 0; y < size; y++) {

                let hexadecimal = image.getPixelColor(x, y);
                let rgb = Jimp.intToRGBA(hexadecimal);
                arrayColors.push(Number(rgb.r));
                arrayColors.push(Number(rgb.g));
                arrayColors.push(Number(rgb.b));
            }
        }
        return arrayColors;
    }

}

module.exports = AshileyContourPredict;