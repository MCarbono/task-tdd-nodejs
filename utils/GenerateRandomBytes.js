const crypto = require('crypto')

const generate = function(){
    return crypto.randomBytes(30).toString('hex')
}

module.exports = generate;