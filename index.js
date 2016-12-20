var util = require('util'),
    _ = require('lodash')

var genModule = (name, module, obj) => `
    // --- BEGIN ${name} ---
    require('${module}')(${util.inspect(obj, { depth: null })}, (err, obj) => {
        if (err) {
            obj.error = err
        }

        responses['${name}'] = obj
    })

    if (responses['${name}'].error) {
        console.log(responses)
        throw responses['${name}'].error
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
    var mod_name = _.keys(module)[1]
    if (mod_name == 'serial') {
        return serial(name, module[mod_name]) 
    }
    return genModule(name, mod_name, module[mod_name])
}

var compose = (tree) => `
    var waterfall = require('async.waterfall')
    var responses = {}
    ${tree.tasks.map(task => `${handleModule(task)}`).join('')}
    console.log(JSON.stringify(responses))
`

module.exports = (tree) => {
    var source = compose(tree)
    console.log(source)
}
