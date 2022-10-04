import { dest, src, task, watch } from "gulp";
import { rmSync } from "fs";
import pugPlugin from "gulp-pug";
import sass from "sass";
import gulpSass from "gulp-sass";
import sourceMaps from "gulp-sourcemaps";
import browserSync from "browser-sync";
import autoprefixer from "gulp-autoprefixer";
import gulpTypescript from "gulp-typescript";
import uglifyPlugin from "gulp-uglify";

const bs = browserSync.create();
const sassPlugin = gulpSass(sass);
const typescriptPlugin = gulpTypescript.createProject("./src/ts/tsconfig.json");
const paths = {
	pug: {
		path: "./src/**/*.pug",
		ignore: ["./src/layouts/**/*.pug", "./src/components/**/*.pug"],
	},
	sass: {
		path: "./src/sass/**/*.sass",
	},
	ts: {
		path: "./src/ts/**/*.ts",
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

const tsTask = () =>
	src(paths.ts.path)
		.pipe(sourceMaps.init())
		.pipe(typescriptPlugin())
		.pipe(uglifyPlugin({ compress: true, mangle: true }))
		.pipe(sourceMaps.write("."))
		.pipe(dest("./dist/js"))
		.pipe(bs.stream());

const staticTask = () => src(paths.static.path).pipe(dest("./dist/assets")).pipe(bs.stream());

const cleanTask = () => {
	try {
		rmSync("./dist", { recursive: true });
	} catch (e) {}
};

task("default", () => {
	bs.init({
		server: {
			baseDir: "./dist",
			serveStaticOptions: {
				setHeaders: (res, path) => {
					if (path.endsWith("sw.js")) {
						res.setHeader("Service-Worker-Allowed", "/");
					}
				},
			},
		},
	});
	cleanTask();

	pugTask();
	watch(paths.pug.path, pugTask);

	sassTask();
	watch(paths.sass.path, sassTask);

	tsTask();
	watch(paths.ts.path, tsTask);

	staticTask();
	watch(paths.static.path, staticTask);
});

task("build", (done) => {
	cleanTask();
	pugTask();
	sassTask();
	tsTask();
	staticTask();
	done();
});
