'use strict'

const moment = require('moment');
const md5 = require('md5');

const providers = [
    { provider: 'payu', chaves: [ 'apiKey', 'apiLogin', 'accountId', 'merchantId' ]},
    { provider: 'pagseguro', chaves: [ 'email', 'token' ]},
    { provider: 'rede', chaves: [ 'numeroFiliacao', 'chaveIntegracao' ]},
    { provider: 'cielo', chaves: [ 'merchant_id', 'merchant_key' ]},
]

module.exports = {
    proximoPagamento(dateObj) {
        const date = dateObj ? moment(dateObj) : moment();

        if (date.date() > 28) {
            date.set('date', 28);
        }
        let new_date = date.clone().add(1, 'month');

        return new_date
        // return new_date.format('DD/MM/YYYY');
    },

    generateSha1(info) {
        const hash = crypto
            .createHash('sha1')
            .update(info)
            .digest('hex');
        return hash;
    },

    generateMd5(info) {
        const hash = md5(info);
        return hash;
    },

    cieloBrand(card) {
        switch (card) {
          case 'mastercard':
            return 'Master';
          case 'amex':
            return 'Amex';
          case 'elo':
            return 'Elo';
          case 'visa':
            return 'Visa';
          case 'dinersclub':
            return 'Diners';
          case 'jcb':
            return 'JCB';
          case 'discover':
            return 'Elo';
          default:
            return 'not found';
        }
    },
    
    payUBrand(card) {
        switch (card) {
          case 'dinersclub':
            return 'diners';
    
          default:
            return card;
        }
    } 

    // montarCredenciais(arr, provedor) {
    //     const provider = providers.find(p => p.provider == provedor)
    //     const teste = provider.chaves
    // }
}