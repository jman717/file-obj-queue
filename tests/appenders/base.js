/*
* @author Jim Manton: jrman@risebroadband.net
* @since 2017-10-01
* lib/appenders/base.js
*/

var colors = require('colors')

class process_object {
    constructor(props) {
        let t = this
        t.parent = props.parent
        t.objs = t.parent.getParent().getObjs()
        t.status = 'process'
        t.process_objs_item = 0
        t.process_props_item = 0
        t.await_item = 0
        t.any_errors = false

        t.continueProcessing = t.continueProcessing.bind(t)
    }

    process = () => {
        let t = this
        try {
            if (t.process_objs_item >= t.objs.length) {
                if (t.any_errors)
                    t.setStatus('finish with errors')
                else
                    t.setStatus('finish')
                return
            }
            try {
                let obj, pro, itm
                try {
                    obj = t.parent.getParent().getItemToProcess(t.process_objs_item)
                } catch (e) {
                    e.message = `base error: (${e.message})`
                    throw e
                }
                try {
                    pro = (typeof obj == 'function') ? obj : obj.process;
                } catch (e) {
                    t.parent.getParent()(`pro error: (${e.message})`.red)
                    throw e
                }
                if (typeof t.parent.pro_props != 'undefined' &&
                    typeof t.parent.pro_props.property != 'undefined' &&
                    typeof t.parent.pro_props.items != 'undefined' &&
                    typeof obj._getProperty == 'function') {
                    let skip = true
                    for (let q = 0; q < t.parent.pro_props.items.length; q++) {
                        itm = t.parent.pro_props.items[q]
                        if (itm == obj._getProperty(obj)) {
                            skip = false
                            break
                        }
                    }
                    if (skip) {
                        t.continueProcessing()
                        return
                    }
                }
                t.setStatus('wait')
                pro((obj_props) => {
                    try {
                        if (typeof obj_props != 'undefined' && typeof obj_props.error != 'undefined') {
                            t.any_errors = true
                            t.parent.getParent().logMsg(obj_props)
                        } else {
                            t.parent.getParent().logMsg(obj_props)
                        }
                        t.parent.results_array.push(obj_props)
                        t.continueProcessing()
                    } catch (e) {
                        t.parent.getParent().logMsg(`pro obj error: (${e.message})`.red)
                        throw e
                    }
                })
            } catch (e) {
                e.message = `error: ${e.message} `
                throw e
            }
        } catch (e) {
            e.message = `process_object error: ${e.message} `
            throw e
        }
    }

    continueProcessing = () => {
        let t = this
        t.process_objs_item++
        t.setStatus('process')
        t.parent.process_all()
    }

    getStatus = () => {
        return this.status
    }

    setStatus = (v) => {
        this.status = v
    }
}

exports = module.exports = class base {
    constructor(props) {
        let t = this
        t.await_array = []
        t.resolve_array = []
        t.reject_array = []
        t.results_array = []
        t.getParent = props.getParent
        t.dt_start = null
        t.dt_end = null
        t.process_object = null
        t.pro_props = []

        t.process = t.process.bind(this)
        t.process_all = t.process_all.bind(this)
    }

    // await(props) {
    //     let t = this
    //     t.await_array.push(props)
    //     return new Promise((resolve, reject) => {
    //         t.resolve_array.push(resolve)
    //         t.reject_array.push(reject)
    //     });
    // }

    process(props) {
        let t = this
        t.dt_start = new Date(); // start measuring time

        t.pro_props = props

        return new Promise((resolve, reject) => {
            t.resolve_array.push(resolve)
            t.reject_array.push(reject)
            t.process_all()
        });
    }

    getStats() {
        let t = this
        t.dt_end = new Date();
        let ret_str = '', st = t.dt_start, ed = t.dt_end, ml = t.dt_end - t.dt_start
        // ret_str += JSON.stringify(t.results_array)
        if (t.getParent().getStats()) {
            ret_str += `start (${st}) end(${ed}) milliseconds(${ml})`
        }
        return ret_str   
    }

    process_all = () => {
        let t = this, _continue
        if (t.process_object == null) {
            t.process_object = new process_object({ parent: t })
        }

        _continue = false
        try {
            switch (t.process_object.getStatus()) {
                case 'process':
                    t.process_object.process()
                    _continue = true
                    break
                case 'finish with errors':
                    t.reject_array[t.reject_array.length - 1](t.getStats())
                    break
                case 'finish':
                    t.resolve_array[t.resolve_array.length - 1](t.getStats())
                    break
                case 'wait':
                    return
                default:
                    throw new Error(`status(${t.process_object.getStatus()}) does not exist`)
            }

            if (_continue)
                t.process_all()
        } catch (e) {
            e.message = `process_all error: ${e.message} `
            throw e
        }
    }
}

