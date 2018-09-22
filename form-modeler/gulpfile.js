// Generated on 2017-05-11 using generator-angular 0.16.0
'use strict';

var gulp = require('gulp');
// 可以调用其它的包
var $ = require('gulp-load-plugins')();
// 运行时用来打开浏览器
var openURL = require('open');
// Lazypipe允许您创建一个不可变的，延迟初始化的管道
// 在任何时候，都可以通过添加到现有的lazypipe来构建新的lazypipe，而不会影响以前的lazypipe。
var lazypipe = require('lazypipe');
// 以包的形式包装rm -rf命令，用来删除文件和文件夹的，不管文件夹是否为空，都可删除
var rimraf = require('rimraf');
// 自动注入 bower.json 里面生成的包
var wiredep = require('wiredep').stream;
// -----
var runSequence = require('run-sequence');
// 配置4个根路径
var yeoman = {
  app: require('./bower.json').appPath || 'app',
  dist: 'dist',
  tmp:'.tmp',
  module : 'builder'
};
// 配置路径  先把里面的src给定义好。
var paths = {
  scripts: [yeoman.app + '/scripts/**/*.js'],
  styles: [yeoman.app + '/styles/**/*.scss'],
  fonts: [
    yeoman.app + '/fonts/**/*',
    yeoman.app +'/bower_components/font-awesome/fonts/*',
    yeoman.app +'/bower_components/bootstrap/fonts/*'
  ],
  test: ['test/spec/**/*.js'],
  testRequire: [
    yeoman.app + '/bower_components/angular/angular.js',
    yeoman.app + '/bower_components/angular-mocks/angular-mocks.js',
    yeoman.app + '/bower_components/angular-resource/angular-resource.js',
    yeoman.app + '/bower_components/angular-cookies/angular-cookies.js',
    yeoman.app + '/bower_components/angular-sanitize/angular-sanitize.js',
    yeoman.app + '/bower_components/angular-route/angular-route.js',
    'test/mock/**/*.js',
    'test/spec/**/*.js'
  ],
  karma: 'karma.conf.js',
  views: {
    main: yeoman.app + '/index.html',
    files: [yeoman.app + '/views/**/*.html']
  }
};

////////////////////////
// Reusable pipelines //
////////////////////////

// ----------用于代码检测 
// JSHint是一个社区驱动的工具，可以检测JavaScript代码中的错误和潜在问题。
var lintScripts = lazypipe()
  .pipe($.jshint, '.jshintrc')
  .pipe($.jshint.reporter, 'jshint-stylish');

// 编译sass,自动加浏览器前缀，还有压缩到的地址-这个是个方法
var styles = lazypipe()
  .pipe($.sass, {
    outputStyle: 'expanded',
    precision: 10
  })
  .pipe($.autoprefixer, 'last 1 version')
  .pipe(gulp.dest, yeoman.tmp+'/styles');

///////////
// Tasks //
///////////

// 压缩css
gulp.task('styles', function () {
  return gulp.src(paths.styles)
    .pipe(styles());
});
// ---------- 好像时检查 js代码。（暂时不太确定）
gulp.task('lint:scripts', function () {
  return gulp.src(paths.scripts)
    .pipe(lintScripts());
});
// ----------  不知道是清楚还是删除掉 .tep里面指定的路径 tem是干嘛的？？(临时文件？)
gulp.task('clean:tmp', function (cb) {
  rimraf('./'+yeoman.tmp, cb);
});
//  这个时打开浏览器， 和一起执行  start:server,styles 这两个方法
gulp.task('start:client', ['start:server', 'styles'], function () {
  openURL('http://localhost:9002');
});
//  开9002的端口，不知道为哈有2个root middleware（中间件的意思）
gulp.task('start:server', function() {
  $.connect.server({
    root: [yeoman.app, yeoman.tmp],
    livereload: {
    	enable:true,
    	port:35727
  	},
    // Change this to '0.0.0.0' to access the server from outside.
    port: 9002,
    middleware: function (connect) {
      return [connect().use('/bower_components',connect.static('./bower_components'))];
    }
  });
});
// ---------- 还有。。。这里为啥又编程了3个根路径
gulp.task('start:server:test', function() {
  $.connect.server({
    root: ['test', yeoman.app, yeoman.tmp],
    livereload: true,
    port: 9001,
    middleware: function (connect) {
      return [connect().use('/bower_components',connect.static('./bower_components'))];
    }
  });
});
// 监听 plumber错误管理，别让它中断，还有热更新
gulp.task('watch', function () {
	
  $.watch(paths.styles)
    .pipe($.plumber())
    .pipe(styles())
    .pipe($.connect.reload());

  $.watch(paths.views.files)
    .pipe($.plumber())
    .pipe($.connect.reload());

  $.watch(paths.scripts)
    .pipe($.plumber())
    .pipe(lintScripts())
    .pipe($.connect.reload());

  $.watch(paths.test)
    .pipe($.plumber())
    .pipe(lintScripts());
  
  gulp.watch('bower.json', ['bower']);
});
//  这个就是把整个项目给运行起来的
gulp.task('serve', function (cb) {
  runSequence('clean:tmp',
   'bower',
    ['lint:scripts'],
    ['start:client'],
    'watch', cb);
});
//  ---------- 这又是什么鬼。。。  不清楚
gulp.task('serve:prod', function() {
  $.connect.server({
    root: [yeoman.dist],
    livereload: true,
    port: 9002
  });
});
// ----------  像这些有分号的意思，都有些不太理解
gulp.task('test', ['start:server:test'], function () {
  var testToFiles = paths.testRequire.concat(paths.scripts, paths.test);
  return gulp.src(testToFiles)
    .pipe($.karma({
      configFile: paths.karma,
      action: 'watch'
    }));
});

// inject bower components  //自动注入css和js
gulp.task('bower', function () {
  return gulp.src(paths.views.main)
    .pipe(wiredep({
      directory: yeoman.app + '/bower_components',
      ignorePath: '..'
    }))
  .pipe(gulp.dest(yeoman.app));
});


gulp.task('views', function () {
  return gulp.src(paths.views.files)
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.angularTemplatecache('angular-template-html.js', {
      module: yeoman.module,
      root: 'views'
    }))
    .pipe(gulp.dest(yeoman.tmp+'/scripts'));
  
});

///////////
// Build //
///////////
// 构建的？？    构建有事
gulp.task('clean:dist', function (cb) {
  rimraf('./dist', cb);
});

gulp.task('client:build', ['views', 'styles'], function () {
	var sourcesIndex = gulp.src([yeoman.tmp+'/scripts/angular-template-html.js'], {read: false});

  var htmlFilter = $.filter('*.html');
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');

  return gulp.src(paths.views.main)
  	.pipe($.inject(sourcesIndex, {starttag: '<!-- inject:partials -->',ignorePath: yeoman.tmp,addRootSlash: false}))
    .pipe($.useref({searchPath: [yeoman.app, yeoman.tmp]}))
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    .pipe($.uglify())
    .pipe($.rev())
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.minifyCss({cache: true}))
    .pipe($.rev())
    .pipe(cssFilter.restore())
    .pipe($.revReplace())
    .pipe(htmlFilter)
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true,
      conditionals: true
    }))
    .pipe(htmlFilter.restore())
    .pipe(gulp.dest(yeoman.dist));
});


gulp.task('images', function () {
  return gulp.src(yeoman.app + '/images/**/*')
    .pipe($.cache($.imagemin({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })))
    .pipe(gulp.dest(yeoman.dist + '/images'));
});

gulp.task('copy:extras', function () {
  return gulp.src(yeoman.app + '/**.*', { dot: true })
    .pipe(gulp.dest(yeoman.dist));
});

gulp.task('copy:fonts', function () {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest(yeoman.dist + '/fonts'));
});

gulp.task('build', ['clean:dist'], function () {
  runSequence(['bower','images', 'copy:extras', 'copy:fonts', 'client:build']);
});

gulp.task('default', ['build']);
