const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

dotenv.config();

const dist = path.join(__dirname, 'dist');
const pages = fs.readdirSync('./src/pages');
const entries = pages.reduce(
  (entry, page) => ({
    ...entry,
    [page]: `./src/pages/${page}/index.js`,
  }),
  {},
);

const HtmlWebpackPlugins = pages.map(
  (page) =>
    new HtmlWebpackPlugin({
      filename: `pages/${page}/index.html`,
      chunks: [`${page}`],
      template: `src/pages/${page}/index.html`,
    }),
);

module.exports = {
  entry: {
    index: './src/index.js',
    ...entries,
  },
  output: {
    path: dist,
    filename: ({ chunk: { name } }) =>
      name === 'index' ? 'index.js' : '[name]/index.js',
    clean: true,
  },
  module: {
    rules: [
      { test: /\.html$/, use: 'html-loader' },
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.webp$/,
        type: 'asset',
        generator: {
          filename: (pathData) => pathData.filename.replace(/src\//, ''),
        },
      },
      {
        test: /\.(otf|woff|woff2)$/,
        type: 'asset',
        generator: {
          filename: (pathData) => pathData.filename.replace(/src\//, ''),
        },
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      API_URL: process.env.API_URL,
      IMAGE_URL: process.env.IMAGE_URL,
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      chunks: ['index'],
      template: 'src/index.html',
    }),
    ...HtmlWebpackPlugins,
    new MiniCssExtractPlugin({
      filename: ({ chunk: { name } }) =>
        name === 'index' ? 'style.css' : `pages/${name}/style.css`,
    }),
    new webpack.SourceMapDevToolPlugin({}),
  ],
  resolve: {
    alias: {
      '@api': path.resolve(__dirname, 'src/api/index'),
      '@components': path.resolve(__dirname, 'src/components/'),
      '@constants': path.resolve(__dirname, 'src/constants'),
      '@fonts': path.resolve(__dirname, 'src/assets/fonts/'),
      '@images': path.resolve(__dirname, 'src/assets/images/'),
      '@pages': path.resolve(__dirname, 'src/pages/'),
      '@styles': path.resolve(__dirname, 'src/styles/'),
      '@utils': path.resolve(__dirname, 'src/utils/'),
    },
  },
  devServer: {
    static: {
      directory: dist,
    },
    port: 8080,
  },
  devtool: false,
};
