
/*
* @author Jim Manton: jrman@risebroadband.net
* @since 2023-02-02
* apps.js
*/

let cc = require("colors"),
    file_requre_data = [
        { props: { id: 100, name: "all", path: "./lib/appenders/all.js", absolute_path: __filename, check: true } }
    ]

cc.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});


class process_object {
    constructor(props) {
        let t = this
        t.parent = props.parent
        t.status = 'process'
        t.objs = t.parent.getParent().getObjs()
    }

    process() {
        let t = this
    }

    continueProcessing() {
        let t = this
    }

    getStatus() {
        return this.status
    }

    setStatus(v) {
        this.status = v
    }
}

exports = module.exports = class BaseQueue {
    constructor(props = {}) {
        let t = this, fname = `BaseQueue app constructor`
        try {
            t.parent = null
            t.appenders_dir = './appenders/'
            t.appender = null

            t.logMsg = t.logMsg.bind(t)
            t.init = t.init.bind(t)
            t.load = t.load.bind(t)
            t.process = t.process.bind(t)
            t.set_base_promise = t.set_base_promise.bind(t)
            t.base_promise = null
            t.base_resolve = null
            t.base_reject = null

            t.set_base_promise()

            return t
        } catch (e) {
            t.logMsg(`${fname}: ${e.message}`.error)
        }
    }

    set_base_promise() {
        let t = this, fname = `BaseQueue set_base_promise`

        t.base_promise = new Promise((resolve, reject) => {
            t.base_resolve = resolve
            t.base_reject = reject
        })

        t.base_promise.then(function (success) {
            t.parent.app_resolve(success)
        }).catch(function (err) {
            t.parent.app_reject(err)
        })

    }

    init(props = {}) {
        let t = this, fname = `BaseQueue init`
    }

    load(props = {}) {
        let t = this, fname = `BaseQueue load`, a, app, req

        if (typeof props.parent == 'undefined')
            t.base_reject(`${fname}: props.parent not defined`)

        t.parent = props.parent
        props.parent = t
        app = props.appender
        a = t.appenders_dir + app + '.js'
        req = require(a)
        t.parent.logMsg(`${fname} loading appender(${a})`.debug)
        t.appender = new req(props)
        return t
    }

    process() {
        let t = this, fname = `BaseQueue process`, res, error_count = 0
        try {
            t.logMsg(`${fname}`.debug)

            res = t.appender.init().process().get_results_array()
            res.map((json, i) => {
                if (typeof json.success != "undefined")
                    t.logMsg(`${JSON.stringify(json)}`.success)
                if (typeof json.error != "undefined") {
                    t.logMsg(`${JSON.stringify(json)}`.error)
                    error_count++
                }
            })
            if (error_count) {
                res.error_count = error_count
                t.base_reject(res)
            } else
                t.base_resolve(res)
        } catch (e) {
            t.base_reject(`${fname}: ${e.message}.`)
        }
    }

    logMsg(msg, props = {}) {
        let t = this
        try {
            console.log(msg)
            return t
        } catch (e) {
            t.base_reject(`BaseQueue log: ${e.message} for message (${msg})`)
        }
    }
}
