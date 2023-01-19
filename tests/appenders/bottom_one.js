/*
* @author Jim Manton: jrman@risebroadband.net
* @since 2021-03-22
* lib/appenders/bottom_one.js
*/

var base = require('./base.js')

exports = module.exports = class bottom_one extends base{
	constructor(props) {
		super(props)
        var t = this
		t.aname = 'bottom_one'
		t.pro_types = ['items']
		return t
    }
}
