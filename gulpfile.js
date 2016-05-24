var gulp = require('gulp'),
    configLocal = require('./gulp-config.json'),
    merge = require('merge'),
    es = require('event-stream'),
    EmailBuilder = require('email-builder-core'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create();


var configDefault = {
      srcDir: 'src',
      distDir: 'dist'
    },
    config = merge(configDefault, configLocal);


emailBuilder = new EmailBuilder(config.emailBuilderOptions);


// Compile scss files
gulp.task('scss', function() {
  return gulp.src(config.srcDir + '/scss/*.scss')
    .pipe(sass({
      outputStyle: "compact"
    }).on('error', sass.logError))
    .pipe(gulp.dest(config.srcDir + '/css/'))
    .pipe(browserSync.stream());
});

// Inline CSS into the email markup.
// Note: 'html-inline' depends on 'scss' finishing before it can be run.
gulp.task('html-inline', ['scss'], function() {
  return gulp.src([config.srcDir + '/*.html'])
    .pipe(es.map(function(data, cb) {
      emailBuilder.inlineCss(data.path)
        .then(function(html) {
          data.contents = new Buffer(html);
          cb(null, data);
        });
    }))
    .pipe(gulp.dest(config.distDir + '/'))
    .pipe(browserSync.stream());
});

// All CSS-related tasks
gulp.task('default', ['scss', 'html-inline']);


// // Send a test to Litmus.
// // TODO test this!
// gulp.task('test-litmus', function() {
//   return gulp.src([config.srcDir + '/*.html'])
//     .pipe(es.map(function(data, cb) {
//       var html = fs.readFile(data.path, 'utf8');
//       emailBuilder.sendLitmusTest(html);
//     }));
// });

// // Send a test email using Amazon SES (like Postmaster).
// // TODO test this!
// gulp.task('test-ses', function() {
//   return gulp.src([config.srcDir + '/*.html'])
//     .pipe(es.map(function(data, cb) {
//       var html = fs.readFile(data.path, 'utf8');
//       emailBuilder.sendEmailTest(html);
//     }));
// });


// Rerun tasks when files change
gulp.task('watch', function() {
  if (config.sync) {
    browserSync.init({
      server: {
        baseDir: config.distDir + '/',
        index: config.syncIndex
      }
    });
  }

  gulp.watch([config.srcDir + '/scss/*.scss', config.srcDir + '/*.html'], ['default']).on('change', browserSync.reload);
});
