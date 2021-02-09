//===========HOUSEKEEPING===============//
//imports
const autoprefixer  = require("autoprefixer")
const cssnano       = require("cssnano")
const {dest,src,watch,series,parallel} = require("gulp")
const concat        = require("gulp-concat")
const postcss       = require("gulp-postcss")
const replace       = require("gulp-replace")
const sass          = require("gulp-sass")
const sourcemaps    = require("gulp-sourcemaps")
const uglify        = require("gulp-uglify")
const browsersync = require("browser-sync").create()

//Path variables
const files = {
    scssPath: 'dev/scss/*.scss',
    jsPath:   'dev/js/**/*.js'  
}

//==============TASKS================//
//CSS
function scssTask() {
    return src(files.scssPath)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('dist'))
}
//JS
function jsTask() {
    return src(files.jsPath)
        .pipe(concat('main_dist.js'))
        .pipe(uglify())
        .pipe(dest('dist'))
}

//===================CACHEBUSTING============//
//Add timestamp for versioning css etc..
const newStamp = new Date().getTime()
function cacheStamp() {
    return src(['index.html'])
        .pipe(replace(/ver=\d+/g, 'ver=' + newStamp))
        .pipe(dest('.'))
}


//===================GENERAL================//
//live reload
function browserServe(syncer) {
    browsersync.init({
        server: {
            baseDir: '.'
        }
    })
    syncer()

}


function browserReload(syncer){
    browsersync.reload()
    syncer();
}

//watch
function watcher() {
    watch('*.html', browserReload)
    watch([files.scssPath, files.jsPath],
        parallel(scssTask, jsTask, browserReload))
}

//CLI 
exports.default = series(
    parallel(scssTask, jsTask),
    cacheStamp,
    browserServe,
    watcher
)

