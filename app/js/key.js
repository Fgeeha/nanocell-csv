

let buildKeys = function () {
  let prevent_dflt_list = ['H', 'N', 'T', 'F', 'O'];// { H: history pop up, N: new window, T: new tab} 
  document.onkeydown = function (e) {
    var k = e.key.toUpperCase();
    // console.log(e)
    var ctrlDown = e.metaKey || e.ctrlKey;
    var alt = e.altKey;
    var shift = e.shiftKey;
    var meta = e.metaKey;
    var inputting = document.activeElement.tagName == "INPUT";
    sheet.slctRange = shift;
    if (ctrlDown && (prevent_dflt_list.includes(k))) { e.preventDefault(); } // prevent : 
    if (dom.dialog.isBusy && k === "ESCAPE") return dom.dialog.clear();
    if (dom.dialog.isLarge) return;
    if (isOSX && k === "S" && meta && shift) return cmd.saveAs.run();
    if (isOSX && k === "S" && meta) return cmd.save.run();
    if (alt && k == "TAB") return; // enable switching window 
    if (ctrlDown && (k === "C" || k === "V")) return; // enables copy paste events
    if (k === "TAB") { e.preventDefault(); } // prevent : all tab events;
    if (inputting && !(ctrlDown && (k === "F" || k === 'S' || k === 'O'))) return; // letting finder and save through
    if (e.code === "Space") k = "SPACE";
    if (k === "PAGEUP") { k = "ARROWUP"; alt = true }
    if (k === "PAGEDOWN") { k = "ARROWDOWN"; alt = true }

    if (ctrlDown) {
      switch (k) {
        case "ARROWUP": sheet.y = 0; sheet.slctRefresh(); return;
        case "ARROWRIGHT": sheet.x = sheet.df.width - 1; sheet.slctRefresh(); return
        case "ARROWDOWN": sheet.y = sheet.df.height - 1; sheet.slctRefresh(); return;
        case "ARROWLEFT": sheet.x = 0; sheet.slctRefresh(); return;
      }
    }

    // any char without control keys will start inputing
    if (e.key.length === 1 && !ctrlDown && !e.metaKey) { e.preventDefault(); return sheet.input(e.key); }

    // prevents the default from any cmd combo
    for (var c of Object.values(cmd))
      if (k === c.k && c.ctrl === ctrlDown && c.shift === shift && c.alt === alt) { c.run(); return e.preventDefault() }


    switch (k) {
      case "ARROWUP": sheet.y--; sheet.slctRefresh(); return;
      case "ARROWDOWN": sheet.y++; sheet.slctRefresh(); return;
      case "ARROWLEFT": sheet.x--; sheet.slctRefresh(); return;
      case "ARROWRIGHT": sheet.x++; sheet.slctRefresh(); return;
      case "TAB": sheet.x++; sheet.slctRefresh(); return;
      case "ENTER": sheet.input(); return;
      case "BACKSPACE": sheet.delete(); return;
    }
  }

  document.onkeyup = function (e) {
    var k = e.key.toUpperCase();
    switch (k) {
      case "CONTROL": if (e.shiftKey) sheet.slctRange = true; return;
      case "SHIFT": sheet.slctRange = false; return;
    }
  }

  document.addEventListener('copy', function (e) {
    var inputting = document.activeElement.tagName == "INPUT";
    if (inputting) return;
    e.preventDefault();
    console.log("copy");
    var clip = sheet.rangeArray().map(r => r.join('\t')).join('\n');
    e.clipboardData.setData('text/plain', clip);
  });

  document.addEventListener('cut', function (e) {
    var inputting = document.activeElement.tagName == "INPUT";
    if (inputting) return;
    e.preventDefault();
    console.log("cut");
    var clip = sheet.rangeArray().map(r => r.join('\t')).join('\n');
    e.clipboardData.setData('text/plain', clip);
    sheet.rangeEdit('');
    sheet.refresh();
  });

  document.addEventListener('paste', function (e) {
    var inputting = document.activeElement.tagName == "INPUT";
    if (inputting) return;
    e.preventDefault();
    sheet.paste((e.clipboardData).getData('text').split('\n').map(r => r.split(/[\t,]+/)));
    sheet.refresh();
  });

}
