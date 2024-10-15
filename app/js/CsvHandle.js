class CsvHandle {
  constructor() {
    this.handle = null;
    this.file = null;
    this.file_chunks = null;
    this.viewOnly = false;
    this.sw = new Worker("js/sw_read_write_csv.js");
    this.sw.addEventListener("message", e => {
      let d = e.data
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
    if (d.status >= 1 && d.chunk != null) this.readSuccess();
  }


  readSuccess() {
    let matrix = this.file_chunks.flat(1);
    sheet = new Sheet(new Dataframe(matrix))
    sheet.df.isSaved = true;
    sheet.df.lock = this.viewOnly;
    dom.content.innerHTML = "";
    dom.content.appendChild(sheet);
  }


  read(file) {
    this.file = file;
    this.file_chunks = [];
    let mbSize = file.size / 1000000
    this.viewOnly = mbSize > Number(stg.editMaxFileSize);
    console.log(file)
    console.log("view only = ", file.viewOnly, "(file size = ", mbSize, " & stg max = ", stg.editMaxFileSize, " )")
    this.pipe("read", { file: file, viewOnly: this.viewOnly })
  }


  pipe(cmd, data) { this.sw.postMessage({ cmd: cmd, data: data }) }




  async open() {
    let [fileHandle] = await window.showOpenFilePicker(CsvHandle.pickerOptions);
    const newWindow = window.open('./home.html', null, 'width=600,height=400'); // 'newWindow.html' should be the page that will handle the file
    const channel = new MessageChannel();
    newWindow.onload = () => {
      newWindow.postMessage({ fileHandle }, '*', [channel.port2]);
    };

  }

  new() { window.open('./home.html', null, 'width=600,height=400') }

  async saveAs() {
    if(this.viewOnly) return ;
    this.handle = await window.showSaveFilePicker(CsvHandle.pickerOptions);
    this.save();
  }
  async save() {
    if(this.viewOnly) return ;
    if (this.handle === null) this.saveAs();
    else {
      const writableStream = await this.handle.createWritable();
      await writableStream.write(CsvHandle.from2D(sheet.df.data));
      await writableStream.close();
      sheet.df.isSaved = true;
      sheet.refresh();
    }

  }


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


