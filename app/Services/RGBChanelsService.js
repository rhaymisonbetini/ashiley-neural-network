'use strict'

class RGBChanelsService {

    async returnRGBChanels(colors) {

        let arrayColors = [];

        for (let color = 0; color < colors.length; color++) {
            //this return is a 3 chanels rgb colors
            const rgb = colors[color].css()
                .toString()
                .replace('rgb', '')
                .replace('(', '')
                .replace(')', '')

            const arrayRgb = rgb.split(',');

            arrayColors.push(Number(arrayRgb[0]));
            arrayColors.push(Number(arrayRgb[1]));
            arrayColors.push(Number(arrayRgb[2]));
        }

        return arrayColors;
    }

}

module.exports = RGBChanelsService;