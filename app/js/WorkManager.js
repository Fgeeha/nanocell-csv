class WorkManager {

constructor() {
  this.file = null;
  this.file_chunks = null;
  this.cb = null;
  this.viewOnly = false;
  this.sw   = new Worker("js/sw_read_write_csv.js");
  this.sw.addEventListener("message",e=>{
    let d = e.data
    // console.log( e.data)
    switch(d.cmd) {
      case "chunk_loaded": this.file_chunk_loaded(d)
    }
})
}


file_chunk_loaded(d){
  document.getElementById("footerCenter").innerHTML = Math.round (d.status*100) +"%"
  if(d.chunk != null) this.file_chunks.push(d.chunk) 
  overview = new Overview(this.file, d)
  if(d.status>=1 && d.chunk != null) {
  // console.log ("n chunks loaded: " , this.file_chunks.length)
  this.cb(this.file_chunks.flat(1));
  }
}





read(file, cb=null){
  this.file = file;
  this.file_chunks = [];
  this.cb = cb;
  let mbSize = file.size / 1000000
  let viewOnly = mbSize > Number(stg.editMaxFileSize);
  console.log (file)
  console.log ("view only = ",file. viewOnly, "(file size = " ,mbSize, " & stg max = ",stg.editMaxFileSize," )")
  // console.log ("view only = ",file. viewOnly)
  this.pipe("read", {file:file,viewOnly : viewOnly})
}


pipe (cmd, data){this.sw.postMessage({cmd:cmd, data:data})}


}
