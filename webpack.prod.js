const { merge } = require("webpack-merge");
const path = require("path");
const common = require("./webpack.common.js");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

process.env["NODE_ENV"] = "production";

module.exports = merge(common, {
  mode: "production",
  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "dist"), // ✅ ensures /dist folder is created
    clean: true, // ✅ cleans old files
  },
  optimization: {
    minimize: true,
    minimizer: [
      "...", // ✅ include existing minimizers like Terser
      new CssMinimizerPlugin(),
    ],
  },
});
