let sampleData = [
	["", 0 , 1,2,3, "a", "b","c"],
	["", "" , 2,"x",3, "a", "b","c"],


]





// localStorage.clear();
let is_installed = window.matchMedia('(display-mode: standalone)').matches
let sheet = undefined;


clean_start = function (){
	Setting.init()
	Setting.setTheme()
	buildCommands();
	buildMenu();
	buildKeys()
	sheet = new Sheet(new Dataframe(sampleData));
	dom.content.appendChild(sheet);
}


if (is_installed)clean_start();
else ask_for_install();




// window.launchQueue.setConsumer(async (params) => {
//   const [handle] = params.files;
//   if (handle) {

//     const file = await handle.getFile();
    
//     console.log("Loading : " , file.name)
//     Dataframe.fromFile( file, df=>{
//     	console.log(df)
//     } )
//   }
// });




// TODO BIG
// above x GB only provide info graphics 
// info graphics  (col names, distincts, # blank values, sum, mean, histogram )
// sort col a-z, z-a, 0-9, 9-0 
// col operations


// nice to have 

// opening multiple times a file should refocus that file 
// increment should work with YYYY-MM-DD date





// TODO launch critical 

// new open read write save (implement strict mode)
// saved file icon + close tab
// about / help 
// insert today date
// finder click close  & finder advanced input rework, text input click focus 
// context click col menu 
// toggle commas to dots
// have a nice install page 
