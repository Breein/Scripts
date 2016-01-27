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
var fs = require('fs');

var userScriptHeader =
  `// ==UserScript==
// @name        Test
// @description Test
// @author      гном убийца
// @version     1.0
// @include     http://www.ganjawars.ru/iski.php
// ==/UserScript==

(function(){`;
var userScriptFooter = `})();`;

gulp.task('wrap', function(){
  return gulp.src('./out/bundle.js')
    .pipe(concat.header(userScriptHeader))
    .pipe(concat.footer(userScriptFooter))
    .pipe(rename('Test.user.js'))
    .pipe(gulp.dest('C:/Users/Breein/AppData/Roaming/Mozilla/Firefox/Profiles/breein.default/gm_scripts/Test/'));
});

gulp.task('bundle', function(){
  var textFile;

  textFile = fs.readFileSync('./src/index.js', 'utf8');
  textFile = textFile.replace(/'@include: (.+)'/g, include);
  fs.writeFileSync('./tmp_src/index.js', textFile);

  function include(str){
    str = str.match(/'@include: (.+)'/);
    return '`' + fs.readFileSync(str[1], 'utf8') + '`';
  }

  return browserify('./tmp_src/index.js')
    .transform(babelify.configure({ stage: 0}))
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./out'));

  //.transform(hbsfy.configure({knownHelpersOnly: true}))
});

gulp.task('uglify', function(){
  return gulp.src('./out/bundle.js')
    .pipe(uglify())
    .pipe(gulp.dest('./out/'));
});

gulp.task('build', function(){
  runSequence('bundle', 'wrap');
});

gulp.task('release', function(){
  runSequence('bundle', 'uglify', 'wrap');
});

var watchFiles = [
  'W:/Scripts/us/lib/*.js',
  './html/**/*.*',
  './src/**/*.js'
];

gulp.task('dev', function(){
  chokidar.watch(watchFiles, {ignored: /[\/\\]\./}).on('all', (event, path) =>{
    console.log(event, path);
    gulp.start('build');
  });
});

gulp.task('default', ['dev']);
