/*
* @author Jim Manton: jrman@risebroadband.net
* @since 2022-12-11
* base.js
*/

var qObj = require("queueobj");

exports = module.exports = class base {
    constructor(props) {
        let t = this, fname = `base constructor`
        try {
            t.parent = props.getParent()
            t.resolve_array = []
            t.reject_array = []

            t.qObj = new qObj()
            t.qObj.load({ appender: props.appender, stats: props.stats, log: t.parent.logMsg })

            t.process = t.process.bind(t)
            t.process_all = t.process_all.bind(t)
            return t
        } catch (e) {
            t.parent.logMsg(`${fname}: ${e}`, { "type": "error" })
            throw e
        }
    }

    process = (props) => {
        let t = this, fname = `base process`
        try {
            t.dt_start = new Date(); // start measuring time

            t.parent.logMsg(fname, { "type": "debug" })
            return new Promise((resolve, reject) => {
                t.resolve_array.push(resolve)
                t.reject_array.push(reject)
                t.process_all()
            });
        } catch (e) {
            t.parent.logMsg(`${fname}: ${e}`, { "type": "error" })
        }
    }

    process_all = () => {
        let t = this, fname = `base process_all`, coa
        try {
            t.parent.logMsg(fname, { "type": "debug" })

            coa = t.parent.get_class_obj_array()

            if (coa.length == 0) {
                t.reject_array[0]({ error: 'no matching data to process' })
            }

            coa.map((dat, i) => {
                dat.log = t.log
                if (typeof t.qObj == 'undefined')
                    throw new Error(`qObj does not exist`)

                if (typeof dat._getFuncName == 'function') {
                    t.parent.logMsg(`${fname}: function name(${dat._getFuncName()})`, { "type": "debug" })

                    t.qObj.add(eval(`dat.${dat._getFuncName()}`))
                } else {
                    t.qObj.add(dat)
                }
            })

            t.qObj.process({}).then((res) => {
                t.resolve_array[0]({ res })
            }, (err) => {
                t.reject_array[0]({ err })
            })
        } catch (e) {
            t.parent.logMsg(`${fname}: ${e}`, { "type": "error" })
            throw e
        }
    }
}
