'use strict';
const tf = require('@tensorflow/tfjs');
const Helpers = use('Helpers')

class TensorTextService {

    async fit(entrys, classes) {
        const model = tf.sequential();
        const inputLayer = tf.layers.dense({ units: 1, inputShape: [1] });
        model.add(inputLayer);
        model.compile({ loss: 'meanSquaredError', optimizer: tf.train.sgd(.001) });

        const x = tf.tensor(entrys, [entrys.length, 1]);
        const y = tf.tensor(classes, [classes.length, 1]);

        await model.fit(x, y, { epochs: 500 });
    }

}

module.exports = TensorTextService;