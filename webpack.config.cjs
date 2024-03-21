const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/",
    filename: "final.cjs",
  },
  target: "node",
};
