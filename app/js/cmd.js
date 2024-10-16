var cmd = {
    about       :{k:"H"    ,ctrl:true, run(){chrome.app.window.create('about.html', {id: "NanoCell-about"})}, description:"About"},
    new         :{k:"N"    ,ctrl:true, run(){csvHandle.new()}, description:"New sheet"},
    deleteRow   :{k:"BACKSPACE",ctrl:true, run(){sheet.df.deleteRow(sheet.y);sheet.refresh()}, description:"Delete Row"},
    deleteCol   :{k:"BACKSPACE",ctrl:true,shift:true, run(){sheet.df.deleteCol(sheet.x);sheet.refresh()}, description:"Delete Col"},
    delete      :{k:"BACKSPACE",run(){sheet.rangeEdit('');sheet.refresh() }, description:"Delete Selection"},
    delete2      :{k:"DELETE",run(){sheet.rangeEdit('');sheet.refresh() }, description:"Delete Selection"},
    settings    :{k:"G"    ,ctrl:true, run(){Setting.show()}, description:"Display Settings"},
    shortcuts   :{k:"K"    ,ctrl:true, run(){new Shortcuts()}, description:"Display Shortcuts"},
    slctAll     :{k:"A"    ,ctrl:true, run(){sheet.slctAll()}, description:"Select All"},
    transpose   :{k:"T"    ,ctrl:true, run(){sheet.rangeTranspose();sheet.refresh()}, description:"Transpose Selection"},
    trim        :{k:"T"    ,ctrl:true, shift:true, run(){sheet.df.trimAll();sheet.refresh()}, description:"Trim : remove all empty rows/cols"},
    integer     :{k:"I"    ,ctrl:true, run(){sheet.round(true);sheet.refresh()}, description:"Round selection to integer"},
    decimal     :{k:"$"    ,ctrl:true, run(){sheet.round(false);sheet.refresh()}, description:"Round selection to decimal"},
    fixTop      :{k:"B"    ,ctrl:true, run(){sheet.fixTop = !sheet.fixTop;sheet.refresh()}, description:"Fix Header Top"},
    fixLeft     :{k:"B"    ,ctrl:true, shift:true, run(){sheet.fixLeft = !sheet.fixLeft;sheet.refresh()}, description:"Fix Header Left"},
    undo        :{k:"Z"    ,ctrl:true, run(){sheet.df.undo();sheet.refresh()}, description:"Undo"},
    redo        :{k:"Z"    ,ctrl:true, shift:true, run(){sheet.df.redo();sheet.refresh()}, description:"Redo"},
    redo2       :{k:"Y"    ,ctrl:true, run(){sheet.df.redo();sheet.refresh()}, description:"Redo"},
    date        :{k:"D"    ,ctrl:true, run(){sheet.rangeEdit( (new Date()).getFormated("yyyy-mm-dd") );sheet.refresh() }, description:"Insert today's date"},
    find        :{k:"F"    ,ctrl:true, run(){sheet.finder.findMenu()}, description:"Quick find / match"},
    findAdvanced:{k:"F"    ,ctrl:true, shift:true,run(){sheet.finder.findMenu(true)}, description:"Advanced find / replace"},
    msg         :{k:"M"    ,ctrl:true, run(){logVersion() }, description:"..."},
    open        :{k:"O"    ,ctrl:true, run(){csvHandle.open()}, description:"Open a CSV file from the file finder"},
    save        :{k:"S"    ,ctrl:true, run(){csvHandle.save()}, description:"Save"},
    saveAs      :{k:"S"    ,ctrl:true, shift:true, run(){csvHandle.saveAs()}, description:"Save As"},
    reloadFile  :{k:"R"    ,ctrl:true, run(){csvHandle.reloadFile()}, description:"Reload file from last save"},
    expand      :{k:"E"    ,ctrl:true, run(){sheet.expand()}, description:"Expand first row to selection"},
    
    shiftUp     :{k:"ARROWUP"    ,alt:true, run(dir){sheet.shift(0)}, description:"Shift row up"},
    shiftDown   :{k:"ARROWDOWN"  ,alt:true, run(dir){sheet.shift(2)}, description:"Shift row down"},
    shiftRight  :{k:"ARROWRIGHT" ,alt:true, run(dir){sheet.shift(1)}, description:"Shift col right"},
    shiftLeft   :{k:"ARROWLEFT"  ,alt:true, run(dir){sheet.shift(3)}, description:"Shift col left"},


    insertUp     :{k:"ARROWUP"    ,alt:true, shift:true, run(dir){sheet.insert(0)}, description:"Insert row above"},
    insertDown   :{k:"ARROWDOWN"  ,alt:true, shift:true, run(dir){sheet.insert(2)}, description:"Insert row below"},
    insertRight  :{k:"ARROWRIGHT" ,alt:true, shift:true, run(dir){sheet.insert(1)}, description:"Insert col right"},
    insertLeft   :{k:"ARROWLEFT"  ,alt:true, shift:true, run(dir){sheet.insert(3)}, description:"Insert col left"},

    scrollLeft   :{k:"scroll ARROWUP "  ,alt:true,  description:"Scroll left"},
    scrollRight   :{k:"scroll ARROWDOWN "  ,alt:true,  description:"Scroll right"},


}


function buildCommands(){
  for (var c of Object.values(cmd)){
      if(!c.ctrl)c.ctrl=false;
      if(!c.shift)c.shift=false;
      if(!c.alt)c.alt=false;
  } 
}


function buildMenu(){
  var menuItems = [
  "new","open","save" , "reloadFile","",
  "undo","redo","fixLeft","fixTop","transpose","trim","date","integer","decimal",
  "","find","about","settings","shortcuts"];
  function buildMenuItem(item){ 
      if (item==="")return dom.header.appendChild(document.createElement("hr"));   
      var img = document.createElement("img");
      img.src = "icn/menu/"+item+".svg";
      img.setAttribute("title",item);

      img.addEventListener("click",function(){cmd[item].run()})
      dom.header.appendChild(img);   
  }
  for (var m of menuItems )buildMenuItem(m); 

}









