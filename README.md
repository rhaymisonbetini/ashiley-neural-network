
# ASHILEY NEURAL-NETWORK
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![version](https://img.shields.io/badge/version-1.0.0-blue)

![alt text](https://i1.wp.com/sitn.hms.harvard.edu/wp-content/uploads/2017/08/Half-machine-half-human-brain-2.jpg?resize=960%2C600&ssl=1)


Ashiley is an open project aiming to perform the classification of images and texts with ML 100% in Javascript.
Every system runs under Node.js and the Adonis.js framework along with Google's TensorFlow.js.

The entire system was designed not to rely on a database.
All templates and files are stored in binaries or .txt

This project aims to prevent inappropriate or vulgar photos from being inserted into our system, so racist, malicious and inappropriate  descriptions or texts are posted in our environment.

We can also use Ashiley to validate specific systems. For example ... If you have a car sales website, you can train our AI to only accept pictures of cars, thus avoiding problems with other types of ads.

I tried to develop our system in the simplest and most usual way possible. My purpose is that you just train and make requests, so you don't  have to worry about writing any lines of code.

![alt text](https://github.com/rhaymisonbetini/ashiley-neural-network/blob/main/public/prints/document.jpg)

# 1 Installation

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
adonis serve --dev
```
# 2.1 how to train - photos

All training documents are located inside the public folder.

For photo training you must create the directories inside public / train so that the photos start exactly as the folder name + the number (if it is less than 10 it must contain the zero to the left).
After inserting the correctly named photos you must go to the Controller BrainController and in the constant className insert the name of the new training class into the array
In this version only JPG formats are allowed.
 
 * <b>photo training routes<b/> <br/>
   <b>GET:<b/> trainRGB -> Training based on RGB color scale.
   It is advisable to use it for comparison and color <br/>
   classification, such as a can of coca-cola

   <b>GET:<b/> trainContour -> Training based on color scale and
   photo outlines. In this training, resizing takes place
   of pictures
   
   <b>GET:<b/> trainNeuralNetWork -> ML-based training with
   Google's TensorFlow. Level of accuracy very high.


# 2.2 how to train - text
For training and classification of texts Ashiley has two forms of treatment. ML and Naive Bayes Classification.
With this training our AI will be able to classify text with racist, extremist or improper content.

Within the Helpers / Helpers.js file there is a method that returns an object array that expects a type and set of phrases related to this model.

* <b>text training routes<b> <br/>

  <b>GET:<b/> trainText -> ML-based training with google's tensorFlow.js.

  <b>GET:<b/> trainNavy -> Training based on the NavyBaiers Algorithm

# 3 How to use

* <b>image classification routes<b/> <br/>
   <b>METHOD: POST<b/>
   Ashiley hopes to receive a formData with an image file from
   nom "image" that must have a maximum of 2mb and be in JPG format.


* <b>text classification routes<b/> <br/>
  <b>METHOD: POST<b/>
  At this point Ashiley hopes to receive a text in an http request. The name of 
  the text field must be "text" and does not have a pre-set size or character limit.
    
# 4 production environment

To run our AI in a production environment to validate our images and texts, we follow the steps below:

initially install PM2:
```
npm install pm2 -g
```
All right, now we must configure our AI. Our .env file must have the following characteristics

```
HOST=0.0.0.0
PORT=3333
NODE_ENV=production 
APP_URL=http://${HOST}:${PORT}
CACHE_VIEWS=false
APP_KEY=DgtuWIF6DlJq1UK4NjPlqwecPCzbvbfm

DB_CONNECTION=sqlite
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_DATABASE=adonis

SESSION_DRIVER=cookie
HASH_DRIVER=bcrypt

```
Now we are going to generate a new APP_KEY for our AI (in the future it will be used for authentication on our system).

```
 adonis key:generate
```

Okay, now it's time to get our AI to run.
Within the root folder of the system, execute the command:

```
pm2 start server.js --name
```
Now run the command to see if everything is running:

```
pm2 list
```

All right, now just start validating the images and texts sent to your system

# 5 Authentication system
* development
