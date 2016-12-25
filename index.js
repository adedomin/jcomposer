/*
 * Copyright (c) 2016 prussian <genunrest@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var util = require('util')

var genModule = (name, module, obj) => `
    // --- BEGIN ${name} ---
  (cb) => {
    require('${module}')(${util.inspect(obj, { depth: null })}, (err, obj) => {
        responses['${name}'] = obj
        cb(err)
    }) 
  }
    // ---- END ${name} ----
`

var serial = (name, modules) => {
    var first = '(next) => {'
    return `
        // --- BEGIN ${name} ---
        waterfall([
            ${modules.map(module => {
                var ret = `
                    ${first} 
                        ${handleModule(module)}
                        next()
                    }
                `
                if (first.indexOf(',' < 0)) first = ', (next) => {'
                return ret
            }).join('')}
        ])
        // ---- END ${name} ----
    `
}

var handleModule = (module) => {
    var name = module.name
    var mod_name = Object.keys(module)[1]
    if (mod_name == 'serial') {
        return serial(name, module[mod_name]) 
    }
    return genModule(name, mod_name, module[mod_name])
}

var compose = (tree) => `
    var waterfall = require('async.waterfall')
    var parallel = require('async.parallel')
    var responses = {}
    parallel([
        ${tree.tasks.map(task => `${handleModule(task)}`).join(',')}
    ], (err) => {
        if (err) throw err
        console.log(JSON.stringify(responses))
    })
`

module.exports = (tree) => {
    return compose(tree)
}
