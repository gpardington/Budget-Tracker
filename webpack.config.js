const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');

const config = {
  entry: {
    main: [
        path.join(_dirname + '/public/db.js'),
        path.join(_dirname + '/public/index.js')
    ]
  },
  output: {
    path: path.join(__dirname + '/public/dist'),
    filename: 'bundle.js'
  },
  mode: 'development',
  module: {
    rules: [
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
    ],
  },
  plugins: [
    new WebpackPwaManifest({
        //Name of the generated manifest file
        filename: 'mainfest.webmanifest',
        //Inject is set to false because we are note using webpack to generate our HTML
        inject: false,
        //Set fingerprints to false to make the names of the generated files predicatable so that it's easier to refer to them in your code
        fingerprints: false,
        name: 'Budget Tracker',
        short_name: 'Budget Tracker',
        description: 'A budget tracker application that allows the user to add expenses and deposits to their budget with or without an internet connection.',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
            {
              src: path.resolve('./public/icons/icon-512x512.png'),
              sizes: [96, 128, 192, 256, 384, 512],
            },
          ],
        }),
      ],
    };

//Exports the module config
module.exports = config;