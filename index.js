var browserify = require('browserify'),
    util = require('util'),
    _ = require('lodash')

var genModule = (name, module, obj) => `
    // --- BEGIN ${name} ---
    if (require('${module}').async) {
        require('${module}')(${util.inspect(obj, { depth: null })}, (err, obj) => {
            if (err) {
                obj.error = err
            }
            
            responses['${name}'] = obj
        })
    }
    else {
        responses['${name}'] = 
            require('${module}')(${util.inspect(obj, { depth: null })})
    }

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
    var waterfall = require('async/waterfall')
    var responses = {}
    ${tree.tasks.map(task => `${handleModule(task)}`).join('')}
    console.log(JSON.stringify(responses))
`

var generateBlob = (tree) => {
    var source = compose(tree)
    console.log(source)
//    browserify(source, {
//        commondir: false,
//        builtins: [],
//        detectGlobals: false
//    }).bundle().pipe(process.stdout)
}

module.exports = generateBlob

//var tree = {
//    tasks: [
//        { 
//            name: 'test',
//            echo: {
//                x: 'x',
//                y: 'y',
//                z: 'z',
//                arr: ['1','2','3']
//            }
//        },
//        {
//            name: 'test2',
//            serial: [
//                {
//                    name: 'test3',
//                    echo: 'echo2'
//                },
//                {
//                    name: 'test4',
//                    echo: 'echo3'
//                }
//            ]
//        },
//        {
//            name: 'test5',
//            echo: 'echo4'
//        }
//    ]
//}
//generateBlob(tree)
