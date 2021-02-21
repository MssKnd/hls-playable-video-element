const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  cache: true,
  output: {
    path: path.join(__dirname, "dist"),
    filename: "index.js"
  },
  module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader'
        }
      ]
    },
  resolve: {
    modules: [
      "node_modules",
    ],
    extensions: [
      '.ts',
      '.js'
    ]
  }
};

if (process.env.NODE_ENV !== 'production') {
  module.exports.devtool = 'eval';
}
