
window.addEventListener('beforeunload', function (e) {
	if (!sheet.df.isSaved)  e.preventDefault();
	
});


let sampleData = [	
	["Hello World", "", "", "", "ds"] ,
	["Hello World", ""] ,
	["Hello World", ""] ,
	["Hello World", ""] ,
	

]

// console.log (navigator.userAgent)
let isOSX = navigator.userAgent.includes('Macintosh')



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
// ctrl+ shift +e should expand horizontally

// TODO Eventually =================================================================
// col operations >> add / concat / sub / mult/ div



// TODO Long Term =================================================================

// context click col menu
// opening multiple times a file should refocus that file
// add a more options menu icon that opens a text menu to the right with commands or an extra menu row
// add date formatting
// expand should work with YYYY-MM-DD date 
// strict csv format transform >> show all transforms and validate
// slct to upper
// slct to lower
// test memory (ram)
//  prevent sheet inputs if the dom.diologue is not finder or empty
// navigate settings using tab and up/down arrows

// TODO Short Term =================================================================
// build offuscation
// Test on all os (OSX mostly)
// SEO optimization

