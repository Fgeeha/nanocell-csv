window.addEventListener('beforeunload', function (e) { if (!sheet.df.isSaved) e.preventDefault() });

let sampleData = [
  ["Hello World", ""],

  // [ "Numbers", "Text","Not csv compliant", "Date", "Important"] ,
  // [ "3.14159", "null","not csv, compliant", "2024-11-29", "!cheers!"] ,
  // [ "1", "true", "1,2"] ,
  // [ "+1", "false", "not \"csv\" compliant"] ,
  // [ "", "1e"] ,
  // [ "0", "e2"] ,
  // [ "+0", "inf"] ,
  // [ "-0", "+inf"] ,
  // [ "1e2", "undefined"] ,
  // [ "Infinity", "NA"] ,
  // [ "+Infinity", "na"] ,
  // [ "0x765A", "NaN"] ,
  // [ "", "-"] ,
  // [ "", "--"] ,
  // [ "", "- -"] ,
  // [ "", "=2"] ,

]

// console.log (navigator.userAgent)
let isOSX = navigator.userAgent.includes('Macintosh')

// localStorage.clear();
let is_installed = window.matchMedia('(display-mode: standalone)').matches
let sheet = undefined;
let overview = undefined;
let csvHandle = new CsvHandle()

launchFileOnInitDone = function () {
  window.launchQueue.setConsumer(async (params) => {
    console.log(params)
    const [handle] = params.files;
    if (handle) csvHandle.launchFile(handle)
  });

  window.addEventListener('message', (event) => {
    console.log(event)
    if (event.data && event.data.fileHandle) csvHandle.launchFile(event.data.fileHandle)
  });
}

nanocell_cleanStart = function () {
  Setting.log()
  Setting.init();
  build_dom()
  buildCommands();
  buildMenu();
  buildKeys();
  sheet = new Sheet(new Dataframe(sampleData));
  Setting.runAll();
  launchFileOnInitDone();
}