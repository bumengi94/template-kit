import { dest, src, task, watch } from "gulp";
import { rmSync } from "fs";
import pugPlugin from "gulp-pug";
import sass from "sass";
import gulpSass from "gulp-sass";
import sourceMaps from "gulp-sourcemaps";

const sassPlugin = gulpSass(sass);

const paths = {
	pug: {
		path: "./src/**/*.pug",
		ignore: ["./src/layouts/**/*.pug", "./src/components/**/*.pug"],
	},
	sass: {
		path: "./src/sass/**/*.sass",
	},
};

const pugTask = () => src(paths.pug.path, { ignore: paths.pug.ignore }).pipe(pugPlugin()).pipe(dest("./dist"));

const sassTask = () =>
	src(paths.sass.path)
		.pipe(sourceMaps.init())
		.pipe(sassPlugin({ outputStyle: "compressed" }))
		.pipe(sourceMaps.write("."))
		.pipe(dest("./dist/assets/css"));

task("default", () => {
	try {
		rmSync("./dist", { recursive: true });
	} catch (e) {}
	pugTask();
	sassTask();
	watch(paths.pug.path, pugTask);
	watch(paths.sass.path, sassTask);
});
