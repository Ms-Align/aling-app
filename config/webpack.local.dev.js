/**
 * @description 当使用本地服务器时使用的配置文件。注意由于远程服务器中的资源与git仓库中的不一致所以会出现资源加载失败的问题请忽视。
 */
const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const webpack = require("webpack")
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin
const { merge } = require("webpack-merge")
const common = require("./webpack.common.js")
module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map", // 创建source-map映射文件
  devServer: {
    static: "../dist",
    hot: true,
    historyApiFallback: true,
    proxy: {
      "/align-server": {
        //target: "http://1.94.60.205",
        target: "http://localhost:2120",
        secure: false,
        pathRewrite: { "^/align-server": "" },
      },
      "/img": {
        //target: "http://1.94.60.205",
        target: "http://localhost:2120",
        secure: false,
        pathRewrite: { "^/img": "" },
      },
      "/api": {
        //target: "http://1.94.60.205",
        target: "http://localhost:2120",
        secure: false,
        pathRewrite: { "^/api": "" },
      },
    },
    // historyApiFallback: {
    //   rewrites: [
    //     {
    //       from: /./,
    //       to: "/blog/example/",
    //     },
    //   ],
    // },
  },
  plugins: [
    //帮助webpack理解自定义的环境变量
    new webpack.DefinePlugin({
      "process.env.ALIGN_SERVER_PREFIX": JSON.stringify("/align-server"),
    }),
  ],
})
