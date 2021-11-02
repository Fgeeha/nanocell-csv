class SW_read_write {
constructor() {
  this.file_chunks = null;
  this.cb = null;
  this.sw   = new Worker("js/sw_read_write_csv.js");
  this.sw.addEventListener("message",e=>{
    let pipe = e.data [0]
    let content = e.data [1]
    switch(pipe) {
      case "chunk_loaded": this.file_chunk_loaded(content[0], content[1])
    }
})




  addEventListener("message", e => {
  status = e.data[0]
  
  });
}

file_chunk_loaded(status, data_chunk){
  document.getElementById("footerCenter").innerHTML = Math.round (status*100) +"%"
  if(data_chunk != null) this.file_chunks.push(data_chunk) 
  if(data_chunk == null && status>=1) {
    console.log ("n chunks loaded: " , this.file_chunks.length)
    this.cb(this.file_chunks.flat(1));
  }
}

read (file, cb){
  this.file_chunks = []
  this.cb = cb
  this.pipe("load_csv", file)
}


pipe (pipe, data){this.sw.postMessage([pipe, data])}


}
