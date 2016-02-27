var concat = require('gulp-concat-util');
var browserify = require('browserify');
var rename = require('gulp-rename');
var babelify = require('babelify');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var gulp = require('gulp');
var runSequence = require('run-sequence');
var chokidar = require('chokidar');
var fs = require('fs');

var userScriptHeader =
  `// ==UserScript==
// @name        Stats forums [GW]
// @namespace   гном убийца
// @description (RAW) Форумная статистика (14.01.16.1916)
// @include     http://www.ganjawars.ru/threads.php?fid=*
// @exclude     http://www.ganjawars.ru/threads.php?fid=*&page_id=*
// @version     1.20
// @grant       none
// ==/UserScript==

(function(){`;
var userScriptFooter = `})();`;

gulp.task('wrap', function(){

  includeHTML();

  return gulp.src('./out/bundle_full.js')
    .pipe(concat.header(userScriptHeader))
    .pipe(concat.footer(userScriptFooter))
    .pipe(rename('Stats_forums_[GW].user.js'))
    .pipe(gulp.dest('C:/Users/Breein/AppData/Roaming/Mozilla/Firefox/Profiles/breein.default/gm_scripts/Stats_forums_[GW]/'));
});

gulp.task('bundle', function(){
  return browserify('./src/index.js')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./out'));

  //.transform(babelify.configure({stage: 0, compact: false}))
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
  'W:/Scripts/us/js/*.js',
  'W:/Scripts/us/html/*.html',
  'W:/Scripts/us/css/*.css',
  './html/**/*.*',
  './src/**/*.js'
];

gulp.task('dev', function(){
  chokidar.watch(watchFiles, {ignored: /[\/\\]\./}).on('all', (event, path) =>{
    //console.log(event, path);
    gulp.start('build');
  });
});

gulp.task('default', ['dev']);


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function includeHTML(){
  var textFile;

  textFile = fs.readFileSync('./out/bundle.js', 'utf8');
  textFile = textFile.replace(/'@include: (.+)'/g, include);
  fs.writeFileSync('./out/bundle_full.js', textFile);

  function include(str){
    var url, key = false;

    str = str.match(/'@include: (.+)'/);
    url = str[1].split(', ');

    if(url){
      key = 'true' == url[1];
      url = url[0];
    }else{
      url = str[1];
    }
    str = fs.readFileSync(url, 'utf8');
    str = str.replace(/'@include: (.+)'/g, include);

    if(key){
      return '`' + str + '`';
    }else{
      return str;
    }
  }
}
