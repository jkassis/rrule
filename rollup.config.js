import typescript from '@rollup/plugin-typescript'
import nodeResolve from '@rollup/plugin-node-resolve'
import closureCompiler from '@ampproject/rollup-plugin-closure-compiler'
import commonjs from '@rollup/plugin-commonjs'

export default {
    input: 'src/index.ts',
    output: {
        dir: 'dist',
        format: 'es',
    },
    plugins: [
        typescript({ outDir: 'dist/ts', sourceMap: true }),
        nodeResolve({
            moduleDirectory: 'node_modules'
        }),
        commonjs()
        // , closureCompiler({
        //     compilation_level: 'SIMPLE',
        //     language_in: 'ECMASCRIPT_2018',
        //     language_out: 'ECMASCRIPT_2017',
        //     warning_level: 'QUIET',
        //     // platform: process.env.GOOGLE_CLOSURE_COMPILER_PLATFORM
        // }
        // )
    ]
}