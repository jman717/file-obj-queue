/*
* @author Jim Manton: jrman@risebroadband.net
* @since 2021-03-22l
* lib/appenders/all.js
*/

var base = require('./base.js')

exports = module.exports = class all extends base{
	constructor(props) {
		super(props)
        var t = this
		t.aname = 'all'
		t.pro_types = ['items']
		return t
    }
}
