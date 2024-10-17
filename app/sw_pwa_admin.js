const versionName = 'v1.0.0';
const filesToCache = [
"logo/png/nanocell_96.png",
"logo/png/nanocell_80.png",
"logo/png/nanocell_72.png",
"logo/png/nanocell_64.png",
"logo/png/nanocell_512.png",
"logo/png/nanocell_48.png",
"logo/png/nanocell_32.png",
"logo/png/nanocell_256.png",
"logo/png/nanocell_192.png",
"logo/png/nanocell_16.png",
"logo/png/nanocell_128.png",
"logo/nanocell_fit.svg",
"logo/nanocell.svg",
"logo/nanocell.ico",
"logo/nanocell.icns",
"js/utils/misc.js",
"js/utils/DateExt.js",
"js/ui/input/Table.js",
"js/ui/input/NumInput.js",
"js/ui/input/ListInput.js",
"js/ui/input/BoolInput.js",
"js/sw_read_write_csv.js",
"js/Shortcuts.js",
"js/Sheet.js",
"js/Setting.js",
"js/Msg.js",
"js/main.js",
"js/key.js",
"js/Finder.js",
"js/dom.js",
"js/Dataframe.js",
"js/CsvHandle.js",
"js/cmd.js",
"js/About.js",
"icn/menu/zoomOut.svg",
"icn/menu/zoomIn.svg",
"icn/menu/validate_data.svg",
"icn/menu/undo.svg",
"icn/menu/trim.svg",
"icn/menu/transpose.svg",
"icn/menu/shortcuts.svg",
"icn/menu/settings.svg",
"icn/menu/save.svg",
"icn/menu/replace.svg",
"icn/menu/reloadFile.svg",
"icn/menu/redo.svg",
"icn/menu/overview.svg",
"icn/menu/open.svg",
"icn/menu/new.svg",
"icn/menu/more.svg",
"icn/menu/integer.svg",
"icn/menu/fixTop.svg",
"icn/menu/fixLeft.svg",
"icn/menu/find.svg",
"icn/menu/decimal.svg",
"icn/menu/date.svg",
"icn/menu/bin.svg",
"icn/menu/about.svg",
"icn/true.svg",
"icn/theme.svg",
"icn/shift.svg",
"icn/resize.svg",
"icn/ratio.svg",
"icn/on.svg",
"icn/off.svg",
"icn/minimize.svg",
"icn/menu.svg",
"icn/lock_open.svg",
"icn/lock.svg",
"icn/insert.svg",
"icn/info.svg",
"icn/increment.svg",
"icn/false.svg",
"icn/exit.svg",
"icn/edit.svg",
"icn/delta.svg",
"icn/decrement.svg",
"css/themes/light.css",
"css/themes/dark.css",
"css/palettes/light.css",
"css/palettes/dark.css",
"css/styles.css",
"css/sheet.css",
"css/print.css",
"css/overview.css",
"css/Inputs.css",
"css/Inconsolata-Regular.ttf",
"css/Inconsolata-Bold.ttf",
"sw_pwa_admin.js",
"home.html",
];


self.addEventListener('install',e=>{
e.waitUntil(caches.open(versionName).then(cache=>{return cache.addAll(filesToCache)}))
});

self.addEventListener('activate',e=>{
console.log('Service worker activating...');
// e.waitUntil(self.registration?.navigationPreload.enable());
// e.waitUntil(clients.claim());
e.waitUntil(caches.open(versionName).then(cache=>{return cache.addAll(filesToCache)}))

e.waitUntil(deleteOldCaches());
console.log('Service worker activation done');


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