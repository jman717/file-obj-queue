/*
* @author Jim Manton: jrman@risebroadband.net
* @since 2022-12-11
* all.ts
*/

var base = require('./base.js')

exports = module.exports = class json_all extends base {
	constructor(props) {
		super(props)
		var t = this, fname = 'json_all.constructor'
		try {
			t.aname = 'json_all'
			t.main_process_objects = []
			
            if (t.base_name_appender != t.aname)
                throw new Error(`(${t.base_name_appender}) does not equal the appender name (${t.aname}))`)

			t.parent.logMsg(`${fname}`.debug)
			
            t.init = t.init.bind(t)
            t.process = t.process.bind(t)

			return t
		} catch (e) {
            t.parent.base_reject(`${fname} error: ${e.message})`)
		}
	}

	init (props = {}) {
		var t = this, fname = `json_all.init`, gotp, gdtpa, obj
		try {
			t.parent.logMsg(`${fname}`.debug)

			if (typeof t.get_objects_to_process()[0] == "undefined")
				throw new Error(`get_objects_to_process[0] has no data`)

			t.get_data_to_process_array().map((dat, i)=>{
				dat.props.log = t.parent.logMsg
				obj = t.get_objects_to_process()[0]
				t.main_process_objects.push(new obj(dat.props))
			})

			super.init(props)
			return t
		} catch (e) {
            t.parent.base_reject(`${fname} error: ${e.message})`)
		}
	}
	
	process (props = {}) {
		var t = this, fname = `json_all.process`
		try {
			t.parent.logMsg(`${fname} length(${t.main_process_objects.length})`.debug)

			t.main_process_objects.map((obj, i)=>{
				obj.process((res)=>{
					// t.parent.logMsg(`${fname}${JSON.stringify(res)})`.debug)
					t.results_array.push(res)
				})
			})

			super.process(props)
			return t
		} catch (e) {
            t.parent.base_reject(`${fname} error: ${e.message})`)
		}
	}
}