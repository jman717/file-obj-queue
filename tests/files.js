var colors = require('colors'),
    file_queue = require("../app.js"),
    fs = require('fs'),
    validPath = require('valid-path')

var file_data = [
    { props: { id: 100, name: "all", path: "./appenders/all.js", absolute_path: __filename, check: true } },
    { props: { id: 101, name: "func_all", path: "./appenders/func_all.js", absolute_path: __filename, check: true } },
    { props: { id: 102, name: "top_one", path: "./appenders/top_one.js", absolute_path: __filename, check: true } },
    { props: { id: 103, name: "bottom_one", path: "./appenders/bottom_one.js", absolute_path: __filename, check: true } },
    { props: { id: 104, name: "sync_all", path: "./appenders/sync_all.js", absolute_path: __filename, check: true } },
    { props: { id: 105, name: "status", path: "./appenders/status.js", absolute_path: __filename, check: true } },
    { props: { id: 106, name: "name", path: "./appenders/name.js", absolute_path: __filename, check: true } },
    { props: { id: 107, name: "version", path: "./appenders/version.js", absolute_path: __filename, check: true } }
]


var file_object = class file_obj {
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

var qRequire = new file_queue()

qRequire.process({ appender: "json_all", 
                    process_objects: [file_object], 
                    data_to_process_array: file_data }).then((success)=>{
    qRequire.logMsg(`test success: all file objects processed with no errors`.success)
},(error)=>{
    let add_s = (error.error_count > 1) ? 's' : ''
    qRequire.logMsg(`${error.error_count} error${add_s} detected`.error)
})

