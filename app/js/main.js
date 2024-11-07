
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
	dom.content.appendChild(dom.content.scroller);
	sheet.scrollerUpdate();
}


clean_start();





function log_to_database(value){
	if (navigator.serviceWorker.controller) {
		// Send message to the service worker
		navigator.serviceWorker.controller.postMessage({
		  type: 'db_log',
		  payload: { log: value }
		});
	  }

}

window.launchQueue.setConsumer(async (params) => {
	log_to_database("file_launch")
	console.log(params)
	const [handle] = params.files;
	if (handle) csvHandle.launchFile(handle)
});


window.addEventListener('message', (event) => {
	console.log(event)
	if (event.data && event.data.fileHandle) csvHandle.launchFile(event.data.fileHandle)
});




// 



// Known issues    =================================================================
// potential issue when reading chunk cuts 16 bit char in 2 diff chunks, unlucky but possible, requires testing



// TODO Eventually =================================================================
// col operations >> add / concat / sub / mult/ div
// context click col menu
// custom scroller 
// autogen R/panda/spark code for basic view



// TODO Long Term =================================================================

// opening multiple times a file should refocus that file
// add a more options menu icon that opens a text menu to the right with commands or an extra menu row
// expand should work with YYYY-MM-DD date
// strict csv format transform >> show all transforms and validate
// slct to upper
// slct to lower
// Paste csv should format CSV
// Test on all os
// test memory (ram)


// TODO Short Term =================================================================
// finder click close  & finder advanced input rework, text input click focus
// scroll bar 
// setting for the col sort : txt first or num first & ignore header (set as dflt). 
