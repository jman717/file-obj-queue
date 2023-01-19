/*
* @author Jim Manton: jrman@risebroadband.net
* @since 2021-03-22
* lib/appenders/sync.js
*/

var base = require('./base.js')

exports = module.exports = class sync extends base {
    constructor(props) {
        super(props)
        var t = this
        t.aname = 'sync'
		t.pro_types = ['items', 'byIds']
        return t
    }
}
