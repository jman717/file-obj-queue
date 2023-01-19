/*
* @author Jim Manton: jrman@risebroadband.net
* @since 2023-01-16
* lib/appenders/name.js
*/

var base = require('./base.js')

exports = module.exports = class name extends base {
    constructor(props) {
        super(props)
        var t = this
        t.aname = 'name'
		t.pro_types = ['name']
        return t
    }
}