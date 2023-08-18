const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack");
const path = require("path");

module.exports = defineConfig({
  chainWebpack: (config) => {
    // rust wasm bindgen https://github.com/rustwasm/wasm-bindgen
    config
      .plugin("wasm-pack")
      .use(WasmPackPlugin)
      .init(
        (Plugin) =>
          new Plugin({
            crateDirectory: path.resolve(__dirname, "./src/maze-solver"),
          })
      )
      .end()
      //  needed for Edge browser https://rustwasm.github.io/docs/wasm-bindgen/examples/hello-world.html
      .plugin("text-encoder")
      .use(webpack.ProvidePlugin)
      .init(
        (Plugin) =>
          new Plugin({
            TextDecoder: ["text-encoding", "TextDecoder"],
            TextEncoder: ["text-encoding", "TextEncoder"],
          })
      )
      .end();
  },
  configureWebpack: {
    experiments: {
      asyncWebAssembly: true,
    },
  },
  transpileDependencies: true,
});
