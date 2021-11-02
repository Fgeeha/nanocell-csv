const  CHUNK_SIZE = 1000000

csv_parse = function(txt, d = ","){
  return  txt.split(/\r?\n/).map(s=>{
    var r = [];     //result;
    var q = '"';    //quote
    var f = false;  //force
    var len = s.length;
    var c,j;
    for (var i=0;i<len;i++){
        c =  s[i];
        if(c===' ')continue;
        if(c===d){r.push("");continue}
        if(c===q){f=true;i++}
        j=i;
        if(f)while(j<len && s[j]!==q || s[j]===q && s[j+1]===q){
            if(s[j]===q && s[j+1]===q)j++;
            j++;
        }else{
            while(j<len && s[j]!==d)j++;
            while(j>i && s[j-1]===' ')j--;
        }
        r.push(s.substring(i,j).replace(/""/g,'"'));
        if (f) j++;
        i=j;
        f=false;
    }return r;
})
}


loadcsv  = function(file){
  let df=[]
  let fileSize = file.size
  let offset =  0 
  var reader = new FileReader();
  reader.onloadend =e=>{ 
    result = e.target.result
    increment = CHUNK_SIZE -1
    
    while(result[increment] != '\n' && increment>1 && offset + CHUNK_SIZE <= fileSize) increment--;
    result = result.substring(0,increment)
    offset += increment +1
    df.push(csv_parse(result))
    postMessage(["chunk_loaded", [offset/fileSize, csv_parse(result)]])
    seek()
  };
  

	seek=function () {
      if (offset >= file.size)return postMessage(["chunk_loaded",[1,null]]  );
      reader.readAsText(file.slice(offset, offset + CHUNK_SIZE), "utf-8");
  }

  seek()
}


addEventListener("message",e=>{
	pipe = e.data [0]
	content = e.data [1]
	switch(pipe) {
      case "load_csv": loadcsv(content)
    }
})

