const versionName = 'Beta_v0.0.8';
const filesToCache = [
"logo/nanocell_logo_builder.svg",
"logo/nanocell.svg",
"js/utils/misc.js",
"js/utils/DateExt.js",
"js/ui/input/Table.js",
"js/ui/input/Scroller.js",
"js/ui/input/NumInput.js",
"js/ui/input/ListInput.js",
"js/ui/input/BoolInput.js",
"sw_read_write_csv.js",
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
"icn/menu/sort_reverse.svg",
"icn/menu/sort.svg",
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
// log_to_db("install");
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



function formatDate(date) {
let year = date.getFullYear();
let month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-based index
let day = String(date.getDate()).padStart(2, '0');

return `${year}-${month}-${day}`;
}



// self.addEventListener('message', function(event) {
// if (event.data && event.data.type === 'db_log')
// // log_to_db(event.data.payload.log);

// });



// log_to_db = function(action){
// let url = "https://script.google.com/macros/s/AKfycbwAgDTn8inDLi7XXXYPauyXbF29tq1sWkIQBP4T2h2KVSmb-Vc5sbL8g_E_VjGastbg3Q/exec";
// let language = navigator.language || navigator.userLanguage;
// let formData = new FormData();

// // Step 2: Append key-value pairs to the FormData object
// formData.append('date', formatDate(new Date()) );
// formData.append('language', language);
// formData.append('version', versionName);
// formData.append('action', action);
// formData.append('description', "na");
// formData.append('url', self.location.origin);

// // Step 3: Create a POST request using Fetch API
// fetch(url, {method: 'POST',body: formData })
// .then(response => {console.log("response : ");console.log(response)} ) // Assuming the response is JSON
// .then(data => console.log(data))
// .catch(error => console.error('Error:', error));

// }