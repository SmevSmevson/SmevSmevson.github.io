"use-strict"

var version = 3;
var cacheName = `kevins-portfolio-${version}`;

var urlsToCache = {
    loggedOut: [
        "/",
        "/styles.css",
        "/triggers.js",
        "/media/capitalist_img.jpg",
        "/media/corona_watch_logo.png",
        "/media/IMG_2676.JPG",
        "/media/kimelab_logo.png",
        "/media/lt_logo.jpg",
        "/media/nulove_logo.png",
        "/media/rakuten_r_logo.png",
        "/media/sticky_baby.png",
        "/media/unpredictaball.png",
        "/media/xshell_logo.png",
        "https://fonts.googleapis.com/css?family=Nunito+Sans&display=swap"
    ]
}

self.addEventListener("install", onInstall);
self.addEventListener("activate", onActivate);
self.addEventListener("fetch", onFetch);

main().catch(console.error);

// *************************************

async function main() {
    await cacheLoggedOutFiles();
}


async function onInstall(evt) {
    // console.log(`Service Worker (v${version}) installed.`);
    self.skipWaiting();
}

function onFetch(evt) {
    evt.respondWith(router(evt.request));
}

async function router(req) {
    var url = new URL(req.url);
    var reqURL = url.pathname;
    var cache = await caches.open(cacheName);

    if (url.origin === location.origin){
        let res;
        try {
            let fetchOptions = {
                method: req.method,
                headers: req.headers,
                credentials: "omit",
                cache: "no-store"
            };
            res = await fetch(req.url, fetchOptions);
            if(res && res.ok) {
                await cache.put(reqURL, res.clone());
                return res;
            }
        } catch (error) {
            res = await cache.match(reqURL);
            if(res){
                return res.clone();
            }
        }
    }
    //TODO figure out CORS requests
}

async function onActivate(evt) {
    evt.waitUntil(handleActivation());
}

async function handleActivation() {
    await clearCaches();
    await cacheLoggedOutFiles(/*forceReload=*/true);
    await clients.claim();
    // console.log(`Service Worker (v${version}) activated.`);
}

async function clearCaches() {
	var cacheNames = await caches.keys();
	var oldCacheNames = cacheNames.filter(function matchOldCache(cacheName){
		var [,cacheNameVersion] = cacheName.match(/^ramblings-(\d+)$/) || [];
		cacheNameVersion = cacheNameVersion != null ? Number(cacheNameVersion) : cacheNameVersion;
		return (
			cacheNameVersion > 0 &&
			version !== cacheNameVersion
		);
	});
	await Promise.all(
		oldCacheNames.map(function deleteCache(cacheName){
			return caches.delete(cacheName);
		})
	);
}

async function cacheLoggedOutFiles(forceReload = false) {
    var cache = await caches.open(cacheName);

    return Promise.all(
        urlsToCache.loggedOut.map(async function requestFile(url) {
            try {
                let res;

                if (!forceReload) {
                    res = await cache.match(url);
                    if (res) {
                        return res;
                    }
                }

                let fetchOptions = {
                    method: "GET",
                    cache: "no-cache",
                    credentials: "omit"
                };
                res = await fetch(url, fetchOptions);
                if (res.ok) {
                    await cache.put(url, res);
                }
            } catch (error) {}
        })
    )
}