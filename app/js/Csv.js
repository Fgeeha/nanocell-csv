class Csv {
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



static open (cb){}
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







Object.defineProperty(Csv, 'openOptions', {
value: {
  type: "openWritableFile",
  acceptsAllTypes: false,
  acceptsMultiple: true,
  accepts:[
    {description:"Select one or more files of type '.csv' or '.tsv' "},
    {mimeTypes:["text/csv", "text/tsv"]},
    {extensions:["csv","tsv"]}
  ]
}
});


