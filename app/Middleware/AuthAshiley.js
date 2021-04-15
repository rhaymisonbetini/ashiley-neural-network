'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Env = use('Env')

class AuthAshiley {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, response }, next) {
    let token = request.header('Authorization');
    let ashileyKey = await Env.getOrFail('APP_KEY');
    console.log(token)
    console.log(ashileyKey)
    if (token == ashileyKey) {
      await next(request)
    } else {
      return response.status(401).send({ message: 'UNAUTHORIZED' })
    }
  }
}

module.exports = AuthAshiley
