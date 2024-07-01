const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const browserSync = require('browser-sync').create()

// Dynamically import gulp-autoprefixer as an ES module
const autoprefixer = () =>
  import('gulp-autoprefixer').then(({ default: fn }) => fn)

// Compile Sass & Inject Into Browser
gulp.task('sass', async function () {
  const autoprefix = await autoprefixer()
  return gulp
    .src(['scss/*.scss']) // Adjust this path to where your Sass files are located
    .pipe(sass().on('error', sass.logError))
    .pipe(
      autoprefix({
        cascade: false,
      })
    )
    .pipe(gulp.dest('css')) // Adjust this path to where you want your CSS files to go
    .pipe(browserSync.stream())
})

// Watch Sass & Serve
gulp.task(
  'serve',
  gulp.series('sass', function () {
    browserSync.init({
      proxy: 'https://tabascosunrise.ddev.site', // Your local development URL
      open: false, // Prevent BrowserSync from automatically trying to open the browser
    })

    gulp.watch(['scss/*.scss'], gulp.series('sass')) // Adjust this path to your Sass files
    gulp.watch(['*.html', 'js/*.js']).on('change', browserSync.reload) // Adjust paths as needed
  })
)

// Default Task
gulp.task('default', gulp.series('serve'))
