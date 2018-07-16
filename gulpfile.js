let browserSync=require('browser-sync'),
    gulp=require('gulp'),
    del=require('del'),
    path=require('path'),
    cssnano=require('cssnano'),
    autoprefixer=require('autoprefixer'),
    runSequence=require('run-sequence'),
    useref=require('gulp-useref'),
    sass=require('gulp-sass'),
    postcss=require('gulp-postcss'),
    gulpIf=require('gulp-if'),
    uglify=require('gulp-uglify'),
    cssVersioner=require('gulp-css-url-versioner'),
    tinyImg=require('gulp-tinypng-nokey'),
    fileInclude=require('gulp-file-include'),
    plumber=require('gulp-plumber'),
    jsonFile=require('jsonfile'),
    execSync=require('child_process').execSync,
    launchConf=jsonFile.readFileSync('./launchConf.json')

let randomVersion=Math.floor(Math.random() * 100000000);

let paths={
  dev:{
    css:'src/css/**/*.css',
    less:'src/css/*.less',
    sass:'src/css/*.scss',
    imgs:'src/images/**/*',
    js:'src/js/**/*',
    html:'src/html/*.html'
  },
  build:{
    css:'build/css/',
    imgs:'build/images/',
    js:'build/js/',
    html:'build/'
  }
}
    
gulp.task('browserSync',()=>{
  let conf;
  if(launchConf.webpack.use){
    conf={
      proxy:`localhost:${launchConf.webpack.port}`,
    }
  }else{
    conf={
      server:{
        baseDir:'./src',
        index:'index.html'
      }
    }
  }
  browserSync.init(conf)
})

gulp.task('sass',()=>{
  return gulp.src(paths.dev.sass)
    .pipe(sass().on('error',sass.logError))
    .pipe(postcss([
      autoprefixer({browsers: ['last 2 versions','Android >= 4.0','iOS 7']}),
      // cssnano(),
    ]))
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.reload({stream:true}))
})

gulp.task('fileInclude',()=>{
  return gulp.src(paths.dev.html)
    .pipe(plumber())
    .pipe(fileInclude({
      prefix:'@@',
      basepath:'src/html/tmpls'
    }))
    .pipe(gulp.dest('src/'))
})

gulp.task('watch',()=>{
  gulp.watch(paths.dev.sass,['sass']);
  gulp.watch('src/html/**/*.html',['fileInclude',browserSync.reload]).on('change',event=>{
    if(event.type==='deleted'){
      let target=path.parse(event.path).base;
      del(`src/${target}`);
    }
  });

  // 如果启用 webpack,则不监听 js 变化
  if(!launchConf.webpack.use){
    gulp.watch(paths.dev.js,browserSync.reload);
  }
})

gulp.task('clear:build',()=>{
  del('build/')
})

gulp.task('build:html',()=>{
  return gulp.src('src/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js',uglify()))
    .pipe(gulp.dest(paths.build.html))
})

gulp.task('build:css',()=>{
  return gulp.src(paths.dev.css)
    .pipe(postcss([
      cssnano(),
    ]))
    .pipe(cssVersioner({
      variable:'v',
      version:randomVersion
    }))
    .pipe(gulp.dest(paths.build.css))
})

gulp.task('build:js',()=>{
  return gulp.src(paths.dev.js)
    .pipe(gulp.dest(paths.build.js))
})

gulp.task('build:img',()=>{
  return gulp.src(paths.dev.imgs)
    .pipe(gulp.dest(paths.build.imgs))
})

gulp.task('tinyimg',()=>{
  return gulp.src(paths.dev.imgs)
    .pipe(tinyImg())
    .pipe(gulp.dest('src/images/'))
})

gulp.task('dev',callback=>{
  runSequence('fileInclude',['browserSync','sass','watch'],callback)
})

gulp.task('build',callback=>{
  if(launchConf.webpack.use){
    execSync('webpack',{
      env:{
        'NODE_ENV':'production'
      }
    })
  }
  runSequence('clear:build','sass','fileInclude','build:html',['build:js','build:css','build:img'],callback)
})


