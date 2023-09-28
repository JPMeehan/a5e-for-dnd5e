import gulp from "gulp";
import dartSass from "node-sass";
import gulpSass from "gulp-sass";
import concat from "gulp-concat";
import { rollup } from "rollup";

const sass = gulpSass(dartSass);

function compileSCSS() {
  return gulp
    .src("./styles/*.scss")
    .pipe(concat("a5e.scss"))
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("./"));
}

gulp.task("sass", compileSCSS);

async function compileJavascript() {
  const bundle = await rollup({
    input: "./src/module/hooks.mjs",
    //   plugins: [nodeResolve()]
  });
  await bundle.write({
    file: "./a5e.mjs",
    format: "es",
    sourcemap: true,
    sourcemapFile: "src/module/hooks.mjs",
  });
}

gulp.task("mjs", compileJavascript);

gulp.task("buildAll", gulp.series(compileSCSS, compileJavascript));
