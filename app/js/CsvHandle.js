class CsvHandle {
constructor() {
  this.sw = new SW_read_write()
  this.df   = new Dataframe();
  this.file = null;
}

read(file){ 
  console.log(file)
  this.file = file;
  this.sw.read(file,data=>{
    this.df = new Dataframe(data);}
    )
}



static async open (cb){
  let [fileHandle] = await window.showOpenFilePicker(CsvHandle.openOptions);
  const file = await fileHandle.getFile();
  // const contents = await file.text();
  // textArea.value = contents;

  const newWindow = window.open('./home.html',null, 'width=600,height=400'); // 'newWindow.html' should be the page that will handle the file

  // Step 3: Use a MessageChannel to pass the file handle between windows
  const channel = new MessageChannel();

  // Step 4: Post the file handle to the new window
  newWindow.onload = () => {
    newWindow.postMessage({ fileHandle }, '*', [channel.port2]);
  };

}
reload(cb){}
saveAs(cb){}
save  (cb){}



static from2D(matrix){
  var txt = "";
  var newMat = [];
  for (var row of matrix){
    var newRow = [];
    for (var cell of row){
      var data = cell;
      var quote = false;
      for (var i = 0 ; i < data.length;i++){
        if (data[i]===",") quote = true;
        if (data[i]==='"'){quote=true;data=data.slice(0, i)+'"'+data.slice(i);i++}
      }
      if (quote) data = '"' +data +'"';
      newRow.push(data);
    }
    newMat.push(newRow.join(","));
  }
  return newMat.join('\n');
}


}







Object.defineProperty(CsvHandle, 'openOptions', {
value: {
  types:[
    {
      description:"csv (Comma Separated Value) ",
      accept: {"text/csv" : [".csv", ".tsv"]}

    } ,
  ]
}
});



// types: [
//   {
//     description: "Text file",
//     accept: { "text/plain": [".txt"] },
//   },
// ],