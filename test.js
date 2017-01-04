var tree = {
    tasks: [
        { 
            name: 'test',
            echo: {
                x: 'x',
                y: 'y',
                z: 'z',
                arr: ['1','2','3']
            }
        },
        {
            name: 'test2',
            serial: [
                {
                    name: 'test3',
                    echo: 'echo2'
                },
                {
                    name: 'test4',
                    echo: 'echo3'
                },
                {
                    name: 'parallel test',
                    parallel: [
                        {
                            name: 'partest1',
                            echo: 'fasfds'
                        },
                        {
                            name: 'partest2',
                            echo: 'fdsafsa'
                        }
                    ]
                },
                {
                    name: 'parallel test2',
                    parallel: [
                        {
                            name: 'partest3',
                            echo: 'fasfds'
                        },
                        {
                            name: 'partest4',
                            echo: 'fdsafsa'
                        }
                    ]
                }
            ]
        },
        {
            name: 'test5',
            echo: 'echo4'
        }
    ]
}

console.log(require('./index.js')(tree))
