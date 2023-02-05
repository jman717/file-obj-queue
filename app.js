/* @author Jim Manton: jrman@risebroadband.net
* @since 2023-01-15
* Main processing app
*/

let colors = require('colors'),
    base_queue = require("./base_queue/app")

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red',
    success: 'green'
});

exports = module.exports = class FilesQueue {
    constructor() {
        try {
            var t = this
            t.app_resolve = null
            t.app_reject = null
            t.successMsg = ''

            t.logMsg = t.logMsg.bind(t)
            t.process = t.process.bind(t)
            t.getFileObject = t.getFileObject.bind(t)

            t.logMsg(`FilesQueue.constructor`.debug)

            return t
        } catch (e) {
            e.message = `FilesQueue app.js constructor error: ${e.message}`.error
            throw (e)
        }
    }

    process(props = {}) {
        let t = this

        return new Promise((resolve, reject) => {
            t.app_resolve = resolve
            t.app_reject = reject

            if (typeof props.data_to_process_array == 'undefined')
                t.app_reject('base_queue no props.data_to_process_array')

            if (typeof props.appender == 'undefined')
                t.app_reject('base_queue no props.appender')

            if (typeof props.process_objects == 'undefined')
                t.app_reject(`props.process_objects not defined`)

            props.parent = t
            t.base_queue = new base_queue().load(props).process()
        })
    }

    getFileObject() {
        return this.qJson.get_class_obj_array()
    }

    logMsg(msg, props = {}) {
        console.log(msg)
    }
}