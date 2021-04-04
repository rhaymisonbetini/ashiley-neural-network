'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

//train routes image color
Route.get('/trainRGB', 'BrainController.ashileyTrainRGBChanels');
Route.get('/predictRGB/:file','BrainController.predictRGBChanels');

//train routes image contour
Route.get('/trainContour', 'BrainController.contourTrain');
Route.get('/predictContour/:file', 'BrainController.countourPredict');

//train neural network
Route.get('/trainNeuralNetWork', 'BrainController.trainNeuralNetWork');
Route.get('/predictNeuralNetWork/:file', 'BrainController.predictNeuralNetWork');

