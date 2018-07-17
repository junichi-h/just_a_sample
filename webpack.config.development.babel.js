import baseConfig from './webpack.config.base';
import webpack from 'webpack';
import merge from 'webpack-merge';

export default merge.smart(baseConfig, {
  entry: {
    index: [
      '@babel/polyfill',
      './app/scripts/index.js'
    ]
  },
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env' : {
        'NODE_ENV' : JSON.stringify(process.env.NODE_ENV || 'local')
      }
    }),
    new webpack.LoaderOptionsPlugin({ debug: true }),
    new webpack.NoEmitOnErrorsPlugin()
  ]
});
