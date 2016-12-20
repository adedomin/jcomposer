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
                }
            ]
        },
        {
            name: 'test5',
            echo: 'echo4'
        }
    ]
}

require('./index.js')(tree)
