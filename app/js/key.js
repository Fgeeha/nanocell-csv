let LBT = undefined;
let RBT = undefined;


let buildKeys = function (){
  let prevent_dflt_list = ['H','N', 'T'];// { H: history pop up, N: new window, T: new tab} 
  document.onkeydown = function(e) {
  var k = e.key.toUpperCase(); 
  // console.log(k)
  var ctrlDown  =e.metaKey || e.ctrlKey; 
  var alt = e.altKey;
  var shift = e.shiftKey;
  sheet.slctRange = shift;
  if (alt && k =="TAB") return; // enable switching window 
  if (ctrlDown && (k==="C" || k==="V"))return;
  if (ctrlDown && (prevent_dflt_list.includes(k))  ) {e.preventDefault(); console.log("prevented : ", k) } // prevent : 
  if (k==="TAB" ) {e.preventDefault(); } // prevent : 
  if (!dom.dialog.isBusy && k==="ESCAPE")return dom.dialog.clear();
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
  
  // any char without control keys will start inputing
  if (e.key.length===1 && !ctrlDown && !e.metaKey ){e.preventDefault();return sheet.input(e.key);}

  // prevents the default from any cmd combo
  for (var c of Object.values(cmd)) 
  if(k===c.k && c.ctrl === ctrlDown && c.shift===shift && c.alt===alt){c.run();return e.preventDefault()}

  
  switch(k) {
    case "ARROWUP"    :sheet.y--;sheet.slctRefresh(); return;
    case "ARROWDOWN"  :sheet.y++;sheet.slctRefresh(); return;
    case "ARROWLEFT"  :sheet.x--;sheet.slctRefresh(); return;
    case "ARROWRIGHT" :sheet.x++;sheet.slctRefresh(); return;
    case "TAB"        :sheet.x++;sheet.slctRefresh(); return;
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
document.addEventListener("mouseup",e=>{
  document.onmousemove=undefined; 
  if(e.buttons < 1){
    // sheet.scrolling = false;
    LBT = undefined;
    RBT = undefined;
  }
});


// prevents text selection
document.addEventListener("mousedown",e=>{
  if(e.button===0) LBT = e.target;
  if(e.button===2) RBT = e.target;
  // if (!e.shiftKey)sheet.slctRange=false;
  if(e.target != sheet.inputField) e.preventDefault(); // prevents text selection
  // if(e.target === dom.content.scroller) sheet.scrolling = true;




  });


document.addEventListener("mousemove", e => {
    {

      if(e.buttons < 1){
        // sheet.scrolling = false;
        LBT = undefined;
        RBT = undefined;
      }
      if(LBT ===dom.content.scrollerY) {
        let offset = sheet.rows[1].getBoundingClientRect().top;
        let theight = sheet.getBoundingClientRect().bottom - offset ;
        let r = (e.clientY -offset )  /  theight ;
        if(r < 0 ) r  = 0;
        if(r > 1 ) r  = 1;
        sheet.baseY  = Math.floor(sheet.df.height * r);
        sheet.slctRefresh(false);
      } else if(e.buttons>0 ){
        let rect = sheet.getBoundingClientRect();
        if (e.clientY <= rect.top){ 
          sheet.rangeEnd.y = sheet.baseY+1;
          sheet.baseY--;
        }
        if (e.clientX >= rect.right - 5){ 
          sheet.rangeEnd.x = sheet.baseX + sheet.width-2;
          sheet.baseX++;
        }
        if (e.clientY >= rect.bottom){ 
          sheet.rangeEnd.y = sheet.baseY + sheet.height-2;
          sheet.baseY++;
        }
        if (e.clientX <= rect.left + 5){ 
          sheet.rangeEnd.x = sheet.baseX +1 ;
          sheet.baseX--;
        }
      } 
      sheet.slctRefresh(false);
    }
});

document.addEventListener('copy', function (e) {
  if(sheet.inputing) return ;
  e.preventDefault();
  console.log("copy");
  var clip = sheet.rangeArray().map(r=>r.join('\t')).join('\n');
  e.clipboardData.setData('text/plain', clip);
});

document.addEventListener('cut', function (e) {
  if(sheet.inputing) return ;
  e.preventDefault();
  console.log("cut");
  var clip = sheet.rangeArray().map(r=>r.join('\t')).join('\n');
  e.clipboardData.setData('text/plain', clip);
  sheet.rangeEdit('');
  sheet.refresh();
});

document.addEventListener('paste', function (e) {
  if(sheet.inputing) return ;
  e.preventDefault();
  sheet.paste((e.clipboardData).getData('text').split('\n').map(r=>r.split(/[\t,]+/)));
  sheet.refresh();
});

}
