// const  CHUNK_SIZE = 1000000 ; // = 1 Mo
const  CHUNK_SIZE = 5000 ; // = 1 Ko
const  n_chars_for_separator_detection = 50; 

separatorDetection= function (txt){
  if (txt.length > n_chars_for_separator_detection) txt = txt.substring(0, n_chars_for_separator_detection)
  d = [',','\t',';',':']
  n = [ 0 , 0  , 0 , 0 ]
  for (var i = 0; i < txt.length; i++) {
    for (var j = 0; j < d.length; j++) {
      if (txt[i]==d[j]) n[j]++;
    }
  }
  return d[n.indexOf(Math.max(...n))]
}


csv_parse = function(txt, d = ","){
  return  txt.split(/[;\r]?\n/).map(s=>{
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

initColInfo=function(h=""){
  return {
    header      : h,
    count_null  : 0,
    count_num   : 0,
    count_txt   : 0,
    total_sum   : 0,
    distinct_value : [],
    distinct_count : []
  }
}


addChunkStats = function  (m, info){
    let first_chunk = info.length < 1
    if (first_chunk){
      for (var x = 0; x < m[0].length; x++) {
        info[x] = initColInfo(m[0][x])
      }

    }
      
    for (var y = 0; y < m.length; y++) {
      let row = m[y];
      for (var x = 0; x < row.length; x++) {
        if (info[x]===undefined) info[x] = initColInfo()
        let d = row[x];
        let n = Number(d);
        if (d=="")info[x].count_null++;
        else if (n){
          info[x].count_num++;
          info[x].total_sum+= n;
        }else{
          info[x].count_txt++;
        }

        if (d!="" && info[x].distinct_value.length < 30){
          let idx = info[x].distinct_value.indexOf(d);
          if (idx>=0) info[x].distinct_count[idx]++;
          else{
            info[x].distinct_value.push(d);
            info[x].distinct_count.push(1);
          } 
        }

        
      }
    }
    return info
  } 



loadcsv  = function(data){
  let file = data.file;
  console.log("sw loading : ", file.name)
  console.log(file)
  let viewOnly = data.viewOnly;
  let fileSize = file.size;
  let offset =  0 
  let iteration = 0;
  let sep = ';'
  let rowCount = 0 ;
  let prepend = "";
  let reader = new FileReader();
  let statistics = []

  reader.onloadend =e=>{ 
    iteration ++;
    let result = e.target.result;
    let status = offset/fileSize;
    if(iteration == 1)sep = separatorDetection(result);
    else result = prepend + result;
    if (status <1){
      let increment = result.length -1
      while(result[increment] != '\n' && increment>0) increment--;
      if (increment>0){

      prepend = result.slice( increment +1)
      result = result.slice(0,increment)
      }else{
        prepend = prepend + result;
        return seek()
      }
    }
    // console.log(offset, "/", fileSize)
    let matrix = csv_parse(result,sep);
    statistics = addChunkStats(matrix,statistics)
    rowCount += matrix.length;
    postMessage({
      cmd       : "chunk_loaded",
      status    : status,
      chunk     : (iteration==1 || !viewOnly )? matrix:null,
      stats     : statistics,
      chunk_id  : iteration,
      viewOnly  : viewOnly,
      sep       : sep,
      rowCount  : rowCount
    })
    if(viewOnly && iteration==1) sendFinalChunk(file, sep, viewOnly)

    if (offset/fileSize < 1) seek()
  };
  

	seek=function () {
    reader.readAsText(file.slice(offset, offset + CHUNK_SIZE), "utf-8");
    offset+= CHUNK_SIZE;
  }
  seek()
}


sendFinalChunk = function (file, sep, viewOnly){
    console.log("========== === = = = = ==sending final chunk")
    let endReader = new FileReader();
    endReader.onloadend =e=>{ 
      let result = e.target.result;
      let matrix = csv_parse(result, sep);
      matrix[0] = []
      for (var i = 0; i < matrix[1].length; i++) {
        matrix[0].push("! [...] !")
      }
      postMessage({
        cmd       : "chunk_loaded",
        status    : 1,
        chunk     : matrix,
        stats     : null,
        chunk_id  : null,
        viewOnly  : viewOnly,
        sep       : sep,
        rowCount  : null
      })
    }

    endReader.readAsText(file.slice(file.size - CHUNK_SIZE, file.size), "utf-8");
}



addEventListener("message",e=>{
	switch(e.data.cmd) {
      case "read": loadcsv(e.data.data)
    }
})

