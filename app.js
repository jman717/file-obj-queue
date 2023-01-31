/* @author Jim Manton: jrman@risebroadband.net
* @since 2023-01-15
* Main processing app
*/

let colors = require('node-console-colors'),
    fs = require('fs'),
    validPath = require('valid-path')

class file_obj {
    constructor(props) {
        let t = this
        t.id = props.id
        t.log = props.log
        t.name = props.name
        t.path = props.path
        t.absolute_path = props.absolute_path
        t.status = 'init'
        t.errors = false
        t.error_msg = 'none'

        t.process = t.process.bind(t)
        t.do_checks = t.do_checks.bind(t)

        if (props.check) {
            t.do_checks()
        }

        return t
    }

    do_checks() {
        let t = this, path_to_check,
            last_item = t.absolute_path.split("\\").pop(),
            check_file = t.absolute_path.split(last_item)[0], check_path = t.path.split('/')

        check_file = check_file.replace(/\\/g, "/");
        path_to_check = validPath(t.path);

        if (!path_to_check.valid) {
            t.errors = true
            t.error_msg = `id = ${t.id} name(${t.name}) Error in ${path_to_check.data.input}: ${path_to_check.error})`
        }

        check_path.map((dat, i) => {
            if (/^[a-zA-Z._]+$/.test(dat)) {
                if (dat != '.')
                    check_file += dat + '/'
            }
        })
        check_file = check_file.slice(0, -1)
        try {
            if (!fs.existsSync(check_file)) {
                t.errors = true
                t.error_msg = `id = ${t.id} name(${t.name}) file (${check_file} does not exist)`
            }
        } catch (e) {
            e.message = "file_obj do_checks error: " + e.message
            throw (e)
        }
    }

    process(callback) {
        let t = this
        if (t.errors)
            callback({ error: { msg: t.error_msg } })
        else
            callback({ success: { msg: `id = ${t.id} name(${t.name})` } })
    }
}

exports = module.exports = class FilesQueue {
    constructor() {
        try {
            var t = this
            t.logMsg = t.logMsg.bind(t)
            t.init = t.init.bind(t)
            t.getFileObject = t.getFileObject.bind(t)
            t.json_queue = require("./local_queuejson/app")
            t.qJson = null

            t.logMsg(`FilesQueue.constructor`)

            return t
        } catch (e) {
            e.message = "FilesQueue app.js constructor error: " + e.message
            throw (e)
        }
    }

    init(props = {}) {
        let t = this
        try {
            if (t.qJson == null) {
                if (typeof props.input_data == 'undefined')
                    throw new Error('props.input_data is not defined')
                try {
                    t.logMsg(`jrm debug 1/29 8800`)
                    t.qJson = new t.json_queue({
                        class_obj: file_obj,
                        appender: 'all',
                        stats: true,
                        debug: true,
                        parent: t
                    })
                    t.logMsg(`jrm debug 1/29 8801`)
                } catch (e) {
                    e.message = "queuejson error: " + e.message
                    t.logMsg(e.message)
                    throw (e)
                }
                try {
                    t.qJson.init({ input_data: props.input_data })
                    t.qJson.process()
                } catch (e) {
                    e.message = "queuejson.init error: " + e.message
                    t.logMsg(e.message)
                    throw (e)
                }

            }
            return t
        } catch (e) {
            e.message = "FilesQueue app.js init error: " + e.message
            t.logMsg(e.message)
            throw (e)
        }
    }

    getFileObject() {
        return this.qJson.get_class_obj_array()
    }

    logMsg(msg, props = {}) {
        console.log(msg)
    }
}