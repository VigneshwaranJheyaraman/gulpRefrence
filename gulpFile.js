//dependencies
var gulp = require("gulp");
var babel = require("gulp-babel");
var minifyCss = require("gulp-minify-css");
var uglify = require("gulp-uglify");
var htmlMin = require("gulp-htmlmin");
var browserSync = require("browser-sync").create();
var concat = require("gulp-concat");
var replace = require("gulp-replace");
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

//file related variables
var fileNames = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
let randValue="";
for(var i=0;i<7;i++)
{
  randValue += fileNames[Math.floor(Math.random() * fileNames.length)];
}


//tasks
gulp.task("js" , function() 
{
 return gulp.src(jsFiles)
  .pipe(babel())
  .pipe(uglify())
  .pipe(concat(randValue+".min.js",{newLine:";"}))
  .pipe(gulp.dest(dest+"static/js/")) 
});


gulp.task("style", function() {
  return gulp.src(src+"styles/*.css")
  .pipe(minifyCss({keepSpecialComments : 1}))
  .pipe(concat(randValue+".min.css",{newLine:";"}))
  .pipe(gulp.dest(dest+"static/css/"))
})

gulp.task("pages", function(){
  var scriptSrc = `<script src='static/js/bundle.js'></script></body>`;
  var cssSrc = `<link rel='stylesheet' href='static/css/${randValue}.min.css' /><title>`;
  return gulp.src(public+"*.html")
  .pipe(htmlMin({collapseWhitespace:true}))
  .pipe(replace("%PUBLIC_URL%/", ""))
  .pipe(replace("<title>", cssSrc))
  .pipe(replace("</body>", scriptSrc))
  .pipe(gulp.dest(dest));
});

gulp.task("assets", function(){
  return gulp.src([public+"*.json", public+"*.ico"])
  .pipe(gulp.dest(dest));
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

gulp.task("default", gulp.series(gulp.parallel("bundle", "style", "pages", "serve")), function(){
  return browserSync.reload({
    stream: true
  });
})


