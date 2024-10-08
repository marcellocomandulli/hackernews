const path = require("path");

module.exports = {
  entry: {
    index: "./src/JS/script.js"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },
  module: { rules: []},
  plugins: [],
  devServer: {},
  mode: "production"
}