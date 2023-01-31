var colors = require('node-console-colors'),
    file_queue = require("../app.js")

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

console.log(`jrm debug 1/29 2200`)
var qRequire = new file_queue().init({ input_data: file_data })  
console.log(`jrm debug 1/29 2201`)

console.log(`test complete`)

