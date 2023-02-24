const assert = require('assert'),
    jsonHasDifferences = require('diffler'),
    packagejson = require('../package.json')

const packageMock = {
  "author": {
    "name": "Jim Manton"
  },
  "version": "2.0.5",
  "bundleDependencies": [],
  "dependencies": {
    "@types/node": "^18.11.19",
    "chai": "^4.3.7",
    "colors": "^1.4.0",
    "diffler": "^2.0.4",
    "fs": "^0.0.1-security",
    "mocha": "^10.2.0",
    "queuejson": "^9.0.11",
    "typescript": "^4.9.5",
    "valid-path": "^2.1.0"
  },
  "scripts": {
    "start": "node app.ts",
    "test": "mocha",
    "ditched": "ditched -a",
    "test_files": "node ./tests/files"
  },
  "keywords": [
    "queue",
    "processing",
    "appenders",
    "javascript",
    "synchronous",
    "objects",
    "promises",
    "mocha"
  ],
  "homepage": "https://github.com/jman717/file-obj-queue",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/jman717/file-obj-queue.git"
  },
  "deprecated": false,
  "description": "Queue File Objects",
  "email": "jrman@risebroadband.net",
  "license": "MIT",
  "main": "app.js",
  "name": "file-obj-queue",
  "start": "node app.js"
}

describe('package.json', function () {
    it('should pass', function () {
      const difference = jsonHasDifferences(packagejson, packageMock)
      assert(JSON.stringify(difference) == "{}")
    })

    it('should fail', function () {
        packageMock.version = '0'
        assert(jsonHasDifferences(packagejson, packageMock))
    })
})
