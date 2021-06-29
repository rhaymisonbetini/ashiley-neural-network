'use strict'

const Helpers = use('Helpers')
const fs = require('fs');

class UploadImageService {

    async uploadFile(request) {

        const profilePic = request.file('image', {
            types: ['image'],
            size: '2mb',
            extnames: ['jpg','jpeg']
        })

        let name = Date.now().toString();

        await profilePic.move(Helpers.publicPath('files'), {
            name: name + '.jpg',
            overwrite: true
        })

        if (!profilePic.moved()) {
            return profilePic.error()
        }
        return name;
    }

    async removeFile(file) {
        let path = Helpers.publicPath(`files/${file}.jpg`)
        return fs.unlinkSync(path);
    }

}

module.exports = UploadImageService;