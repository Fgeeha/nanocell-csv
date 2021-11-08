class WorkManager {

constructor() {
  this.file = null;
  this.file_chunks = null;
  this.cb = null;
  this.viewOnly = false;
  this.sw   = new Worker("js/sw_read_write_csv.js");
  this.sw.addEventListener("message",e=>{
    let d = e.data
    console.log( e.data)
    switch(d.cmd) {
      case "chunk_loaded": this.file_chunk_loaded(d)
    }
})




  // addEventListener("message", e => {
  // status = e.data[0]
  
  // });
}

file_chunk_loaded(d){
  document.getElementById("footerCenter").innerHTML = Math.round (d.status*100) +"%"
  if(d.chunk != null) this.file_chunks.push(d.chunk) 
  if(d.status>=1) {
  console.log ("n chunks loaded: " , this.file_chunks.length)
  this.cb(this.file_chunks.flat(1));
  }
}





read(file, cb=null){
  this.file = file;
  this.file_chunks = [];
  this.cb = cb;
  let mbSize = file.size / 1000000
  file.viewOnly = mbSize > Number(Setting.editMaxFileSize);
  console.log (file)
  console.log ("view only = ",file. viewOnly)
  this.pipe("read", file)
}


pipe (cmd, data){this.sw.postMessage({cmd:cmd, data:data})}


}
