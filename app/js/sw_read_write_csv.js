// const  CHUNK_SIZE = 1000000 ; // = 1 Mo
const  CHUNK_SIZE = 1000 ; // = 1 Ko

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
  console.log("sw loading : ", file.name)

  // let df=[]
  let fileSize = file.size
  let offset =  0 
  let iteration = 0;
  var reader = new FileReader();
  
  reader.onloadend =e=>{ 
    iteration ++;
    let result = e.target.result
    console.log(result)
    let increment = CHUNK_SIZE -1
    

    while(result[increment] != '\n' && increment>1) increment--;
    if (increment>1 && result.length + offset < fileSize){
      result = result.substring(0,increment);
      for (var i = 0; i < result.length; i++)  if (result.charCodeAt(i)>127) offset++;
    

      offset += increment +1;




    }else{
      offset = fileSize;
    }
    // df.push(csv_parse(result))
    console.log(offset, "/", fileSize)

    let matrix = csv_parse(result);
 
    postMessage({
      cmd       : "chunk_loaded",
      status    : offset/fileSize,
      chunk     : matrix

    })

      // ["chunk_loaded", [offset/fileSize, csv_parse(result)]]


    if (offset/fileSize < 1) seek()
  };
  

	seek=function () {reader.readAsText(file.slice(offset, offset + CHUNK_SIZE), "utf-8");}
  seek()
}


addEventListener("message",e=>{
	switch(e.data.cmd) {
      case "read": loadcsv(e.data.data)
    }
})

