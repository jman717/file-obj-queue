/*
* @author Jim Manton: jrman@risebroadband.net
* @since 2022-12-11
* all.ts
*/

var base = require('./base.js')

exports = module.exports = class all extends base {
	constructor(props) {
		super(props)
		var t = this
		try {
			t.aname = 'all'
			t.parent.logMsg(`all constructor`, {"type": "debug"})
			return t
		} catch (e) {
			t.parent.logMsg(e, {"type": "error"})
		}

	}
}