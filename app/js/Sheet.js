class Sheet extends HTMLTableElement {
  constructor(df = new Dataframe()) {
    super();
    this.df = df;
    this.finder = new Finder(this);
    this.inputField = document.createElement("input");
    this.inputing = false;
    // this.scrolling = false;
    this.escape = false;
    this.fixTop = false;
    this.fixLeft = false;
    this.slctRange = false;
    this.rangeEnd = undefined;
    this.xx = 0;
    this.yy = 0;
    this.bx = 0;
    this.by = 0;
    this.addEventListener("mousewheel", this.scroll, { passive: true });
    // this.addEventListener("mousedown", this.click);
    // this.addEventListener("dblclick", this.dblclick);
    this.inputField.addEventListener("focusout", e => { this.inputBlur() });
    this.inputField.addEventListener("keydown", e => {
      switch (e.key.toUpperCase()) {
        case "ENTER": e.stopPropagation(); e.preventDefault(); this.inputField.blur(); this.y++; this.slctRefresh(); this.refresh(); break;
        case "TAB": e.stopPropagation(); e.preventDefault(); this.inputField.blur(); this.x++; this.slctRefresh(); this.refresh(); break;
        case "ESCAPE": this.escape = true; sheet.inputField.blur(); break;
      }
    });
    this.colResize = undefined;
    this.x = 0;
    this.classList.add('sheet');
    dom.content.innerHTML = "";
    dom.content.appendChild(this);
    dom.content.appendChild(dom.content.scrollerY);
    dom.content.appendChild(dom.content.scrollerX);
    this.reload();
  }


  get x() { return this.xx }
  get y() { return this.yy }
  get width() { return this.rows[0] ? this.rows[0].cells.length - 1 : 0 }
  get height() { return this.rows.length - 1 }
  get baseX() { return this.bx }
  get baseY() { return this.by }
  set baseX(n) {
    if (n < 0) n = 0;
    if (n >= this.df.width) n = this.df.width - 1;
    var delta = n - this.bx;
    this.bx = n;
    switch (delta) {
      case 0: break;
      // case 1: this.scrollOneRight(); break;
      // case -1: this.scrollOneLeft(); break;
      default: this.refresh();
    }
  };

  set baseY(n) {
    if (n < 0) n = 0;
    if (n >= this.df.height) n = this.df.height - 1;
    var delta = n - this.by;
    this.by = n;
    switch (delta) {
      case 0: break;
      // case 1: this.scrollOneDown(); break;
      // case -1: this.scrollOneUp(); break;
      default: this.refresh();
    }
  };

  set x(n) {
    if (this.inputing) this.inputBlur();
    if (!this.slctRange) this.rangeEnd = undefined;
    if (n >= this.df.width + this.width - 1) n = this.df.width + this.width - 2;
    if (this.slctRange && !this.rangeEnd) this.rangeEnd = { x: this.x, y: this.y };
    this.xx = n < 0 ? 0 : n;
  }
  set y(n) {
    if (this.inputing) this.inputBlur();
    if (!this.slctRange) this.rangeEnd = undefined;
    if (n >= this.df.height + this.height - 1) n = this.df.height + this.height - 2;
    if (this.slctRange && !this.rangeEnd) this.rangeEnd = { x: this.x, y: this.y };
    this.yy = n < 0 ? 0 : n;
  }


  sort(n, ascending) {
    let col_items = this.df.data.map(row => row[n]).map((val, idx) => ({ val, idx }))

    if (stg.sort_header) col_items.shift();

    let numbers = [];
    let strings = [];
    let empty = [];
    col_items.forEach(item => {
      const parsedNumber = parseFloat(item.val);
      if (item.val.length < 1) empty.push(item.idx);
      else if (!isNaN(parsedNumber) && isFinite(parsedNumber)) numbers.push({ val: parsedNumber, idx: item.idx });
      else strings.push(item);
    });

    let str_ordered = strings.sort((a, b) => (ascending) ? a.val.localeCompare(b.val) : b.val.localeCompare(a.val)).map(({ idx }) => idx);
    let num_ordered = numbers.sort((a, b) => (ascending) ? a.val - b.val : b.val - a.val).map(({ idx }) => idx);
    let new_order = stg.sort_num_first ? num_ordered.concat(str_ordered) : str_ordered.concat(num_ordered);

    new_order.concat(empty);
    if (stg.sort_header) new_order.unshift(0);
    this.df.order(new_order)
    this.refresh();

  }



  go_to_next() {
    var d = this.df.get(this.x, this.y);
    var i = this.x;
    var j = this.y;
    var found = false;
    while (!found) {
      i = (i + 1) % this.df.width;
      if (i === 0) j = (j + 1) % this.df.height;
      found = (this.df.get(i, j) == d)
    }

    if (i == this.x && j == this.y) Msg.quick("No match");
    else {
      this.x = i;
      this.y = j;
      this.slctRefresh();
    }
  }

  validate_data() {
    var dot = stg.dv_comma_num;
    var dash = stg.dv_comma_txt;
    var single_quote = stg.dv_quotes;
    var lower = stg.dv_lower;
    this.allApply((x, y) => {
      var d = this.df.get(x, y);
      if (d.length < 1 || !isNaN(d)) return;
      if (dot) {
        var numberTry = d.replace(',', '.');
        if (!isNaN(numberTry)) return this.df.edit(x, y, numberTry);
      }
      if (dash) d = d.replaceAll(',', '-');
      if (single_quote) d = d.replaceAll('\"', '\'');
      if (lower) d = d.toLowerCase();
      this.df.edit(x, y, d);
    })
    this.refresh();
  }

  rangeOrdered() {
    if (this.rangeEnd === undefined) return;
    var xStart = Math.min(this.x, this.rangeEnd.x);
    var yStart = Math.min(this.y, this.rangeEnd.y);
    var xEnd = Math.max(this.x, this.rangeEnd.x);
    var yEnd = Math.max(this.y, this.rangeEnd.y);
    return { xmin: xStart, xmax: xEnd, ymin: yStart, ymax: yEnd };
  }


  expand() {
    if (this.rangeEnd === undefined) return;
    let r = this.rangeOrdered();
    if (r.ymin == r.ymax) {
      var base0 = this.df.get(r.xmin, r.ymin)
      var base1 = this.df.get(r.xmin + 1, r.ymin)
      var baseN0 = Number(base0);
      var baseN1 = Number(base1);
      var d = baseN1 - baseN0;
      if (isNaN(baseN1) && !isNaN(baseN0)) d = 1;
      if (base0 == "" && base1 == "") d = 1;
      if (isNaN(d)) for (var j = r.xmin; j <= r.xmax; j++) this.df.edit(j, this.y, base0)
      else for (var j = r.xmin; j <= r.xmax; j++) this.df.edit(j, this.y, baseN0 + d * (j - r.xmin))
      return this.refresh()
    }

    var delta = []
    for (var i = r.xmin; i <= r.xmax; i++) {
      var base0 = this.df.get(i, r.ymin)
      // if (base0 =="") continue;
      var base1 = this.df.get(i, r.ymin + 1)
      var baseN0 = Number(base0);
      var baseN1 = Number(base1);
      var d = baseN1 - baseN0;
      if ((isNaN(baseN1) || base1 == "") && !isNaN(baseN0)) d = 1;
      if (isNaN(d)) for (var j = r.ymin; j <= r.ymax; j++) this.df.edit(i, j, base0)
      else for (var j = r.ymin; j <= r.ymax; j++) this.df.edit(i, j, baseN0 + d * (j - r.ymin))
      this.refresh()
    }
  }



  slctAll() {
    this.x = 0; this.y = 0; this.rangeEnd = { x: this.df.width - 1, y: this.df.height - 1 }; this.slctRefresh(false)
  }

  // scrollOneLeft() {
  //   for (var y = 0; y < this.rows.length; y++) {
  //     var r = this.rows[y];
  //     var c = r.cells[r.cells.length - 1];
  //     if (y > 0) this.loadCell(c, this.baseX, this.baseY + y - 1);
  //     r.insertBefore(c, r.cells[1]);
  //   }
  //   let header_value = this.df.get(this.baseX + 1, 0)
  //   this.rows[0].cells[1].innerHTML = (this.fixTop && header_value != "") ? header_value : this.baseX + 1;
  // }

  // scrollOneRight() {
  //   let header_value = this.df.get(this.baseX + this.width, 0)
  //   this.rows[0].cells[1].innerHTML = (this.fixTop && header_value != "") ? header_value : this.baseX + this.width;
  //   for (var y = 0; y < this.rows.length; y++) {
  //     var r = this.rows[y];
  //     var c = r.cells[1];
  //     if (y > 0) this.loadCell(c, this.baseX + this.width - 1, this.baseY + y - 1);
  //     r.appendChild(c);
  //   }
  // }

  // scrollOneUp() {
  //   var r = this.rows[this.rows.length - 1];
  //   for (var x = 1; x < r.cells.length; x++)  this.loadCell(r.cells[x], this.baseX + x - 1, this.baseY);
  //   let header_value = this.df.get(0, this.baseY + 1)
  //   r.cells[0].innerHTML = (this.fixLeft && header_value != "") ? header_value : this.baseY + 1;
  //   this.insertBefore(r, this.rows[1]);
  // }

  // scrollOneDown() {
  //   var r = this.rows[1];
  //   for (var x = 1; x < r.cells.length; x++) this.loadCell(r.cells[x], this.baseX + x - 1, this.baseY + this.height - 1);
  //   let header_value = this.df.get(0, this.baseY + this.height)
  //   r.cells[0].innerHTML = (this.fixLeft && header_value != "") ? header_value : this.baseY + this.height;
  //   this.appendChild(r);
  // }

  shift(direction) {
    if (this.rangeEnd == undefined) {

      switch (direction) {
        case 0: this.df.shiftRow(this.y - 1); this.y--; break;
        case 1: this.df.shiftCol(this.x); this.x++; break;
        case 2: this.df.shiftRow(this.y); this.y++; break;
        case 3: this.df.shiftCol(this.x - 1); this.x--; break;
      }
    } else {

      let r = this.rangeOrdered();
      let bux = this.rangeEnd.x;
      let buy = this.rangeEnd.y;
      switch (direction) {
        case 0: for (var y = r.ymin; y <= r.ymax; y++) this.df.shiftRow(y - 1); this.y--; this.rangeEnd = { x: bux, y: buy - 1 }; break;
        case 3: for (var x = r.xmin; x <= r.xmax; x++) this.df.shiftCol(x - 1); this.x--; this.rangeEnd = { x: bux - 1, y: buy }; break;

        case 1: for (var x = r.xmax; x >= r.xmin; x--) this.df.shiftCol(x); this.x++; this.rangeEnd = { x: bux + 1, y: buy }; break;
        case 2: for (var y = r.ymax; y >= r.ymin; y--) this.df.shiftRow(y); this.y++; this.rangeEnd = { x: bux, y: buy + 1 }; break;
        // case 3: this.df.shiftCol(this.x - 1); this.x--; break;
        // case 1: this.df.shiftCol(this.x); this.x++; break;
        // case 2: this.df.shiftRow(this.y); this.y++; break;
      }
    }
    this.refresh();
    this.slctRefresh();
  }

  insert(direction) {
    switch (direction) {
      case 0: this.df.insertRow(this.y); this.y++; break;
      case 1: this.df.insertCol(this.x + 1); break;
      case 2: this.df.insertRow(this.y + 1); break;
      case 3: this.df.insertCol(this.x); this.x++; break;
    }
    this.refresh();
    this.slctRefresh();
  }

  input(txt) {
    // if (!this.slct) return;
    let cell = this.bestInputCell();
    if (cell === undefined) return;
    this.inputing = true;
    this.inputField.value = txt ? txt : this.df.get(this.x, this.y);
    // this.showInputField();
    cell.appendChild(this.inputField);
    this.inputField.focus();
  }

  bestInputCell() {
    // try{
    // this.rows[this.y - this.baseY + 1].cells[this.x - this.baseX + 1].appendChild(this.inputField);
    //    }catch (e) {

    if (this.cellInView(this.x, this.y)) return this.rows[this.y - this.baseY + 1].cells[this.x - this.baseX + 1]

    if (this.rangeEnd) {

      let viewEnd = { x: this.baseX + this.width, y: this.baseY + this.height };
      let viewStart = { x: this.baseX, y: this.baseY };
      var rx = undefined;
      var ry = undefined;
      let r = this.rangeOrdered();

      if (viewStart.y < r.ymin && viewEnd.y > r.ymin) ry = r.ymin;
      if (viewStart.y > r.ymin && viewStart.y <= r.ymax) ry = viewStart.y;
      if (viewStart.x < r.xmin && viewEnd.x > r.xmin) rx = r.xmin;
      if (viewStart.x > r.xmin && viewStart.x <= r.xmax) rx = viewStart.x;

      if (rx !== undefined && ry !== undefined) return this.rows[ry - this.baseY + 1].cells[rx - this.baseX + 1]
    }
    return undefined;
  }

  cellInView(x, y) {
    return x >= this.baseX && y >= this.baseY && x < this.baseX + this.width && y < this.baseY + this.height

  }


  inputBlur() {
    var e = this.inputField.value;
    if (!this.escape) {
      this.rangeEdit(e);
      if (!this.rangeEnd) this.loadCell(this.inputField.parentNode, this.x, this.y);
      else this.refresh();
    }
    this.inputing = false;
    this.escape = false;
    try { this.inputField.remove() } catch (e) { }
  }

  // dblclick(e) {
  //   var t = e.target;
  //   if (t.tagName === "TD") this.input();
  // }


  // click(e) {
  //   var t = e.target;
  //   if (t.tagName == "TD") {
  //     var x = t.cellIndex + this.baseX - 1;
  //     var y = t.parentNode.rowIndex + this.baseY - 1;
  //     if (this.inputing && e.ctrlKey) {
  //       // copies the content of the clicked cell into the editing input field
  //       e.preventDefault();
  //       this.inputField.value += this.df.get(x, y).split('=')[0];
  //       this.inputField.selectionStart = this.inputField.value.length;
  //       return
  //     }
  //     this.x = x;
  //     this.y = y;
  //     this.slctRefresh();
  //   }
  //   if (t.tagName === "TH" && t.cellIndex > 0) this.slctCol(this.baseX + t.cellIndex - 1);
  //   if (t.tagName === "TH" && t.parentNode.rowIndex > 0) this.slctRow(this.baseY + t.parentNode.rowIndex - 1);
  // }


  footerUpdate() {
    var f = dom.footerDiv;
    if (this.rangeEnd) {
      var deltaX = Math.abs((this.rangeEnd.x) - (this.x)) + 1
      var deltaY = Math.abs((this.rangeEnd.y) - (this.y)) + 1
      f.left.innerHTML = (this.x + 1) + ":" + (this.y + 1) + " to " + (this.rangeEnd.x + 1) + ":" + (this.rangeEnd.y + 1) + " (" + deltaX + "x" + deltaY + ")";
    }
    else f.left.innerHTML = (this.x + 1) + ":" + (this.y + 1);
    f.right.innerHTML = this.df.width + ":" + this.df.height;
    f.center.innerHTML = this.df.get(this.x, this.y).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll(' ', '<span style="color:var(--dots)">&bull;</span>');
    f.lock.src = (this.df.isSaved) ? "icn/lock.svg" : "icn/edit.svg";
  }

  scrollbarRefresh() {
    let dfh = this.df.height;
    let dfw = this.df.width;
    let visible_minY = stg.rows / 2;
    let visible_minX = stg.cols - 2;
    let dsy = dom.content.scrollerY;
    let dsx = dom.content.scrollerX;
    dsy.style.display = (dfh < visible_minY) ? "none" : "block";
    dsx.style.display = (dfw < visible_minX) ? "none" : "block";
    if (dfh >= visible_minY) {
      if (dfh < 100) dsy.style.height = "50vh";
      else if (dfh < 1000) dsy.style.height = "20vh";
      else dsy.style.height = "10vh";
      let top = this.rows[1].getBoundingClientRect().top - this.getBoundingClientRect().top;
      let bot = this.getBoundingClientRect().height;
      let theight = bot - top - dsy.offsetHeight;
      dsy.style.top = String(top + Math.round(theight * this.baseY / (this.df.height - 1))) + "px";
    }
    if (dfw >= visible_minX) {

      if (dfw < 30) dsx.style.width = "50vw";
      else if (dfw < 100) dsx.style.width = "20vw";
      else dsx.style.width = "10vw";
      let left = this.rows[0].cells[1].getBoundingClientRect().left;
      let right = this.getBoundingClientRect().right;
      let twidth = right - left - dsx.offsetWidth;
      dsx.style.left = String(left+ Math.round( twidth * this.baseX / (this.df.width - 1))) + "px";
      // dsx.style.top = (bot - dsx.offsetHeight) + "px";
    }


    // console.log(document.getElementById("footer").offsetHeight)
  }

  slctCol(n, m = undefined) {
    this.slctRange = true;
    this.rangeEnd = { x: m !== undefined ? m : n, y: this.df.height - 1 }
    this.x = n;
    this.y = 0;
    this.slctRange = false;
    this.slctRefresh(false);
  }

  slctRow(n, m = undefined) {
    this.slctRange = true;
    this.rangeEnd = { x: this.df.width - 1, y: m !== undefined ? m : n }
    this.x = 0;
    this.y = n;
    this.slctRange = false;
    this.slctRefresh(false);
  }

  rangeArray() {
    if (!this.rangeEnd) return [[this.df.get(this.x, this.y)]];
    var r = this.rangeOrdered();
    var mat = [];
    for (var y = r.ymin; y <= r.ymax; y++) {
      var row = [];
      for (var x = r.xmin; x <= r.xmax; x++)row.push(this.df.get(x, y));
      mat.push(row);
    }
    return mat;
  }
  rangeEdit(value) {
    if (!this.rangeEnd) return this.df.edit(this.x, this.y, value);
    var r = this.rangeOrdered();
    for (var x = r.xmin; x <= r.xmax; x++) for (var y = r.ymin; y <= r.ymax; y++) this.df.edit(x, y, value);

  }

  allApply(cb) {
    for (var y = 0; y < this.df.height; y++) for (var x = 0; x < this.df.width; x++)  cb(x, y);
  }



  rangeApply(cb) {
    if (!this.rangeEnd) return cb(this.x, this.y);
    var r = this.rangeOrdered();
    for (var x = r.xmin; x <= r.xmax; x++) for (var y = r.ymin; y <= r.ymax; y++) cb(x, y);
  }

  rangeTranspose() {
    if (this.df.lock) return;
    if (!this.rangeEnd) return;
    var r = this.rangeArray();
    var t = [];
    for (var x = 0; x < r[0].length; x++) {
      var row = [];
      for (var y = 0; y < r.length; y++) row.push(r[y][x]);
      t.push(row);
    }
    this.rangeEdit('');
    this.paste(t);
  }


  round(integer = true) {
    this.rangeApply((x, y) => {
      var n = this.df.get(x, y);
      if (!isNaN(n) && n !== '') {
        n = Number(n);
        if (!integer) n *= 100;
        n = Math.round(n + Number.EPSILON);
        if (!integer) {
          n /= 100;
          n += 0.001;
          n = Math.round(n * 1000) / 1000;
          n = String(n).slice(0, -1);
        }
      }
      this.df.edit(x, y, n);
    })
  }

  paste(mat) {
    var minX = this.x;
    var minY = this.y;
    if (this.rangeEnd) { minX = Math.min(minX, this.rangeEnd.x); minY = Math.min(minY, this.rangeEnd.y) }
    for (var y = 0; y < mat.length; y++)for (var x = 0; x < mat[y].length; x++)this.df.edit(minX + x, minY + y, mat[y][x]);
  }


  scroll(e) {
    var coef = 16;
    if (e.altKey) this.baseX += (e.deltaY > 0) ? Math.floor(e.deltaY / coef) : Math.ceil(e.deltaY / coef);
    else {
      this.baseX += (e.deltaX > 0) ? Math.floor(e.deltaX / coef) : Math.ceil(e.deltaX / coef);
      this.baseY += (e.deltaY > 0) ? Math.floor(e.deltaY / coef) : Math.ceil(e.deltaY / coef);
    }
    this.refresh();
    this.slctRefresh(false);

  }

  loadCell(c, x, y) {
    c.innerHTML = "";
    var d = this.df.get(x, y);
    if (d.length < 1) return;
    var txt = d.replace('&', '&amp;').replace('<', '&lt;');
    var div = document.createElement("div");
    if (txt[0] === '!') div.classList.add("error");
    if (txt !== '' && !isNaN(txt)) div.classList.add("num");
    div.innerHTML = txt;
    c.appendChild(div)
  }

  loadTopHeader(x) {
    if (this.fixTop && this.df.get(this.baseX + x, 0).length > 0) this.rows[0].cells[x + 1].innerHTML = "<div>" + this.df.get(this.baseX + x, 0) + "</div>";
    else this.rows[0].cells[x + 1].innerHTML = this.baseX + x + 1;
  }

  loadLeftHeader(y) {
    if (this.fixLeft && this.df.get(0, this.baseY + y).length > 0) this.rows[y + 1].cells[0].innerHTML = "<div>" + this.df.get(0, this.baseY + y) + "</div>";
    else this.rows[y + 1].cells[0].innerHTML = this.baseY + y + 1;
  }

  viewRangeRender() {
    var xStart = Math.min(this.x, this.rangeEnd.x) - this.baseX;
    var yStart = Math.min(this.y, this.rangeEnd.y) - this.baseY;
    var xEnd = Math.max(this.x, this.rangeEnd.x) - this.baseX;
    var yEnd = Math.max(this.y, this.rangeEnd.y) - this.baseY;
    if (xStart < 0) xStart = 0;
    if (yStart < 0) yStart = 0;
    if (xEnd >= this.width) xEnd = this.width - 1;
    if (yEnd >= this.height) yEnd = this.height - 1;
    for (var x = xStart; x <= xEnd; x++)
      for (var y = yStart; y <= yEnd; y++)
        this.rows[y + 1].cells[x + 1].classList.add("slct");
    this.footerUpdate();
  }

  isInViewRange(x, y) { return !(x < 0 || y < 0 || x >= this.width || y >= this.height) }


  slctFocus() {
    if (this.x < this.baseX) this.baseX = this.x;
    else if (this.y < this.baseY) this.baseY = this.y;
    else if (this.x >= this.baseX + this.width) this.baseX = this.x - this.width + 1;
    else if (this.y >= this.baseY + this.height) this.baseY = this.y - this.height + 1;
    else return;
  }

  slctClear() { var td; while (td = this.getElementsByClassName('slct')[0]) td.classList.remove('slct'); }

  slctRefresh(focus = true) {
    window.requestAnimationFrame(() => {
      this.slctClear();
      this.scrollbarRefresh();
      if (focus) this.slctFocus();
      if (this.rangeEnd) return this.viewRangeRender();
      var y = this.y - this.baseY;
      var x = this.x - this.baseX;
      if (!this.isInViewRange(x, y)) return;
      this.rows[y + 1].cells[x + 1].classList.add("slct");
      this.footerUpdate();
    })
  }


  // refresh table cells content
  refresh() {
    window.requestAnimationFrame(() => {
      for (var x = 0; x < this.width; x++) this.loadTopHeader(x);
      //   var time = new Timer();
      for (var y = 0; y < this.height; y++) {
        var by = this.baseY + y;
        this.loadLeftHeader(y);
        for (var x = 0; x < this.width; x++)this.loadCell(this.rows[y + 1].cells[x + 1], this.baseX + x, by);
      }
      let cell = this.bestInputCell();
      if (this.inputing) cell.appendChild(this.inputField);
      this.footerUpdate();
    })
  }

  reload() {
    while (this.rows[0]) this.rows[0].remove();
    for (var y = 0; y < stg.rows + 1; y++) {
      var tr = document.createElement("tr");
      this.appendChild(tr);
      for (var x = 0; x < stg.cols + 1; x++) {
        let cell = document.createElement("td", { is: "ui-cell" });
        cell.setPosition(x - 1, y - 1);
        tr.appendChild(cell);

      }
    }
    // for (var y = 0; y < this.height; y++) {
    //   for (var x = 0; x < this.width; x++) {
    //     // this.rows[y + 1].cells[x + 1].onpointerenter = e => {
    //     //   var t = e.target;
    //     //   if (e.buttons === 1 && LBT == TargetType.cell) {
    //     //     this.rangeEnd = { x: t.cellIndex - 1 + this.baseX, y: t.parentNode.rowIndex - 1 + this.baseY };
    //     //     this.slctRefresh(false);
    //     //   }
    //     // };
    //   }
    // }
    // for (var i = 0; i < this.width; i++) this.rows[0].cells[i + 1].ondblclick = e => { e.target.style.width = (e.target.style.width !== "auto") ? "auto" : "50%" };
    // this.rows[0].cells[0].onclick = e => { this.slctAll() }
    this.refresh();
    this.slctRefresh(false);
  }
}
customElements.define('ui-sheet', Sheet, { extends: 'table' });