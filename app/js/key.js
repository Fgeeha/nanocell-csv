let buildKeys = function (){




document.onkeydown = function(e) {
  var k = e.key.toUpperCase(); 
  // console.log(k)
  var ctrlDown  =e.metaKey || e.ctrlKey; 
  var alt = e.altKey;
  if (alt && k =="TAB") return; // enable switching window 
  if (ctrlDown && (k==="C" || k==="V"))return;
  if (ctrlDown && (k==="H")) e.preventDefault(); // prevent history pop up 
  if (dom.dialog.isBusy && k==="ESCAPE")return dom.dialog.clear();
  if (dom.dialog.isBusy || sheet.inputing)return; 
  if (e.code==="Space") k = "SPACE";
  if (k==="PAGEUP"    ){ k = "ARROWUP" ;alt= true}
  if (k==="PAGEDOWN"  ){ k = "ARROWDOWN";alt= true}

  if(ctrlDown){
    switch(k) {
      case "ARROWUP"    :sheet.y= 0; sheet.slctRefresh();return;
      case "ARROWRIGHT" :sheet.x= sheet.df.width -1; sheet.slctRefresh();return
      case "ARROWDOWN"  :sheet.y= sheet.df.height -1;sheet.slctRefresh(); return;
      case "ARROWLEFT"  :sheet.x= 0; sheet.slctRefresh();return;
    }
  }
  
  if (e.key.length===1 && !ctrlDown && !e.metaKey ){e.preventDefault();return sheet.input(e.key);}

  for (var c of Object.values(cmd)) 
  if(k===c.k && c.ctrl === ctrlDown && c.shift===e.shiftKey && c.alt===alt){c.run();return e.preventDefault()}

  
  switch(k) {
    case "ARROWUP"    :sheet.y--;sheet.slctRefresh(); return;
    case "ARROWDOWN"  :sheet.y++;sheet.slctRefresh(); return;
    case "ARROWLEFT"  :sheet.x--;sheet.slctRefresh(); return;
    case "ARROWRIGHT" :sheet.x++;sheet.slctRefresh(); return;
    case "TAB"        :e.preventDefault(); sheet.x++;sheet.slctRefresh(); return;
    // case "SHIFT"      :if(!ctrlDown)sheet.slctRange=true;return;
    case "SHIFT"      :sheet.slctRange=true;return;
    case "ENTER"      :sheet.input();return;
    case "BACKSPACE"  :sheet.delete();return;
  }
}

document.onkeyup = function(e){
   var k = e.key.toUpperCase();
   switch(k) {
    case "CONTROL"    :if(e.shiftKey)sheet.slctRange=true;return;
    case "SHIFT"      :sheet.slctRange=false;return;
  }
}



// removes any move action when set on mouse down 
document.addEventListener("mouseup",()=>{document.onmousemove=undefined;});

// prevents text selection
document.addEventListener("mousedown",e=>{e.preventDefault()});

document.addEventListener('copy', function (e) {
  if(sheet.inputing) return ;
  e.preventDefault();
  console.log("copy");
  var clip = sheet.rangeArray().map(r=>r.join('\t')).join('\n');
  e.clipboardData.setData('text/plain', clip);
});

document.addEventListener('paste', function (e) {
  if(sheet.inputing) return ;
  e.preventDefault();
  sheet.paste((e.clipboardData).getData('text').split('\n').map(r=>r.split('\t')));
  sheet.refresh();
});

}
