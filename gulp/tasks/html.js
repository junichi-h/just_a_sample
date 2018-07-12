import gulp from 'gulp';
import cached from 'gulp-cached';
import changed from 'gulp-changed';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;
const minifyHtmlOpt = {
  conditionals: true, // IE条件コメントを消さない
  loose       : true, // 空白文字を削除しない
  quotes      : true  //クオートを削除しない
};

/**
 * pugタスク
 */
gulp.task('pug', () => {
  reload();
});

gulp.task('pug:web', () => {
  gulp.src([
    'app/**/!(_)*.pug'
  ])
      .pipe($.plumber())
      .pipe(changed('app', {
        extension: '.html'
      }))
      .pipe($.pug({
        pretty: true,
        cache: true
      }))
      .pipe($.debug({title: 'pug:web Compiled:'}))
      .pipe(gulp.dest('.tmp/'))
      .pipe(reload({stream: true}));
});

gulp.task('pug:prod', () => {
  gulp.src('app/**/!(_)*.pug')
      .pipe($.plumber())
      /*.pipe(changed('app', {
        extension: '.html'
      }))*/
      .pipe(cached('pug'))
      .pipe($.pug({
        pretty: true,
        cache: false,
        basedir: 'app/'
      }))
      .pipe($.debug({title: 'pug Compiled:'}))
      .pipe(gulp.dest('dist/'))
});

// ※ gulp js, pugを先に実行しておくこと
gulp.task('html', () => {
  const assets = $.useref({
    searchPath: ['{app, !app/scripts', '.']
  });
  const jsCssAssets = $.useref({
    searchPath: ['.tmp']
  });

  return gulp.src('.tmp/**/*.html')
      .pipe($.debug())
      .pipe(jsCssAssets)
      .pipe($.if('*.css', $.minifyCss({
        processImport: false,
        compatibility: '*'
      })))
      .pipe(assets)
      .pipe($.useref())
      .pipe(gulp.dest('dist/'));
});
