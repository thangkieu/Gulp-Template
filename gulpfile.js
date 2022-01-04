const gulp = require("gulp");
const uglify = require("gulp-uglify");
const less = require("gulp-less");
const cleanCSS = require("gulp-clean-css");
const sourcemaps = require("gulp-sourcemaps");
const LessAutoprefix = require("less-plugin-autoprefix");
const browserSync = require("browser-sync").create();
const htmlmin = require("gulp-htmlmin");
const inject = require("gulp-inject");
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const handlebars = require("gulp-compile-handlebars");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");

const autoprefix = new LessAutoprefix({ browsers: ["last 2 versions"] });

/**
 * Handlebarsjs helpers
 */
function odd(number, options) {
  if (number % 2 === 0) {
    return options.fn(this);
  }

  return options.inverse(this);
}

function firstCharacter(str) {
  return str.charAt(0);
}

const FILES_TO_COPY = ["favicon.ico", "manifest.json"];

function copyfiles() {
  return gulp.src(FILES_TO_COPY).pipe(gulp.dest("build"));
}

function assets() {
  return gulp
    .src("src/assets/**/*")
    .pipe(imagemin())
    .pipe(gulp.dest("build/assets"));
}

function injectFiles() {
  return gulp
    .src("build/*.html")
    .pipe(
      inject(gulp.src(["build/css/*.css", "build/js/*.js"], { read: false }), {
        relative: true,
      })
    )
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        minifyJS: true,
        minifyCSS: true,
        removeComments: true,
        useShortDoctype: true,
      })
    )
    .pipe(gulp.dest("build"));
}

function css() {
  return gulp
    .src(["src/css/**/*.less", "!src/css/**/_*.less"]) //'src/css/**/^[^_]\w+.less')
    .pipe(sourcemaps.init())
    .pipe(less({ plugins: [autoprefix] }))
    .pipe(cleanCSS({ compatibility: "last 2 versions" }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("build/css"))
    .pipe(browserSync.stream({ match: "**/*.css" }));
}

function js() {
  return browserify({
    entries: "src/js/index.js",
    debug: true,
  })
    .bundle()
    .pipe(source("index.js"))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .on("error", console.error)
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("build/js"))
    .pipe(browserSync.stream({ match: "**/*.js" }));
}

function templates() {
  const data = require("./src/data/data.json");

  const options = {
    ignorePartials: true,
    batch: ["src/partials"],
    partials: { firstCharacter },
    helpers: { odd },
  };

  return gulp
    .src("src/templates/**/*.hbs")
    .pipe(handlebars(data, options))
    .pipe(rename({ extname: ".html" }))
    .pipe(gulp.dest("build"));
}

// BrowserSync Reload
function browserSyncReload() {
  browserSync.reload();
}

function serve() {
  browserSync.init({
    server: "./build",
  });
}

function watch() {
  gulp.watch("src/css/**/*.less", css);
  gulp.watch("src/js/**/*.js", js);
  gulp.watch("src/assets/**/*.*", assets);

  gulp
    .watch(
      ["src/templates/**/*.hbs", "src/partials/**/*.hbs"],
      gulp.series(templates, injectFiles)
    )
    .on("change", browserSyncReload);
}

exports.default = gulp.series(
  copyfiles,
  assets,
  templates,
  css,
  js,
  injectFiles
);

exports.watch = gulp.series(
  copyfiles,
  assets,
  templates,
  css,
  js,
  injectFiles,
  gulp.parallel(serve, watch)
);
