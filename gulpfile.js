//* ---------------------------- Constants ---------------------------- //


const {
    src,
    dest,
    watch,
    series
} = require('gulp');

const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const autoprefixer = require('gulp-autoprefixer');
const purgecss = require('gulp-purgecss');



//* ---------------------------- Tasks ---------------------------- //


//$ ************** ScssTask ************** //
function scssTask() {

    return src('./app/scss/**/*.scss', {
            sourcemaps: true
        })

        //  Pass the file through the compiler
        .pipe(sass().on('error', sass.logError))



        //  Css file path
        .pipe(dest('./dist/css', {
            sourcemaps: '.'
        }))

        //  Stream changes to all browsers
        .pipe(browserSync.stream());
}


function buildCssTask() {

    return src('./dist/css/style.css', {
            sourcemaps: true
        })

        //  Minify
        .pipe(postcss([cssnano()]))


        //  Autoprefix
        .pipe(autoprefixer({
            cascade: false
        }))


        // Purge
        .pipe(purgecss({
            content: ['*.html']
        }))


        // Css file path
        .pipe(dest('./dist/css', {
            sourcemaps: '.'
        }))
}



//$ ************** javaScript Task ************** //
function jsTask() {

    // 1. js path
    return src('./app/js/main.js', {
            sourcemaps: true
        })

        // 2. Minify js
        .pipe(terser())

        // 3. Minified js path
        .pipe(dest('dist/js', {
            sourcemaps: '.'
        }));
}



//$ ************** Browser-Sync Task ************** //
function browserSyncServer(cb) {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    cb();
}

function browserSyncReload(cb) {
    browserSync.reload();
    cb();
}


//$ ************** Watch Task ************** //
function watchTask() {
    watch('*.html', browserSyncReload);
    watch(['./app/scss/**/*.scss', './app/js/**/*.js'], series(scssTask, jsTask, browserSyncReload))
}




//* ---------------------------- Exports ---------------------------- //

// Default Export
exports.default = series(
    scssTask,
    jsTask,
    browserSyncServer,
    watchTask
);


// Specific Exports
exports.style = scssTask;
exports.js = jsTask;
exports.watch = series(
    browserSyncServer,
    watchTask
);
exports.build = series(
    buildCssTask,
);