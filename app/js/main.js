
window.addEventListener('beforeunload', function (e) {
	if (false) { // if csv not saved ask before quit
		e.preventDefault();
		e.returnValue = "";
	}
});


let sampleData = [
	["", 0, 1, 2, 3, "a", "b", "c"],
	["", "", 2, "x", 3, "a", "b", "c"],
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






// BUGS
// potential issue when reading chunk cuts 16 bit char in 2 diff chunks, unlucky but possible, requires testing



// TODO BIG
// above x GB only provide info graphics
// info graphics  (col names, distincts, # blank values, sum, mean, histogram )
// sort col a-z, z-a, 0-9, 9-0
// col operations


// nice to have

// opening multiple times a file should refocus that file
// increment should work with YYYY-MM-DD date
// autogen R/panda/spark code for basic view

// slct strict comma to dot
// slct strict replace spe chars ex : é => e
// slct to upper
// slct to lower
// context click col menu


// TODO launch critical
// ACTIVATE ALL SETTINGS
//  fix the expand feature
// insert today date
// refresh file command 
//  sav fixed width option
// Paste csv should format CSV
//  setting ui should be standard (not text input) if stg is only for info. 
// about / help >>  link to website
// left to right scroll on ctrl scroll 
// finder click close  & finder advanced input rework, text input click focus
// convert csv to strict mode (no commas, no double quotes)
// custom scroller 
// Test on all os
// test memory (ram)
// double check the app update feature
// log to google docs download and file open
