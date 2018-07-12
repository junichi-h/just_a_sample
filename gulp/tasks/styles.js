import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import gulpSass from 'gulp-sass';
import styleLint from 'gulp-sass-lint';
import doiuse from 'doiuse';

import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import sprites, { updateRule } from 'postcss-sprites';
import mqpacker from 'css-mqpacker';
import csswring from 'csswring';

import path from 'path';
import browserSync from 'browser-sync';

const $ = gulpLoadPlugins();
const reload = browserSync.stream;


const browsers = [
  'ie >= 11',
  'ff >= 48',
  'chrome >= 54',
  'safari >= 9',
  'ios >= 8',
  'android >= 4.4',
  'ChromeAndroid >= 52'
];


const processors = [
  autoprefixer({ browsers }),
  sprites({
    stylesheetPath: 'app/assets/styles/', //出力するcssのパス
    spritePath: 'app/assets/images',   //スプライト画像を出力する先のパス
    basePath: 'app/',  // urlのベースパス
    relativeTo: 'app',
    retina: true,
    // img/spritesのみスプライトの対象とする
    filterBy(image){
      if(/images\/sprites/.test(image.url)){
        return Promise.resolve();
      }
      return Promise.reject();
    },
    groupBy: function(image) {
      if (image.url.indexOf('@2x') === -1) {
        return Promise.resolve('@1x');
      }
      return Promise.resolve('@2x');
    },
    spritesmith: {
      padding: 10
    },
    hooks: {
      // 出力されるスプライト画像ファイル名を変更する sprite@2xだと同じファイルが量産されるので
      onSaveSpritesheet: function(opts, data) {
        if(data.groups[0] === '@1x'){
          // 通常サイズのスプライト
          return path.join(opts.spritePath, '_sprites.png');
        }else{
          // retinaサイズのスプライト
          return path.join(opts.spritePath, '_sprites@2x.png');
        }
      }
    }
  }),
  mqpacker({ sort: true })
];

const targetSass = ['app/styles/**/*.sass'];

gulp.task('stylelint', () => {
  return gulp.src(targetSass[0])
      .pipe($.plumber())
      .pipe(styleLint({
        configFile: '.sass-lint.yml'
      }))
      .pipe(styleLint.format())
      .pipe(styleLint.failOnError());
});

gulp.task('styles', ['stylelint'], () => {
  return gulp.src(targetSass)
      .pipe($.plumber())
      .pipe($.sourcemaps.init())
      .pipe(gulpSass({
        outputStyle: 'expand'
      }))
      .pipe(postcss(processors))
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest('.tmp/assets/styles'))
      .pipe(reload({match: "**/*.sass"}));
});


gulp.task('styles:prod', ['stylelint'], () => {
  processors.push(csswring({
    removeAllComments: true
  }));
  return gulp.src(targetSass)
      .pipe($.plumber())
      .pipe(gulpSass({
        outputStyle: 'expand'
      }))
      .pipe(postcss(processors))
      .pipe(gulp.dest('docs/assets/styles'));
});
