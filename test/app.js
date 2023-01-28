var assert = require('assert');

describe('app', function () {
    let app, application

    it('app.constructor should pass', function () {
        application = require('../app.js')
        assert(app = new application())
    })

    it('app.init is a function', function () {
        assert(typeof app.init == 'function')
    })
    
    it('app.logMsg is a function', function () {
        assert(typeof app.logMsg == 'function')
    })
        
    it('app.getFileObject is a function', function () {
        assert(typeof app.getFileObject == 'function')
    })
})

describe('require', function () {

    it('colors app', function () {
        assert(require('colors'))
    })

    it('queuejson', function () {
        assert(require('queuejson'))
    })

    it('fs', function () {
        assert(require('fs'))
    })
    
    it('valid-path', function () {
        assert(require('valid-path'))
    })
})
