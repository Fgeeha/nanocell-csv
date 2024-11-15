
window.addEventListener('beforeunload', function (e) {
	if (!sheet.df.isSaved)  e.preventDefault();
	
});


let sampleData = [	
	["Hello World", ""] ,

]



// localStorage.clear();
let is_installed = window.matchMedia('(display-mode: standalone)').matches
let sheet = undefined;
let overview = undefined;
let csvHandle = new CsvHandle()


clean_start = function () {
	Setting.log()
	Setting.init();
	buildCommands();
	buildMenu();
	buildKeys();
	sheet = new Sheet(new Dataframe(sampleData));
	Setting.runAll();
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



// TODO Long Term =================================================================

// context click col menu
// opening multiple times a file should refocus that file
// add a more options menu icon that opens a text menu to the right with commands or an extra menu row
// expand should work with YYYY-MM-DD date
// strict csv format transform >> show all transforms and validate
// slct to upper
// slct to lower
// Test on all os
// test memory (ram)


// TODO Short Term =================================================================
// finder advanced input rework, text input click focus, copy past into input, fill with current selected cell on start ... 
// scroll bar horizontal 
// cut ctrl x not working 
//  rework selected range order and input location ( set it to first top left index viewable)
// do a last keydown target global object to help with mous move events 
// ads a "view menu bar" toggle setting