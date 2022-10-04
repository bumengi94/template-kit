export {};
window.addEventListener("load", async () => {
	if ("serviceWorker" in navigator) {
		try {
			await navigator.serviceWorker.register("/js/sw.js", { scope: "/" });
			console.log("Service worker registered");
		} catch (e) {}
	}
});
