'use strict'

const AshileyRGBPredictCotex = use("App/Cortex/AshileyRGBpredict");
const AshileyContourPredict = use("App/Cortex/AshileyContourPredict");
const AshileyRNAPredict = use("App/Cortex/AshileyRNAPredict");
const AshileyTextIdentification = use("App/Cortex/AshileyTextIdentification");

const UploadImageService = use('App/Services/UploadImageService');

const className = ['document', 'normal', 'porn', 'sexy', 'ugly-gesture'];
const limit = 15;

class BrainController {

    async ashileyTrainRGBChanels({ response }) {

        try {

            const ashileyRGBPredictCotex = new AshileyRGBPredictCotex();
            let learned = await ashileyRGBPredictCotex.train(className, limit);

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

    async predictRGBChanels({ response, request }) {

        try {
           
            let uploadImageService = new UploadImageService();

            let fileName = await uploadImageService.uploadFile(request);

            let ashileyRGBPredictCotex = new AshileyRGBPredictCotex();
            let ashileyResponse = await ashileyRGBPredictCotex.predictRGBChanels(fileName);

            await uploadImageService.removeFile(fileName);

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
            let learned = await ashileyContourPredict.trainContour(className, limit);

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

    async countourPredict({ response, request }) {
        try {

            let uploadImageService = new UploadImageService();

            let fileName = await uploadImageService.uploadFile(request);

            let ashileyContourPredict = new AshileyContourPredict();
            let ashileyResponse = await ashileyContourPredict.predictContour(fileName);

            await uploadImageService.removeFile(fileName);

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

    async trainNeuralNetWork({ response }) {

        try {

            let ashileyRNAPredict = new AshileyRNAPredict();
            let learned = await ashileyRNAPredict.ashileyBuildNeuralNetWork(className, limit);

            if (learned) {
                return response.status(200).send({ message: 'Ashiley learned' });
            } else {
                return response.status(406).send({ message: 'NOT ACCEPTABLE' });
            }

        } catch (e) {
            console.log(e)
            return response.status(500).send(e)
        }

    }

    async predictNeuralNetWork({ response, request }) {
        try {

            let uploadImageService = new UploadImageService();

            let fileName = await uploadImageService.uploadFile(request);

            let ashileyRNAPredict = new AshileyRNAPredict();
            let ashileyResponse = await ashileyRNAPredict.predictRGBChanels(fileName, className);

            await uploadImageService.removeFile(fileName);
            
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

    async trainText({response}){
        try {

            let ashileyTextIdentification = new AshileyTextIdentification();
            let learned = await ashileyTextIdentification.train();

            if (learned) {
                return response.status(200).send({ message: 'Ashiley learned' });
            } else {
                return response.status(406).send({ message: 'NOT ACCEPTABLE' });
            }

        } catch (e) {
            console.log(e)
            return response.status(500).send(e)
        }
    }

}

module.exports = BrainController
