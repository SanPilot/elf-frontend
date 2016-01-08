// Include Gulp
var gulp = require('gulp');

// RealFaviconGenerator
var realFavicon = require('gulp-real-favicon');
var fs = require('fs');

// Include Plugins
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var htmlmin = require('gulp-htmlmin');
var del = require('del');
var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var minifyInline = require('gulp-minify-inline');
var sourcemaps = require('gulp-sourcemaps');

// Bases
var bases = {
  src: "src/",
  dist: "dist/"
};

// Paths
var paths = {
  scripts: [bases.src + 'scripts/**/*'],
  libs: [bases.src + 'components/**/*'],
  styles: [bases.src + 'assets/stylesheets/**/*'],
  html: [
    [bases.src + 'pages/sign-in/*', bases.dist + 'pages/sign-in/'],
    [bases.src + 'pages/dashboard/*', bases.dist + 'pages/dashboard/']
  ],
  images: [bases.src + 'assets/images/**/*'],
  extras: [bases.src + 'robots.txt'],
};

// File where the favicon markups are stored
var FAVICON_DATA_FILE = 'faviconData.json';

// Function to intelligently process HTML files and put them in their place
var htmlProcess = function(files) {
  for (var i = 0; i < files.length; i++) {
    gulp.src(files[i][0])
    .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
    .pipe(minifyInline())
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(files[i][1]));
  }
};

// Delete the dist directory
gulp.task('clean', function() {
  return del(bases.dist + '**/*');
});

// Process styles
gulp.task('styles', ['clean'], function() {
  return gulp.src(paths.styles)
  .pipe(csso())
  .pipe(sourcemaps.init())
  .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(bases.dist + "assets/stylesheets/"));
});

// Process scripts and concatenate them into one output file
gulp.task('scripts', ['clean'], function() {
  gulp.src(paths.scripts)
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
  .pipe(uglify())
  .pipe(sourcemaps.init())
  .pipe(concat('app.min.js'))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(bases.dist + 'scripts/'));
});

// Imagemin images and ouput them in dist
gulp.task('imagemin', ['clean', 'generate-favicon'], function() {
  gulp.src(paths.images)
  .pipe(imagemin())
  .pipe(gulp.dest(bases.dist + "assets/images/"));
  gulp.src(['dist/*.png', 'dist/*.ico', 'dist/*.svg'])
  .pipe(imagemin())
  .pipe(gulp.dest(bases.dist))
});

// Copy all other files to dist directly
gulp.task('copy', ['clean'], function() {
  // Copy lib scripts, maintaining the original directory structure
  gulp.src(paths.libs)
  .pipe(gulp.dest(bases.dist + 'components/'));

  // Copy extra files
  gulp.src(paths.extras)
  .pipe(gulp.dest(bases.dist));
});


// RealFaviconGenerator

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
gulp.task('generate-favicon', ['clean'], function(done) {
  realFavicon.generateFavicon({
    masterPicture: 'meta/icons/elf-logo.icon.png',
    dest: 'dist',
    iconsPath: '/',
    design: {
      ios: {
        pictureAspect: 'backgroundAndMargin',
        backgroundColor: '#ffffff',
        margin: '14%'
      },
      desktopBrowser: {},
      windows: {
        pictureAspect: 'noChange',
        backgroundColor: '#f44336',
        onConflict: 'override'
      },
      androidChrome: {
        pictureAspect: 'noChange',
        themeColor: '#3f51b5',
        manifest: {
          name: 'Elf',
          display: 'browser',
          orientation: 'notSet',
          onConflict: 'override'
        }
      },
      safariPinnedTab: {
        masterPicture: {
          type: 'inline',
          content: 'meta/icons/elf-logo.safari.icon.svg'
        },
        pictureAspect: 'silhouette',
        themeColor: '#008900'
      }
    },
    settings: {
      compression: 5,
      scalingAlgorithm: 'Lanczos',
      errorOnImageTooSmall: false
    },
    markupFile: FAVICON_DATA_FILE
  }, function() {
    done();
  })
});

// Inject the favicon markups in your HTML pages. You should run
// this task whenever you modify a page. You can keep this task
// as is or refactor your existing HTML pipeline.
gulp.task('inject-favicon-markups', ['clean'], function() {
  htmlProcess(paths.html);
});

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
gulp.task('check-for-favicon-update', function(done) {
  var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
  realFavicon.checkForUpdates(currentVersion, function(err) {
    if (err) {
      throw err;
    }
  });
});

// Define the default task as a sequence of the above tasks
gulp.task('default', ['clean', 'scripts', 'styles', 'imagemin', 'copy', 'generate-favicon', 'inject-favicon-markups']);
