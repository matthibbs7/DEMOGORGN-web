const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin'); // Import the plugin


module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./static/frontend"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(css|sass|scss)$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
        ]
      },
      {
        test: /fonts\/.*\.(woff|woff2|eot|ttf|svg)$/,
        loader: 'file-loader',
        options: {
          name: "[name]-[hash].[ext]",
        }
      }
       
    ],
  },
  optimization: {
    minimize: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        // This has effect on the react lib size
       // NODE_ENV: JSON.stringify("production"),
      },
    }),
    new HtmlWebpackPlugin({
      template: './templates/frontend/index.html', // Path to your HTML template
      filename: 'index.html', // Output file name
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'static/frontend'), // Assuming your compiled assets are here
    },
    historyApiFallback: true, // This is necessary for single-page applications
    compress: true,
    port: 3000, // You can choose any port you want
    open: true, // This will open the browser automatically
    hot: true,
    proxy: {
      '/api': 'http://localhost:8000', // Proxy API requests to Django backend server
    },
  },
};