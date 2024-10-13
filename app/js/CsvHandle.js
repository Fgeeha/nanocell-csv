class CsvHandle {
  constructor() {
    // this.df   = new Dataframe();
    this.handle = null;
    this.file = null;
    this.file_chunks = null;
    this.viewOnly = false;
    this.sw = new Worker("js/sw_read_write_csv.js");
    this.sw.addEventListener("message", e => {
      let d = e.data
      // console.log( e.data)
      switch (d.cmd) {
        case "chunk_loaded": this.file_chunk_loaded(d)
      }
    })
  }

  async launchFile(handle) {
    this.handle = handle;
    this.file = await handle.getFile();
    document.title = this.file.name;
    console.log("Loading : ", this.file.name)
    this.read(this.file)


  }


  file_chunk_loaded(d) {
    document.getElementById("footerCenter").innerHTML = Math.round(d.status * 100) + "%"
    if (d.chunk != null) this.file_chunks.push(d.chunk)
    overview = new Overview(this.file, d);
    if (d.status >= 1 && d.chunk != null) this.readSuccess();
  }


  readSuccess() {
    let matrix = this.file_chunks.flat(1);
    sheet = new Sheet(new Dataframe(matrix))
    dom.content.innerHTML = "";
    dom.content.appendChild(sheet);
    // document.title = this.file.name;

    // sheet.reload();
  }


  read(file) {
    this.file = file;
    this.file_chunks = [];
    let mbSize = file.size / 1000000
    let viewOnly = mbSize > Number(stg.editMaxFileSize);
    console.log(file)
    console.log("view only = ", file.viewOnly, "(file size = ", mbSize, " & stg max = ", stg.editMaxFileSize, " )")
    // console.log ("view only = ",file. viewOnly)
    this.pipe("read", { file: file, viewOnly: viewOnly })
  }


  pipe(cmd, data) { this.sw.postMessage({ cmd: cmd, data: data }) }




  async open() {
    let [fileHandle] = await window.showOpenFilePicker(CsvHandle.pickerOptions);
    // const file = await fileHandle.getFile();
    const newWindow = window.open('./home.html', null, 'width=600,height=400'); // 'newWindow.html' should be the page that will handle the file
    const channel = new MessageChannel();
    newWindow.onload = () => {
      newWindow.postMessage({ fileHandle }, '*', [channel.port2]);
    };

  }

  new() { window.open('./home.html', null, 'width=600,height=400') }

  async saveAs() {
    this.handle = await window.showSaveFilePicker(CsvHandle.pickerOptions);
    this.save();



  }
  async save() {

    if (this.handle === null) this.saveAs();
    else {
      const writableStream = await this.handle.createWritable();
      await writableStream.write(CsvHandle.from2D(sheet.df.data));
      await writableStream.close();
      sheet.df.isSaved = true
    }
  }


// TODO  need to pass writer to this function, and write row per row  (then needs to be written block by block by the worker for large files)
  static from2D(matrix) {
    let sep = stg.delimiter;
    if (sep == "TAB") sep = '\t';
    var newMat = [];
    for (var row of matrix) {
      var newRow = [];
      for (var cell of row) {
        var data = cell;
        var quote = false;
        for (var i = 0; i < data.length; i++) {
          if (data[i] === ",") quote = true;
          if (data[i] === '"') { quote = true; data = data.slice(0, i) + '"' + data.slice(i); i++ }
        }
        if (quote) data = '"' + data + '"';
        newRow.push(data);
      }
      newMat.push(newRow.join(sep));
    }
    return newMat.join('\n');
  }


}







Object.defineProperty(CsvHandle, 'pickerOptions', {
  value: {
    types: [
      {
        description: "csv (Comma Separated Value) ",
        accept: { "text/csv": [".csv", ".tsv"] }

      },
    ]
  }
});


