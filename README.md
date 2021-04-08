
# ASHILEY NEURAL-NETWORK
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![version](https://img.shields.io/badge/version-1.0.0-blue)

![alt text](https://i1.wp.com/sitn.hms.harvard.edu/wp-content/uploads/2017/08/Half-machine-half-human-brain-2.jpg?resize=960%2C600&ssl=1)


Ashiley is an open project aiming to perform the classification of images and texts with ML 100% in Javascript.
Every system runs under Node.js and the Adonis.js framework along with Google's TensorFlow.js.

The entire system was designed not to rely on a database.
All templates and files are stored in binaries or .txt

# 1 Installation
```
git clone 
```
```
git clone 
```
```
cd ashiley-neural-network
```
```
npm install
```
```
adonis serves --dev
```
# 2.1 how to train - photos

All training documents are located inside the public folder.

For photo training you must create the directories inside public / train so that the photos start exactly as the folder name + the number (if it is less than 10 it must contain the zero to the left)
After inserting the correctly named photos you must go to the Controller BrainController and in the constant className insert the name of the new training class into the array
In this version only JPG formats are allowed.
 
 * photo training routes <br/>
   GET: trainRGB -> Training based on RGB color scale.
   It is advisable to use it for comparison and color <br/>
   classification, such as a can of coca-cola

   GET: trainContour -> Training based on color scale and
   photo outlines. In this training, resizing takes place
   of pictures
   
   GET: trainNeuralNetWork -> ML-based training with
   Google's TensorFlow. Level of accuracy very high.


# 2.2 how to train - text
For training and classification of texts Ashiley has two forms of treatment. ML and Naive Bayes Classification.
With this training our AI will be able to classify text with racist, extremist or improper content.

Within the Helpers / Helpers.js file there is a method that returns an object array that expects a type and set of phrases related to this model.

* text training routes <br/>

  GET: trainText -> ML-based training with gooogle's tensorFlow.js.

  GET: trainNavy -> Training based on the NavyBaiers Algorithm

# 3 How use

* image classification routes <br/>
   METHOD: POST
   Ashiley hopes to receive a formData with an image file from
   nom "image" that must have a maximum of 2mb and be in JPG format.


* text classification routes <br/>
  METHOD: POST
  At this point Ashiley hopes to receive a text in an http request. The name of 
  the text field must be "text" and does not have a pre-set size or character limit.
