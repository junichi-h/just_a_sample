import path from 'path';
import webpack from 'webpack';

export default {
  mode: 'development',
  cache: true,
  target: 'web',
  output: {
    path: path.join(__dirname, '.tmp', 'assets', 'js'),
    publicPath: '/assets/js/',
    filename: '[name].bundle.js',
    chunkFilename: '[chunkhash].js',
    sourceMapFilename: '[name].map'
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /(node_modules|bower_components)/,
        include: __dirname,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: [
                [
                  '@babel/preset-env',
                  {
                    modules: false,
                    useBuiltIns: false,
                    debug: false,
                    targets: {
                      browsers: ['> 1%', 'IE 11']
                    }
                  }
                ],
                ['@babel/preset-stage-2', { decoratorsLegacy: true }]
              ]
            }
          }
        ]
      }
    ]
  },
  resolve: {
    descriptionFiles: ['package.json'],
    enforceExtension: false,
    modules: ['src', 'src/js', 'web_modules', 'node_modules']
  },
  externals: {
  }
};
