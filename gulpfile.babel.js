/**
 * Gulp Build File
 * Version: 2.0.0
 * User: NickHopps
 */

import gulp          from 'gulp';
import plugins       from 'gulp-load-plugins';
import yargs         from 'yargs';
import named         from 'vinyl-named';
import webpackStream from 'webpack-stream';
import webpack       from 'webpack';
const pack = require('./package.json')

const $ = plugins({
  rename: {
    'gulp-rev-append': 'rev',
    'gulp-file-include': 'fileinclude'
  }
});

const PRODUCTION = !!(yargs.argv.production);

const PATHS = {
  scripts: {
    src: './src/dependsOn.js',
    dist: './dist/'
  },
};

const WPCONFIG = {
  mode: PRODUCTION ? 'production' : 'development',
  entry: {
      app: PATHS.scripts.src,
  },
  output: {
    filename: 'dependsOn.js',
  },
//   plugins: [
//     new webpack.ProvidePlugin({
//       '$': 'jquery',
//     }),
//   ],
  module: {
    rules: [{
      test: /.js$/,
      use: [{
        loader: 'babel-loader'
      }]
    }]
  },
//   devtool: '#source-map'
};

/* Task to build files */
gulp.task('build', gulp.series(gulp.parallel(javascript)));

/* Default Task */
gulp.task('default', gulp.series('build'));

function javascript() {
  return gulp.src(PATHS.scripts.src)
    .pipe(named())
    .pipe($.cached('script'))
    .pipe(webpackStream(WPCONFIG, webpack))
    .pipe($.replace('${version}', pack.version))
    .pipe($.if(PRODUCTION, $.rename({suffix: '.min'})))
    .pipe(gulp.dest(PATHS.scripts.dist));
}