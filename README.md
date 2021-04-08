ASHILEY NEURAL-NETWORK

Ashiley is an open project aiming to perform the classification of images and texts with ML 100% in Javascript.
Every system runs under Node.js and the Adonis.js framework along with Google's TensorFlow.js.

The entire system was designed not to rely on a database.
All templates and files are stored in binaries or .txt

# 1 Installation
``
git clone <br/>
cd ashiley-neural-network
npm install
adonis serves --dev
``
# 2 how to train

All training documents are located inside the public folder.

* Photos

  For photo training you must create the directories inside public / train so that the photos start exactly as the folder name + the number (if it is less than 10 it must contain the zero to the left)
  After inserting the correctly named photos you must go to the Controller BrainController and in the constant className insert the name of the new training class into the array
 In this version only JPG formats are allowed.
