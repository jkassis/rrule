import typescript from '@rollup/plugin-typescript'
import nodeResolve from '@rollup/plugin-node-resolve'

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
        })
    ]
}