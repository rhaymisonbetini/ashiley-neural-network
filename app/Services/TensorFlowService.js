'use strict';
const tf = require('@tensorflow/tfjs');
const WriteBrainService = use('App/Services/WriteBrainService');

class TensorFlowService {

    async compare(tfPidexels, brainType) {

        let writeBrainService = new WriteBrainService();
        let classification = await writeBrainService.readBrain(brainType);

        let difference = [];
        let nameClass = [];

        for (var [key, classify] of Object.entries(classification)) {
            const className = classify.class.trim();
            const tfPixels2 = tf.tensor(classify.pixels);
            const diference = tfPidexels.sub(tfPixels2).abs().sum().arraySync();

            nameClass.push(className);
            difference.push(diference);
        }

        let predict = await this.calculateProbabilit(difference, nameClass);
        return predict;

    }

    async calculateProbabilit(difference, nameClass) {

        const less = tf.tensor(difference).min().arraySync();
        const plus = tf.tensor(difference).max().arraySync();

        const percentPositive = parseFloat(100 - ((less / (less + plus)) * 100)).toFixed(8);
        const percentNegative = parseFloat(100 - percentPositive).toFixed(8);

        let index = 0;

        for (let i = 0; i < difference.length; i++) {
            if (difference[i] == less) index = i;
        }

        const finalClassify = nameClass[index].toString().trim()

        let ashileyResponse = {};

        ashileyResponse.classification = finalClassify;
        ashileyResponse.percentPositive = percentPositive;
        ashileyResponse.percentNegative = percentNegative;

        return ashileyResponse;

    }

}

module.exports = TensorFlowService;