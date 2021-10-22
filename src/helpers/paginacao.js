'use strict'
module.exports = {
    findAndCountAll(obj, page, limit) {
        return {
            page: +page,
            limit: +limit,
            ...obj
        }
    }
}