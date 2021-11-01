const staticCacheName = 'cache-v3';
const filesToCache = [
  // '/'
  // 'index.html',
  // "css/palettes/light.css",
  // "css/themes/light.css",
  // "css/styles.css",
  // 'manifest.webmanifest'
  
]; 
    
   
self.addEventListener('install',e=>{
    e.waitUntil(caches.open(staticCacheName).then(cache=>{return cache.addAll(filesToCache)}))
});

self.addEventListener('activate',e=>{console.log('Service worker activating...')});


self.skipWaiting();



self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
    .then(response => {return response || fetch(event.request)})
    .catch(error => {console.error("Couldn't fetch: "+ event.request.url, error)})
  );
});

