const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const rootDir = path.resolve(__dirname, '..');

// Define environment variables
const envVars = {
  'process.env.REACT_APP_HOLIDAY_API_BASE_URL': JSON.stringify(process.env.REACT_APP_HOLIDAY_API_BASE_URL || 'https://date.nager.at/api/v3'),
  'process.env.REACT_APP_HOLIDAY_API_KEY': JSON.stringify(process.env.REACT_APP_HOLIDAY_API_KEY || ''),
  'process.env.REACT_APP_GITHUB_TOKEN': JSON.stringify(process.env.REACT_APP_GITHUB_TOKEN || ''),
  'process.env.REACT_APP_ENABLE_HOLIDAY_CACHING': JSON.stringify(process.env.REACT_APP_ENABLE_HOLIDAY_CACHING || 'true'),
  'process.env.REACT_APP_MAX_YEAR_RANGE': JSON.stringify(process.env.REACT_APP_MAX_YEAR_RANGE || '5'),
  'process.env.REACT_APP_DEFAULT_COUNTRY': JSON.stringify(process.env.REACT_APP_DEFAULT_COUNTRY || 'United States'),
  'process.env.REACT_APP_DEFAULT_WORKING_DAYS_PER_MONTH': JSON.stringify(process.env.REACT_APP_DEFAULT_WORKING_DAYS_PER_MONTH || '21')
};

module.exports = {
  entry: path.resolve(rootDir, 'src/index.js'),
  output: {
    path: path.resolve(rootDir, 'dist'),
    filename: 'bundle.js',
    clean: true,
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(rootDir, 'public/index.html'),
      filename: 'index.html'
    }),
    new webpack.DefinePlugin(envVars)
  ],
  devServer: {
    static: {
      directory: path.resolve(rootDir, 'public')
    },
    historyApiFallback: true,
    hot: true,
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    },
    client: {
      webSocketURL: 'auto://0.0.0.0:0/ws'
    }
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [path.resolve(rootDir, 'node_modules')]
  },
  mode: 'development'
};
