// pretty simple build file for TSMT Tree tests
const gulp       = require('gulp');
const typescript = require('gulp-tsc'); 
const tscConfig  = require('./tsconfig.json');
const mocha      = require('gulp-mocha');
const util       = require('gulp-util');
const chai       = require('chai');

// compile the source code and test suite
gulp.task('compile', function () {
    return gulp
    .src([
      'test/tree.specs.ts'
    ], { base: "." })
    .pipe(typescript(tscConfig.compilerOptions))
    .pipe(gulp.dest('.'))
});

gulp.task('test', function () {
  return gulp.src("./test/tree.specs.js", {read:false})
  .pipe(mocha({reporter:'spec'}));
});
