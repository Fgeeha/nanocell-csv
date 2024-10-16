const versionName = 'v1.0.4';
const filesToCache = [
  // '/'
  // 'index.html',
  // "css/palettes/light.css",
  // "css/themes/light.css",
  // "css/styles.css",
  // 'manifest.webmanifest'
  
]; 
    
   
self.addEventListener('install',e=>{
    e.waitUntil(caches.open(versionName).then(cache=>{return cache.addAll(filesToCache)}))
});

self.addEventListener('activate',e=>{
  console.log('Service worker activating...');
  e.waitUntil(self.registration?.navigationPreload.enable());
  e.waitUntil(deleteOldCaches());
  console.log('Service worker activation done');
  e.waitUntil(clients.claim());
  

});


self.skipWaiting();



self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
    .then(response => {return response || fetch(event.request)})
    .catch(error => {console.error("Couldn't fetch: "+ event.request.url, error)})
  );
});

const deleteCache = async (key) => {
  await caches.delete(key);
};

const deleteOldCaches = async () => {
  const cacheKeepList = [versionName];
  const keyList = await caches.keys();
  const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));
  await Promise.all(cachesToDelete.map(deleteCache));
};

