var concat = require('gulp-concat-util');
var browserify = require('browserify');
var rename = require('gulp-rename');
var babelify = require('babelify');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var hbsfy = require('hbsfy');
var gulp = require('gulp');
var runSequence = require('run-sequence');
var chokidar = require('chokidar');

var userScriptHeader =
  `// ==UserScript==
// @name           Meters [GW]
// @namespace      гном убийца
// @description    Счетчики опыта и умений (26.12.14.1508)
// @version        2.0
// @grant          none
// @include        http://www.ganjawars.ru/me/
// ==/UserScript==
(function(){`;
var userScriptFooter = `})();`;

gulp.task('wrap', function () {
  return gulp.src('./out/bundle.js')
    .pipe(concat.header(userScriptHeader))
    .pipe(concat.footer(userScriptFooter))
    .pipe(rename('Test.user.js'))
    //.pipe(gulp.dest('C:/Users/Breein/AppData/Roaming/Mozilla/Firefox/Profiles/breein.default/gm_scripts/Test'));
  .pipe(gulp.dest('./pathToUserScriptDirectory'));
});

gulp.task('bundle', function () {
  return browserify('./src/index.js')
    .transform(babelify)
    .transform(hbsfy)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./out'));
});

gulp.task('uglify', function () {
  return gulp.src('./out/bundle.js')
    .pipe(uglify())
    .pipe(gulp.dest('./out/'));
});

gulp.task('build', function () {
  runSequence('bundle', 'wrap');
});

gulp.task('release', function () {
  runSequence('bundle', 'uglify', 'wrap');
});

var watchFiles = [
  './html/**/*.hbs',
  './src/**/*.js'
];

gulp.task('dev', function () {
  chokidar.watch(watchFiles, { ignored: /[\/\\]\./ }).on('all', (event, path) => {
    console.log(event, path);
    gulp.start('build');
  });
});

gulp.task('default', ['dev']);
