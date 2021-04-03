'use strict'

const fs = require('fs');
const Helpers = use('Helpers')

class WriteBrainService {

    async writeBrain(classification, fileName) {
        fs.writeFileSync(Helpers.publicPath(`brainfiles/${fileName}`), JSON.stringify(classification));
        return;
    }

    async readBrain(fileName) {
        let classification = fs.readFileSync((Helpers.publicPath(`brainfiles/${fileName}`)));
        return JSON.parse(classification.toString().trim());
    }

    async findFile(file) {
        return fs.readFileSync(file);
    }

    async existFile(file) {
        return fs.existsSync(file);
    }

    async removeFile(file){
        return fs.unlinkSync(file);
    }

}

module.exports = WriteBrainService;