const path = require("path")
const TerserPlugin = require("terser-webpack-plugin")

const HtmlWebpackPlugin = require("html-webpack-plugin")
const webpack = require("webpack")
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin
const { merge } = require("webpack-merge")
const common = require("./webpack.common.js")
module.exports = merge(common, {
  mode: "production",
  plugins: [
    //new BundleAnalyzerPlugin({ analyzerMode: "static" }),
    new webpack.DefinePlugin({
      "process.env.ALIGN_SERVER_PREFIX": JSON.stringify(""),
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_debugger: true,
            drop_console: true,
            pure_funcs: ["console.log"], //删除打印语句
          },
          format: {
            comments: false, //删除所有注释
          },
        },
        parallel: true, //多核打包，提升打包速度
        extractComments: false, //是否将注释全部集中到一个文件中
      }),
    ],
  },
})
