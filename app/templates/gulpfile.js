var gulp = require('gulp'),
    configLocal = require('./gulp-config.json'),
    merge = require('merge'),
    es = require('event-stream'),
    juice = require('juice'),
    sass = require('gulp-sass'),
    combineMq = require('gulp-combine-mq'),
    htmlMin = require('gulp-htmlmin'),
    cheerio = require('gulp-cheerio'),
    he = require('he'),
    browserSync = require('browser-sync').create();


var configDefault = {
      srcDir: 'src',
      distDir: 'dist'
    },
    config = merge(configDefault, configLocal);


// Compile scss files and combine media queries
gulp.task('scss', function() {
  return gulp.src(config.srcDir + '/scss/*.scss')
    .pipe(sass({
      outputStyle: "compact"
    }).on('error', sass.logError))
    .pipe(combineMq())
    .pipe(gulp.dest(config.srcDir + '/css/'))
    .pipe(browserSync.stream());
});

// Inline CSS into the email markup, then minify and encode special chars.
// Note: 'html-inline' depends on 'scss' finishing before it can be run.
gulp.task('html-inline', ['scss'], function() {
  return gulp.src([config.srcDir + '/*.html'])
    .pipe(es.map(function(data, cb) {
      juice.juiceFile(data.path, config.juice, function(err, html) {
        data.contents = new Buffer(html);
        cb(null, data);
      });
    }))
    .pipe(htmlMin(config.htmlmin))
    .pipe(cheerio({
      run: function($, file) {
        // Each file will be run through cheerio and each corresponding `$` will be passed here.
        // `file` is the gulp file object
        $('body *').each(function() {
          $(this)
            .contents()
            .filter(function() { return this.nodeType === 3 && /\S/.test(this.nodeValue); })
              .each(function() {
                // Decode everything first, to handle already-encoded
                // characters such as `&amp;`, then encode
                this.nodeValue = he.encode(he.decode(this.nodeValue));
              });
          });
      },
      parserOptions: {
        decodeEntities: false
      }
    }))
    .pipe(gulp.dest(config.distDir + '/'))
    .pipe(browserSync.stream());
});

// All CSS-related tasks
gulp.task('default', ['scss', 'html-inline']);


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
