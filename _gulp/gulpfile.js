var gulp     = require("gulp"),
    plumber  = require("gulp-plumber"),  //監視をストップしない
    uglify   = require("gulp-uglify"),   //jsのminify化
    csscomb  = require('gulp-csscomb'),  //.csscomb.jsonでファイルの整形方法を指定
    pleeease = require("gulp-pleeease"), //CSSを最適化
    gcmq     = require('gulp-group-css-media-queries'), //mediaqueryをまとめる
    ejs      = require("gulp-ejs"),
    rename   = require("gulp-rename"),  //.ejsの拡張子を.htmlへリネーム
    sass     = require("gulp-sass"),
    sassGlob = require('gulp-sass-glob'); //@importをまとめる
    browser  = require("browser-sync"),
    imagemin = require("gulp-imagemin"); //画像の圧縮

var DEV      = "../app/dev/",
    PUBLIC   = "../docs/",
    ASSETS   = "assets/";

//ejs
gulp.task("ejs", function() {
  gulp.src([DEV + "ejs/**/*.ejs",'!' + DEV + "ejs/**/_*.ejs"])
  .pipe(plumber())
  .pipe(ejs())
  .pipe(rename({extname: ".html"}))
  .pipe(gulp.dest(PUBLIC))
  .pipe(browser.reload({stream:true}));
});

//html
gulp.task("html", function() {
  gulp.src([DEV + "ejs/**/*.html",'!' + DEV + "ejs/**/_*.html"])
  .pipe(plumber())
  .pipe(ejs())
  .pipe(gulp.dest(PUBLIC))
  .pipe(browser.reload({stream:true}));
});

//sass
gulp.task("sass", function() {
  gulp.src(DEV + ASSETS + "sass/**/*.scss")
  .pipe(plumber())
  .pipe(sassGlob())
  .pipe(sass())
  .pipe(csscomb())
  .pipe(pleeease({
    fallbacks: {
      autoprefixer: ["last 2 version", "ie 9"]
    },
    //minifier: false,
    rem: {rootValue: '10px'}, //remの基準を10pxに変更
  }))
  //.pipe(gcmq())
  .pipe(gulp.dest(PUBLIC + ASSETS + "css"))
  .pipe(browser.reload({stream:true}));
});

//js
gulp.task("js", function() {
  return gulp.src(DEV + ASSETS + "js/**/*.js")
  .pipe(uglify())
  .pipe(plumber())
  .pipe(gulp.dest(PUBLIC + ASSETS + "js"))
  .pipe(browser.reload({stream:true}));
});

//json
gulp.task("json", function() {
  return gulp.src(DEV + ASSETS + "json/**/*.json")
  //.pipe(uglify())
  .pipe(plumber())
  .pipe(gulp.dest(PUBLIC + ASSETS + "json"))
  .pipe(browser.reload({stream:true}));
});

//lib js
gulp.task("lib_js", function() {
  return gulp.src(DEV + ASSETS + "lib/js/**/*.js")
  .pipe(plumber())
  .pipe(uglify())
  //.pipe(gulp.dest(PUBLIC + ASSETS + "lib/js/min"))
  .pipe(gulp.dest(PUBLIC + ASSETS + "lib/js"))
  .pipe(browser.reload({stream:true}));
});

//lib css
gulp.task("lib_css", function() {
  return gulp.src(DEV + ASSETS + "lib/**/*.css")
	.pipe(plumber())
	.pipe(csscomb())
  .pipe(gulp.dest(PUBLIC + ASSETS + "lib"))
  .pipe(browser.reload({stream:true}));
});

//images
gulp.task("images", function() {
  return gulp.src(DEV + ASSETS + "images/**/*")
  .pipe(plumber())
  .pipe(imagemin())
  .pipe(gulp.dest(PUBLIC + ASSETS + "images"));
});

//browser sync
gulp.task("server", function() {
  browser({
    server: {
      baseDir: PUBLIC,
    },
    port: 5000
  });
});

//watch
gulp.task("default",["ejs","html","sass","js","json","lib_js","lib_css","images","server"], function() {
  gulp.watch(DEV + "ejs/**/*.ejs",["ejs"]);
  gulp.watch(DEV + "ejs/**/*.html",["html"]);
  gulp.watch(DEV + ASSETS + "sass/**/*.scss",["sass"]);
  gulp.watch(DEV + ASSETS + "js/**/*.js",["js"]);
  gulp.watch(DEV + ASSETS + "json/**/*.json",["json"]);
  gulp.watch(DEV + ASSETS + "lib/**/*.js",["lib_js"]);
  gulp.watch(DEV + ASSETS + "lib/**/*.css",["lib_css"]);
  gulp.watch(DEV + ASSETS + "images/**/*",["images"]);
});