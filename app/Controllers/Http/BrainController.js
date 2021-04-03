'use strict'

const AshileyRGBPredictCotex = use("App/Cortex/AshileyRGBpredict");
const AshileyContourPredict = use("App/Cortex/AshileyContourPredict");
const AshileyRNAPredict = use("App/Cortex/AshileyRNAPredict");

class BrainController {

    async ashileyTrainRGBChanels({ response }) {

        try {

            const ashileyRGBPredictCotex = new AshileyRGBPredictCotex();
            let learned = await ashileyRGBPredictCotex.train();

            if (learned) {
                return response.status(200).send({ message: 'Ashiley learned' });
            } else {
                return response.status(406).send({ message: 'NOT ACCEPTABLE' })
            }

        } catch (e) {
            console.log(e);
            return response.status(500).send(e);
        }

    }

    async predictRGBChanels({ response, params }) {

        try {

            const fileName = params.file;
            let ashileyRGBPredictCotex = new AshileyRGBPredictCotex();
            let ashileyResponse = await ashileyRGBPredictCotex.predictRGBChanels(fileName);
            if (ashileyResponse) {
                return response.status(200).send(ashileyResponse);
            } else {
                return response.status(406).send({ message: 'NOT ACCEPTABLE' })
            }

        } catch (e) {
            console.log(e);
            return response.status(500).send(e);
        }

    }


    async contourTrain({ response }) {

        try {
            let ashileyContourPredict = new AshileyContourPredict();
            let learned = await ashileyContourPredict.trainContour();

            if (learned) {
                return response.status(200).send({ message: 'Ashiley learned' });
            } else {
                return response.status(406).send({ message: 'NOT ACCEPTABLE' })
            }

        } catch (e) {
            console.log(e);
            return response.status(500).send(e);
        }

    }

    async countourPredict({ response, params }) {
        try {

            let fileName = params.file;

            let ashileyContourPredict = new AshileyContourPredict();
            let ashileyResponse = await ashileyContourPredict.predictContour(fileName);

            if (ashileyResponse) {
                return response.status(200).send(ashileyResponse);
            } else {
                return response.status(406).send({ message: 'NOT ACCEPTABLE' })
            }

        } catch (e) {
            console.log(e);
            return response.status(500).send(e);
        }
    }

}

module.exports = BrainController
