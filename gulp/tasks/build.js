import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins();

// 静的ファイルを移動
gulp.task('extras', () => {
  gulp.src([
    'app/*.*',
    '!app/*.pug'
  ], {
    dot: true
  }).pipe(gulp.dest('docs'));

  gulp.src([
    'app/assets/images/**'
  ], {
    dot: false
  }).pipe(gulp.dest('docs/assets/images'));

  gulp.src([
    'app/assets/data/**'
  ], {
    dot: false
  }).pipe(gulp.dest('docs/assets/data'));

  gulp.src([
    'app/assets/videos/**'
  ], {
    dot: false
  }).pipe(gulp.dest('docs/assets/videos'));
});

gulp.task('build', ['html', 'extras'], () => {
  return gulp.src('docs/**/*')
      .pipe($.size({title: 'build', gzip: true}));
});
