'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
    //train routes image color
    Route.get('/trainRGB', 'BrainController.ashileyTrainRGBChanels');
    Route.post('/predictRGB', 'BrainController.predictRGBChanels');

    //train neural network
    Route.get('/trainNeuralNetWork', 'BrainController.trainNeuralNetWork');
    Route.post('/predictNeuralNetWork', 'BrainController.predictNeuralNetWork');


    //train routes image contour
    // warning - JavaScript heap out of memory
    Route.get('/trainContour', 'BrainController.contourTrain');
    Route.post('/predictContour', 'BrainController.countourPredict');

    //train text tensor flow
    Route.get('/trainText', 'BrainController.trainText');
    Route.post('/predictText', 'BrainController.predictText');

    //train text Bayes
    Route.get('/trainNavy', 'BrainController.trainNavy');
    Route.post('/predictNavy', 'BrainController.predictNavy');
    
}).middleware(['authAshiley'])
