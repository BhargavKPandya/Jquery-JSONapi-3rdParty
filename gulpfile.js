var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var del = require('del');
var path = require('path');
const dir = {
    src: {
      path: "./",
      js: "./js/",
      dataFiles: "./Data/"
    },
    dist: {
      path: "./dist/",
      js: "./dist/js/",
      dataFiles: "./dist/dataFiles/"
    }
  };
  
  const extension = {
    template: "*.html",
    script: "*.js",
    data: "*"
  };

  gulp.task('browser-sync', function () {
    browserSync.init({
      server: {
        baseDir: './dist'
      },
    })
  });
  
  function reload() {
    browserSync.reload();
  }

  function cleanDist(){
    return del(`${dir.dist.path}`);
  }

  function copyhtml() {
    return gulp.src(`${dir.src.path + extension.template}`)
      //.pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest(`${dir.dist.path}`))
      .pipe(browserSync.reload({ stream: true }));
  }

  function copyJS() {
    return gulp.src(`${dir.src.js + extension.script}`)
      .pipe(gulp.dest(`${dir.dist.js}`))
      .pipe(browserSync.reload({ stream: true }));
  }

  function copyDataFiles() {
    return gulp.src(`${dir.src.dataFiles + extension.data}`, { since: gulp.lastRun(copyDataFiles) })
      .pipe(gulp.dest(`${dir.dist.dataFiles}`))
      .pipe(browserSync.reload({ stream: true }));
  }

  function watchhtml() {
    return gulp.watch(`${dir.src.path + extension.template}`, gulp.parallel(copyhtml));
  }

  function watchJS() {
    return gulp.watch(`${dir.src.js + extension.script}`, gulp.parallel(copyJS))
      .on('unlink', function (filepath) {
        var filePathFromSrc = path.relative(path.resolve(`${dir.src.js}`), filepath);
        var destFilePath = path.resolve(`${dir.dist.js}`, filePathFromSrc);
        del.sync(destFilePath);
        reload();
      });
  }

  function watchDataFiles() {
    return gulp.watch(`${dir.src.dataFiles+ extension.data}`, gulp.parallel(copyDataFiles))
      .on('unlink', function (filepath) {
        var filePathFromSrc = path.relative(path.resolve(`${dir.src.dataFiles}`), filepath);
        var destFilePath = path.resolve(`${dir.dist.dataFiles}`, filePathFromSrc);
        del.sync(destFilePath);
        reload();
      });
  }

gulp.task('copy', gulp.parallel(copyJS, copyhtml, copyDataFiles));
gulp.task('watch', gulp.parallel(watchhtml, watchJS, watchDataFiles));
gulp.task('default',gulp.series(cleanDist, gulp.parallel('browser-sync', 'copy', 'watch')));