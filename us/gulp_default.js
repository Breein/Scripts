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
var babel = require("babel-core");



gulp.task('wrap', function(){
  var userScriptHeader, userScriptFooter, userScriptName, userScriptDir, userScriptVersion, nowDate;

  userScriptDir = '';
  userScriptName = '.user.js';
  userScriptVersion = '1.00';

  nowDate = new Date(new Date().getTime()).toLocaleString();
  userScriptHeader =
    `// ==UserScript==
// @name        Check it all [GW]
// @author      гном убийца
// @description Более удобный выбор однотипных предметов в недвижимости (${nowDate})
// @include     http://www.ganjawars.ru/object.php?id=*
// @version     ${userScriptVersion}
// @grant       none
// ==/UserScript==

(function(){`;
  userScriptFooter = `})();`;

  return gulp.src('./out/bundle_full.js')
    .pipe(concat.header(userScriptHeader))
    .pipe(concat.footer(userScriptFooter))
    .pipe(rename(userScriptName))
    .pipe(gulp.dest(`C:/Users/Breein/AppData/Roaming/Mozilla/Firefox/Profiles/breein.default/gm_scripts/${userScriptDir}/`));
});

gulp.task('repack', function(){
  return new Promise((resolve)=>{
    var textFile;

    textFile = fs.readFileSync('./out/bundle.js', 'utf8');
    textFile = textFile.replace(/'@include: (.+)'/g, include);
    textFile = babel.transform(textFile, {stage: 0, compact: false}).code;
    fs.writeFileSync('./out/bundle_full.js', textFile);
    resolve();

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
  });
});

gulp.task('bundle', function(){
  return browserify('./src/index.js')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./out'));
});

gulp.task('uglify', function(){
  return gulp.src('./out/bundle_full.js')
    .pipe(uglify())
    .pipe(gulp.dest('./out/'));
});

gulp.task('build', function(){
  runSequence('bundle', 'repack', 'wrap');
});

gulp.task('release', function(){
  runSequence('bundle', 'repack', 'uglify', 'wrap');
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