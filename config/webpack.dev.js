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
        target: "http://1.94.60.205",
        secure: false,
        pathRewrite: { "^/align-server": "" },
      },
      "/img": {
        target: "http://1.94.60.205",
        secure: false,
        //pathRewrite: { "^/img": "" },
      },
      "/api": {
        target: "http://1.94.60.205",
        secure: false,
        //pathRewrite: { "^/img": "" },
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
