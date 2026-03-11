const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const del = require('del');
const through2 = require('through2');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const htmlmin = require('gulp-htmlmin');
const fileinclude = require('gulp-file-include');

const config = {
    src: 'src',
    build: 'build',
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
    html: 'src/html/**/*.html',
    images: 'src/images/raw/**/*'
};

function clean() {
    return del([config.build]);
}

function styles() {
    return gulp.src('src/scss/app.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([
            autoprefixer(),
            cssnano()
        ]))
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.stream());
}

function scripts() {
    return gulp.src('src/js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('build/js'))
        .pipe(browserSync.stream());
}

function html() {
    return gulp.src([
            'src/html/**/*.html',
            '!src/html/partials/**/*.html'
        ])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true,
            removeEmptyAttributes: true,
            minifyCSS: true,
            minifyJS: true
        }))
        .pipe(gulp.dest('build'))
        .pipe(browserSync.stream());
}

function fonts() {
    return gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('build/fonts'));
}

// Image Processing - Copy and convert to WebP and AVIF
function images(done) {
    const imageExtensions = ['.jpg', '.jpeg', '.png'];
    const srcDir = 'src/images/raw';
    const buildDir = 'build/img';
    
    // Ensure build directory exists
    if (!fs.existsSync(buildDir)){
        fs.mkdirSync(buildDir, { recursive: true });
    }
    
    const files = fs.readdirSync(srcDir);
    
    files.forEach(async (file) => {
        const ext = path.extname(file).toLowerCase();
        if (!imageExtensions.includes(ext)) return;
        
        const inputPath = path.join(srcDir, file);
        const basename = path.basename(file, ext);
        
        try {
            const inputBuffer = fs.readFileSync(inputPath);
            
            // Generate WebP
            await sharp(inputBuffer)
                .webp({ quality: 50 })
                .toFile(path.join(buildDir, basename + '.webp'));
            
            // Generate AVIF
            await sharp(inputBuffer)
                .avif({ quality: 50 })
                .toFile(path.join(buildDir, basename + '.avif'));
            
            // Copy original as optimized JPG
            await sharp(inputBuffer)
                .jpeg({ quality: 80 })
                .toFile(path.join(buildDir, basename + '.jpg'));
                
        } catch (err) {
            console.error('Error processing image:', file, err);
        }
    });
    
    // Copy non-image files
    gulp.src('src/images/raw/**/*')
        .pipe(gulp.dest('build/img'));
        
    done();
}

// Generate Thumbnails
function thumbnails(done) {
    const imageExtensions = ['.jpg', '.jpeg', '.png'];
    const srcDir = 'src/images/raw';
    const thumbDir = 'build/img/thumb';
    
    // Ensure thumb directory exists
    if (!fs.existsSync(thumbDir)){
        fs.mkdirSync(thumbDir, { recursive: true });
    }
    
    const files = fs.readdirSync(srcDir);
    
    files.forEach(async (file) => {
        const ext = path.extname(file).toLowerCase();
        if (!imageExtensions.includes(ext)) return;
        
        const inputPath = path.join(srcDir, file);
        const basename = path.basename(file, ext);
        
        try {
            const inputBuffer = fs.readFileSync(inputPath);
            
            // Create thumbnail 250x180
            await sharp(inputBuffer)
                .resize(250, 180, { fit: 'cover', position: 'center' })
                .jpeg({ quality: 50 })
                .toFile(path.join(thumbDir, basename + '-thumb.jpg'));
                
        } catch (err) {
            console.error('Error creating thumbnail:', file, err);
        }
    });
    
    done();
}

function watch() {
    browserSync.init({
        server: {
            baseDir: './build'
        },
        port: 3000
    });

    gulp.watch(config.scss, styles);
    gulp.watch(config.js, scripts);
    gulp.watch(config.html, html);
    gulp.watch(config.images, gulp.series(images, thumbnails));
}

const build = gulp.series(
    clean,
    gulp.parallel(styles, scripts, html, fonts, images, thumbnails)
);

exports.default = gulp.series(build, watch);
exports.build = build;
exports.watch = watch;
exports.clean = clean;
exports.images = images;
exports.thumbnails = thumbnails;

