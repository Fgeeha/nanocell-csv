
window.addEventListener('beforeunload', function (e) {
	if (!sheet.df.isSaved)  e.preventDefault();
	
});


let sampleData = [	
	["Hello World", "", "", "", "ds"] ,
	["Hello World", ""] ,
	["Hello World", ""] ,
	["Hello World", ""] ,
	

]



// localStorage.clear();
let is_installed = window.matchMedia('(display-mode: standalone)').matches
let sheet = undefined;
let overview = undefined;
let csvHandle = new CsvHandle()


nanocell_cleanStart = function () {
	Setting.log()
	Setting.init();
	buildCommands();
	buildMenu();
	buildKeys();
	dom.content.scrollerY   = new Scroller();
	dom.content.scrollerX   = new Scroller(false);
	sheet = new Sheet(new Dataframe(sampleData));
	Setting.runAll();
}

window.launchQueue.setConsumer(async (params) => {
	console.log(params)
	const [handle] = params.files;
	if (handle) csvHandle.launchFile(handle)
});


window.addEventListener('message', (event) => {
	console.log(event)
	if (event.data && event.data.fileHandle) csvHandle.launchFile(event.data.fileHandle)
});





// Known issues    =================================================================
// potential issue when reading chunk cuts 16 bit char in 2 diff chunks, unlucky but possible, requires testing
// ctrl+s on input tries to save the html page
// alt arrow should move multiple row/col when slct range is active
// Finder is under bot scrollbar

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
// test memory (ram)


// TODO Short Term =================================================================
// finder advanced input rework, text input click focus, copy past into input, fill with current selected cell on start ... 
// build to public folder pipeline
// Test on all os (OSX mostly)
// SEO optimization

