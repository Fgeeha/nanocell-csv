
window.addEventListener('beforeunload', function (e) {
	if (!sheet.df.isSaved) { 
		// if (!sheet.df.isSaved) { 
		e.preventDefault();
		// e.returnValue = "";
		// Msg.confirm("File changes will be lost<br>Are you sure you want to quite ?");
	}
});


let sampleData = [
	["Hello World", ""],
	["",  ""],
]



// localStorage.clear();
let is_installed = window.matchMedia('(display-mode: standalone)').matches
let sheet = undefined;
let overview = undefined;
let csvHandle = new CsvHandle()


clean_start = function () {
	Setting.log()
	Setting.init();
	Setting.setTheme();
	buildCommands();
	buildMenu();
	buildKeys()
	sheet = new Sheet(new Dataframe(sampleData));
	dom.content.appendChild(sheet);
}


clean_start();

window.launchQueue.setConsumer(async (params) => {
	console.log(params)
	const [handle] = params.files;
	if (handle) csvHandle.launchFile(handle)
});


window.addEventListener('message', (event) => {
	console.log(event)
	if (event.data && event.data.fileHandle) csvHandle.launchFile(event.data.fileHandle)
});



function logVersion(){
	caches.keys().then(cacheNames => {
		cacheNames.forEach(cacheName => {
			console.log('Cache Version:', cacheName);
		});
	}).catch(error => {
		console.error('Error fetching cache names:', error);
	});

}




// Known issues    =================================================================
// potential issue when reading chunk cuts 16 bit char in 2 diff chunks, unlucky but possible, requires testing



// TODO Eventually =================================================================
// sort col a-z, z-a, 0-9, 9-0
// col operations >> add / concat / sub / mult/ div
// context click col menu
// custom scroller 
// autogen R/panda/spark code for basic view



// TODO Long Term =================================================================

// add a more options menu icon that opens a text menu to the right with commands or an extra menu row
// opening multiple times a file should refocus that file
// expand should work with YYYY-MM-DD date
// slct strict comma to dot
// slct strict replace spe chars ex : é => e
// slct to upper
// slct to lower
// Paste csv should format CSV
// Test on all os
// test memory (ram)


// TODO Short Term =================================================================
// finder click close  & finder advanced input rework, text input click focus
// log to google docs download and file open
