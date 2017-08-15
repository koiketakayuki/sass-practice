const gulp = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cssnext = require('postcss-cssnext');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const browserSync = require('browser-sync');

const path = {
  src: './src/',
  dist: './dist/',
  sourcemap: 'sourcemap',
};

const plumberConfig = {
  errorHandler: notify.onError({
    title:'Sassコンパイルエラー',
    Error: "<%= error.message %>",
  }),
};

/* 開発用scssコンパイル */
gulp.task('scss', function() {
  return gulp.src(path.src + 'main.scss')
    .pipe(plumber(plumberConfig))
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(postcss([cssnext()]))
    .pipe(sourcemaps.write(path.sourcemap))
    .pipe(gulp.dest(path.dist))
});

/* 開発ブラウザ立ち上げ */
gulp.task('browser-sync', () => {
  browserSync({
    server :{ baseDir: path.dist },
  });
});

/* 開発ブラウザリロード */
gulp.task('browser-sync-reload', () => browserSync.reload());

/* 開発用のタスク */
gulp.task('default',['browser-sync'], () => {
  /* 成果物に変化がある場合はブラウザをリロード */
  gulp.watch(path.dist + '**/*.*',['browser-sync-reload']);

  /* scssに変化があるならリコンパイル */
  gulp.watch(path.src + '**/*.scss',['scss']);
});

/* プロダクション用のcssのビルド */
gulp.task('build', function() {
  return gulp.src(path.src + 'main.scss')
    .pipe(plumber(plumberConfig))
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(postcss([cssnext()]))
    .pipe(gulp.dest(path.dist))
});
