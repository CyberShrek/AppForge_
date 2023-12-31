import applyTypescript from "@rollup/plugin-typescript"
import resolveNodeJs from '@rollup/plugin-node-resolve'
import applyTerser from '@rollup/plugin-terser'
import clean from "@rollup-extras/plugin-clean"
import commonjs from '@rollup/plugin-commonjs'
import sveltePreprocess from "svelte-preprocess"
import svelte from "rollup-plugin-svelte"

const dev = !!process.env.ROLLUP_WATCH

export default  {

    dev: false,
    input: [`./src/main/typescript/index.ts`, `./src/main/typescript/forge.ts`, `./src/test/typescript/components_debug/debug.js`],
    output: [
        {
            dir: "./src/main/resources/static/js/built",
            format: "es",
            sourcemap: dev,
            manualChunks:{
                wretch: ["wretch"],
                domtoimage: ["dom-to-image"],
                sweetAlert2: ["sweetalert2"],
                easepick: ["@easepick/amp-plugin", "@easepick/core", "@easepick/lock-plugin", "@easepick/range-plugin"]
            }
        }
    ],
    plugins: [
        clean(),
        commonjs({
            namedExports:{
                "dom-to-image": ["dom-to-image"],
            }
        }),
        resolveNodeJs({
            mainFields: [ "module", "browser", "main" ],
            dedupe: ['s']
        }),
        applyTypescript(),
        applyTerser(),
        svelte({
            compilerOptions: {
                dev
            },
            preprocess: sveltePreprocess(),
        })
    ],
    onwarn: (warning, handle) => {
        // Ignore node_modules warnings
        if(warning.loc?.file?.includes("node_modules") || warning.ids?.toString()?.includes("node_modules"))
            return

        handle(warning.message)
    }
}