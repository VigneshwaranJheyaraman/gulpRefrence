//dependencies
var gulp = require("gulp");
var babel = require("gulp-babel");
var minifyCss = require("gulp-minify-css");
var uglify = require("gulp-uglify");
var htmlMin = require("gulp-htmlmin");
var browserSync = require("browser-sync").create();
var concat = require("gulp-concat");
var replace = require("gulp-replace");
var del = require("del");
//bundle
var browserify = require("browserify");
var babelify = require("babelify");
var source = require("vinyl-source-stream");

//path
var src="src/";
var components = "src/components/";
var dest = "dist/";
var public = "public/";
var jsFiles = [src+"index.js", src+"App.js",components+"OverrideEvents.js", components+"WebSocket.js"];



//tasks
gulp.task("js" , function() 
{
 return gulp.src(jsFiles)
  .pipe(babel())
  .pipe(uglify())
  .pipe(concat("minified.min.js",{newLine:";"}))
  .pipe(gulp.dest(dest+"static/js/")) 
});

gulp.task("clean", function(){
  return del([dest+"static/assets"+"index.html"])
})

gulp.task("style", function() {
  del([dest+"static/css"])
  return gulp.src(src+"styles/*.css")
  .pipe(minifyCss({keepSpecialComments : 1}))
  .pipe(concat("bundleCSS.min.css",{newLine:";"}))
  .pipe(gulp.dest(dest+"static/css/"))
})

gulp.task("pages", function(){
  var scriptSrc = `<script src='static/js/bundle.js'></script></body>`;
  var cssSrc = "<link rel='stylesheet' href='static/css/bundleCSS.min.css' /><title>";
  return gulp.src(public+"*.html")
  .pipe(htmlMin({collapseWhitespace:true}))
  .pipe(replace("%PUBLIC_URL%/", ""))
  .pipe(replace("favicon.ico", "static/assets/favicon.ico"))
  .pipe(replace("manifest.json", "static/assets/manifest.json"))
  .pipe(replace("<title>", cssSrc))
  .pipe(replace("</body>", scriptSrc))
  .pipe(gulp.dest(dest));
});

gulp.task("assets", function(){
  return gulp.src([public+"*", public+"**/*"])
  .pipe(gulp.dest(dest+"static/assets"));
});

gulp.task("serve", function()
{
  return browserSync.init({
    server: {
      baseDir:dest
    }
  });
})

gulp.task("bundle", function(){
  return browserify(
  {
    extensions : ['.jsx','.js'],
    entries : [jsFiles]
  })
  .transform( babelify.configure({
    ignore : [/(bower_components)|(node_modules)/]
  }) )
  .bundle()
  .on("error" , (err) => {
    console.log("Error" + err);
  })
  .pipe(source('bundle.js'))
  .pipe(gulp.dest(dest+"static/js"))
});

gulp.task("default", gulp.series(gulp.parallel("bundle", "style", "pages", "assets", "clean", "serve")), function(){
  return browserSync.reload({
    stream: true
  });
})


