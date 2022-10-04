import { dest, src, task, watch } from "gulp";
import { rmSync } from "fs";
import pugPlugin from "gulp-pug";
import sass from "sass";
import gulpSass from "gulp-sass";
import sourceMaps from "gulp-sourcemaps";
import browserSync from "browser-sync";
import autoprefixer from "gulp-autoprefixer";

const bs = browserSync.create();

const sassPlugin = gulpSass(sass);

const paths = {
	pug: {
		path: "./src/**/*.pug",
		ignore: ["./src/layouts/**/*.pug", "./src/components/**/*.pug"],
	},
	sass: {
		path: "./src/sass/**/*.sass",
	},
	static: {
		path: "./src/assets/**",
	},
};

const pugTask = () =>
	src(paths.pug.path, { ignore: paths.pug.ignore }).pipe(pugPlugin()).pipe(dest("./dist")).pipe(bs.stream());

const sassTask = () =>
	src(paths.sass.path)
		.pipe(sourceMaps.init())
		.pipe(sassPlugin({ outputStyle: "compressed" }))
		.pipe(autoprefixer({ cascade: true }))
		.pipe(sourceMaps.write("."))
		.pipe(dest("./dist/assets/css"))
		.pipe(bs.stream());

const staticTask = () => src(paths.static.path).pipe(dest("./dist/assets")).pipe(bs.stream());

const cleanTask = () => {
	try {
		rmSync("./dist", { recursive: true });
	} catch (e) {}
};

task("default", () => {
	bs.init({ server: { baseDir: "./dist" } });
	cleanTask();

	pugTask();
	watch(paths.pug.path, pugTask);

	sassTask();
	watch(paths.sass.path, sassTask);

	staticTask();
	watch(paths.static.path, staticTask);
});

task("build", (done) => {
	cleanTask();
	pugTask();
	sassTask();
	staticTask();
	done();
});
