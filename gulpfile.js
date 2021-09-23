const gulp = require('gulp');
const uglify = require('gulp-uglify');
const less = require('gulp-less');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const LessAutoprefix = require('less-plugin-autoprefix');
const browserSync = require('browser-sync').create();
const htmlmin = require('gulp-htmlmin');
const inject = require('gulp-inject');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

const autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });

function html() {
  return gulp.src('src/*.html').pipe(gulp.dest('build'));
}

function injectFiles() {
  return gulp
    .src('build/*.html')
    .pipe(
      inject(gulp.src(['build/css/*.css', 'build/js/*.js'], { read: false }), {
        relative: true,
      })
    )
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        minifyJS: true,
        minifyCSS: true,
        removeComments: true,
        removeEmptyElements: true,
        useShortDoctype: true,
      })
    )
    .pipe(gulp.dest('build'));
}

function css() {
  return gulp
    .src('src/css/**/*.less')
    .pipe(sourcemaps.init())
    .pipe(less({ plugins: [autoprefix] }))
    .pipe(cleanCSS({ compatibility: 'last 2 versions' }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.stream({ match: '**/*.css' }));
}

function js() {
  return browserify({
    entries: 'src/js/index.js',
    debug: true,
  })
    .bundle()
    .pipe(source('index.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .on('error', console.error)
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/js'))
    .pipe(browserSync.stream({ match: '**/*.js' }));
}

function serve() {
  browserSync.init({
    server: './build',
  });

  gulp
    .watch('src/*.html', gulp.series(html, injectFiles))
    .on('change', browserSync.reload);
  gulp.watch('src/css/**/*.less', css);
  gulp.watch('src/js/**/*.js', js);
}

exports.default = gulp.series(html, css, js, injectFiles, serve);
