var gulp = require('gulp');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var less = require('gulp-less');
var browserSync = require('browser-sync').create();
var uglify = require('gulp-uglify');
var babel = require('rollup-plugin-babel');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var rollup = require('rollup');
var rollupUglify = require('rollup-plugin-uglify');
var gulpif = require('gulp-if');
var hash = require('rollup-plugin-hash');
var rollupLess = require('rollup-plugin-less');
var rimraf = require('gulp-rimraf');
var rev = require('gulp-rev');
var assetManifest = require('gulp-asset-manifest');
var debug = require('gulp-debug');
var copy = require('gulp-copy');
var cjs = require('rollup-plugin-commonjs');
var globals = require('rollup-plugin-node-globals');
var replace = require('rollup-plugin-replace');
var resolve = require('rollup-plugin-node-resolve');

var isRelease = false;

var DOCSAPP_BUILD_PATH = './docsapp/static/build/'

gulp.task('setIsRelease', function() {
  isRelease = true;
});


gulp.task('docsapp-rollup', [ 'docsapp-clean' ], function(done) {
  rollup.rollup({
    entry: './docsapp/static/js/main.js',
    context: 'window',
    plugins: [
      gulpif(isRelease, rollupUglify()),
      rollupLess({
        output: DOCSAPP_BUILD_PATH + 'style.css'
      })
    ]
  })
  .then( function ( bundle ) {
    bundle.write({
      format: 'iife',
      dest: DOCSAPP_BUILD_PATH + 'bundle.js'
    });
    done();
  });
});


gulp.task('docsapp-assets', ['docsapp-clean', 'docsapp-rollup'], function() {
  return gulp.src([DOCSAPP_BUILD_PATH + '*.js', DOCSAPP_BUILD_PATH + '*.css'], {base: DOCSAPP_BUILD_PATH})
        .pipe(gulp.dest(DOCSAPP_BUILD_PATH))
        .pipe(rev())
        .pipe(gulp.dest(DOCSAPP_BUILD_PATH))  
        .pipe(rev.manifest('manifest.json'))
        .pipe(gulp.dest(DOCSAPP_BUILD_PATH))
})

gulp.task('docsapp-dev-assets', ['docsapp-clean', 'docsapp-rollup'], function() {
  return gulp.src('./docsapp/static/dev/manifest.json')
    .pipe(copy(DOCSAPP_BUILD_PATH, { prefix: 3 }))
})

gulp.task('docsapp-watch', function() {
  gulp.watch(['./docsapp/static/js/**.*', './docsapp/static/less/**.*',], [ 'docsapp-clean', 'docsapp-rollup', 'docsapp-dev-assets' ]);
});

gulp.task('docsapp-clean', function(done) {
  return gulp.src(DOCSAPP_BUILD_PATH + '*.*', { read: false })
    .pipe(rimraf({ force: true }))
});

gulp.task('docsapp-default', [ 'docsapp-clean', 'docsapp-rollup', 'docsapp-dev-assets', 'docsapp-watch' ]);
gulp.task('docsapp-build', [ 'docsapp-clean', 'docsapp-rollup', 'docsapp-assets' ]);
gulp.task('docsapp-release', [ 'setIsRelease', 'docsapp-build' ]);




gulp.task('madapp-rollup', [ 'madapp-clean' ], function(done) {
  rollup.rollup({
    entry: './webapp/index.js',
    context: 'window',
    plugins: [
      babel({
        babelrc: false,
        exclude: [ 'node_modules/**', '**/*.less' ],
        presets: [ 'es2015-rollup' ],
        plugins: ['inferno', 'transform-object-rest-spread']
      }),
      cjs({
        include: [ 'node_modules/**' ],
        namedExports: {
          'node_modules/inferno-redux/inferno-redux.js': [ 'Provider', 'connect' ],
          'node_modules/inferno-router/inferno-router.js': [ 'Link', 'Router', 'Route', 'IndexRoute' ],
        }
      }),
      globals(),
      replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
      resolve({
        browser: true,
        main: true
      }),
      gulpif(isRelease, rollupUglify()),
      rollupLess({
        output: './dist/static/style.css'
      })
    ]
  })
  .then( function ( bundle ) {
    bundle.write({
      format: 'iife',
      dest: './dist/static/bundle.js'
    });
    done();
  });
});

gulp.task('madapp-assets', ['madapp-clean', 'madapp-rollup'], function() {
  return gulp.src(['./dist/static/*.js', './dist/static/*.css'], {base: './dist/static'})
        .pipe(gulp.dest('./dist/static'))
        .pipe(rev())
        .pipe(gulp.dest('./dist/static'))  
        .pipe(rev.manifest('manifest.json'))
        .pipe(gulp.dest('./dist/static'))
})

gulp.task('madapp-dev-assets', ['madapp-clean', 'madapp-rollup'], function() {
  return gulp.src('./docsapp/static/dev/manifest.json')
    .pipe(copy('./dist/static', { prefix: 3 }))
})

gulp.task('madapp-watch', function() {
  gulp.watch('./webapp/**', [ 'madapp-clean', 'madapp-rollup', 'madapp-dev-assets' ]);
});

gulp.task('madapp-clean', function(done) {
  return gulp.src([ './dist/*.*', './dist/static/*.*' ], { read: false })
    .pipe(rimraf({ force: true }))
});

gulp.task('madapp-default', [ 'madapp-clean', 'madapp-rollup', 'madapp-dev-assets', 'madapp-watch' ]);
gulp.task('madapp-build', [ 'madapp-clean', 'madapp-rollup', 'madapp-assets' ]);
gulp.task('madapp-release', [ 'setIsRelease', 'madapp-build' ]);

gulp.task('default', [ 'docsapp-default', 'madapp-default' ]);
gulp.task('build', [ 'docsapp-build', 'madapp-build' ]);
gulp.task('release', [ 'docsapp-release', 'madapp-release' ]);




