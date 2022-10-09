/// <reference lib="WebWorker" />

export {};
declare const self: ServiceWorkerGlobalScope;

const cacheName = "template-kit";
const cachePaths = ["/", "/index.html", "/fallback.html"];

self.oninstall = async (event) => {
	try {
		const cache = await caches.open(cacheName);
		await cache.addAll(cachePaths);
		self.skipWaiting();
	} catch (e) {}
};

self.onfetch = (event) => {
	if (event.request.method === "GET") event.respondWith(fetchHandler(event.request));
};

const fetchHandler = async (request: Request) => {
	try {
		let response: Response;
		const cache = await caches.open(cacheName);
		response = await cache.match(request);
		if (!response) {
			response = await fetch(request).catch(() => cache.match("/fallback.html"));
			if (request.cache !== "no-cache") await cache.put(request, response.clone());
		}
		return response;
	} catch (e) {}
};
