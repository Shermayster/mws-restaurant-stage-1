/* eslint-env node */
var gulp = require('gulp');

gulp.task('serve', ['css'], function() {
    gulp.watch("./src/css/*.css", ['css']);
})

gulp.task('css', function () {
    var postcss    = require('gulp-postcss');
    var sourcemaps = require('gulp-sourcemaps');
    var autoprefixer = require('autoprefixer');
    var cssnano = require('cssnano');

    var plugins = [
        autoprefixer(),
        cssnano()
    ]
    return gulp.src('src/css/*.css')
        .pipe( sourcemaps.init() )
        .pipe( postcss(plugins) )
        .pipe( sourcemaps.write('.') )
        .pipe( gulp.dest('dist/css') );
});