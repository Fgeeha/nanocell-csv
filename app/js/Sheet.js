class Sheet extends HTMLTableElement {
constructor(df=new Dataframe()) {
  super();
  this.df         = df;
  this.finder     = new Finder(this);
  this.inputField = document.createElement("input");
  this.inputing   = false;
  this.scrolling  = false;
  this.escape     = false;
  this.fixTop     = false;
  this.fixLeft    = false;
  this.slctRange  = false;
  this.rangeInit  = undefined;
  this.xx=0;
  this.yy=0;
  this.bx=0;
  this.by=0;
  this.addEventListener("mousewheel", this.scroll, {passive: true});
  this.addEventListener("mousedown", this.click);
  this.addEventListener("dblclick", this.dblclick);
  this.inputField.addEventListener("focusout",e=>{this.inputBlur()});
  this.inputField.addEventListener("keydown",e=>{
    switch(e.key.toUpperCase()) {
        case "ENTER"          :e.stopPropagation(); e.preventDefault();this.inputField.blur();this.y++;this.slctRefresh();this.refresh();break;
        case "TAB"            :e.stopPropagation(); e.preventDefault();this.inputField.blur();this.x++;this.slctRefresh();this.refresh();break;
        case "ESCAPE"         :this.escape=true;sheet.inputField.blur();break;
    }
  });
  this.colResize = undefined;
  this.reload();
  this.x =0;
  this.classList.add('sheet');

}





sort(n, ascending){
  let col_items =  this.df.data.map(row => row[n]).map((val, idx) => ({ val, idx })) 
  let numbers = [];
  let strings = [];
  let empty = [];
  col_items.forEach(item => {
    const parsedNumber = parseFloat(item.val);
    if (item.val.length < 1) empty.push(item.idx); 
    else if (!isNaN(parsedNumber) && isFinite(parsedNumber)) numbers.push({val:parsedNumber, idx:item.idx});
    else  strings.push(item);
});
  
  let str_ordered = strings.sort((a, b) => (ascending)?   a.val.localeCompare(b.val) : b.val.localeCompare(a.val) ) .map(({ idx }) => idx); 
  let num_ordered = numbers.sort((a, b) => (ascending)?   a.val-b.val : b.val-a.val )  .map(({ idx }) => idx); 
  let new_order =  str_ordered.concat(num_ordered).concat(empty); 
  this.df.order(new_order)
  this.refresh();

}



go_to_next(){
  var d = this.df.get(this.x,this.y);
  var i = this.x;
  var j = this.y;
  var found = false; 
  console.log("go to next")
  while( ! found){
    i = (i +1) %this.df.width;
    if(i===0) j = (j +1) %this.df.height;
    found = (this.df.get(i,j) == d)
  }

  if(i==this.x && j== this.y) Msg.quick("No match");
  else{
    this.x = i;
    this.y = j;
    this.slctRefresh();
  }
  console.log("over")

}

validate_data(){

  var dot = stg.dv_comma_num;
  var dash = stg.dv_comma_txt;
  var single_quote = stg.dv_quotes;
  var lower = stg.dv_lower;
  this.allApply((x,y)=>{
    var d = this.df.get(x,y);
    if (d.length<1 || !isNaN(d))return;
    if (dot ){
      var numberTry = d.replace(',', '.');
      if (!isNaN(numberTry)) return  this.df.edit(x,y, numberTry);
    }
    if(dash)d = d.replaceAll(',','-');
    if(single_quote)d = d.replaceAll('\"','\'');
    if(lower)d = d.toLowerCase();
    this.df.edit(x,y, d);
  })
  this.refresh();

}




expand(){
  if (this.rangeInit ===undefined ) return;

  var xStart = Math.min(this.x, this.rangeInit.x) ;
  var yStart = Math.min(this.y, this.rangeInit.y) ;
  var xEnd   = Math.max(this.x ,this.rangeInit.x) ;
  var yEnd   = Math.max(this.y, this.rangeInit.y) ; 
  if (yStart == yEnd){
      var base0  = this.df.get(xStart, yStart)
      var base1  = this.df.get(xStart +1 , yStart )
      var baseN0 = Number(base0);
      var baseN1 = Number(base1);
      var d = baseN1 - baseN0;
      if (isNaN(baseN1) && !isNaN(baseN0)) d = 1;
      if (base0=="" && base1 =="") d = 1;
      if (isNaN(d)) for (var j = xStart; j <= xEnd; j++) this.df.edit(j,this.y, base0)
      else  for (var j = xStart; j <= xEnd; j++) this.df.edit(j, this.y, baseN0 + d*(j-xStart))
      
    return this.refresh()
  }



  var delta = []
  for (var i = xStart; i <= xEnd; i++) {
    var base0  = this.df.get(i, yStart)
    // if (base0 =="") continue;
    var base1  = this.df.get(i, yStart+1)
    var baseN0 = Number(base0);
    var baseN1 = Number(base1);
    var d = baseN1 - baseN0;
    if ( (isNaN(baseN1) || base1=="" )&& !isNaN(baseN0)) d = 1;
    if (isNaN(d)) for (var j = yStart; j <= yEnd; j++) this.df.edit(i,j, base0)
    else  for (var j = yStart; j <= yEnd; j++) this.df.edit(i,j, baseN0 + d*(j-yStart))
    this.refresh()
  }



}



get x     (){return this.xx}
get y     (){return this.yy}
get width (){return this.rows[0]? this.rows[0].cells.length-1:0}
get height(){return this.rows.length -1}
get slct  (){return this.rows[this.y - this.baseY+1].cells[this.x - this.baseX+1]}
get baseX (){return this.bx}
get baseY (){return this.by}
set baseX(n){
  if (n<0) n=0;
  if (n>=this.df.width)n=this.df.width-1;
  var delta=n-this.bx;
  this.bx=n; 
  switch(delta){
    case  0: break;
    case  1: this.scrollRight();break;
    case -1: this.scrollLeft();break;
    default : this.refresh();
    }
};

set baseY(n){ 
  if (n<0) n=0;
  if (n>=this.df.height)n=this.df.height-1;
  var delta=n-this.by;
  this.by= n; 
  switch(delta){
    case  0: break;
    case  1: this.scrollDown();break;
    case -1: this.scrollUp();break;
    default : this.refresh();
    }
};


set x(n){
  if (this.inputing)this.inputBlur();
  if (!this.slctRange)this.rangeInit = undefined;
  if (n>=this.df.width+this.width-1) n =this.df.width+this.width-2;
  if (this.slctRange && !this.rangeInit)this.rangeInit = {x:this.x,y:this.y};
  this.xx=n<0?0:n;
}
set y(n){
  if (this.inputing)this.inputBlur();
  if (!this.slctRange)this.rangeInit = undefined; 
  if (n>=this.df.height+this.height-1) n =this.df.height+this.height-2;
  if (this.slctRange && !this.rangeInit)this.rangeInit = {x:this.x,y:this.y};
  this.yy=n<0?0:n;
}

slctAll(){
  this.x=0;this.y=0;this.rangeInit={x:this.df.width-1,y:this.df.height-1};this.slctRefresh(false)
}


scrollLeft(){
 for(var y = 0 ; y < this.rows.length; y ++){
    var r = this.rows[y];
    var c = r.cells[r.cells.length-1];
    if (y>0)this.loadCell(c, this.baseX, this.baseY+y-1);
    r.insertBefore(c, r.cells[1]);
  }

 let header_value = this.df.get(this.baseX+1,0)
 this.rows[0].cells[1].innerHTML = (this.fixTop && header_value != ""  )? header_value: this.baseX+1;
 
}
scrollRight(){
 let header_value = this.df.get(this.baseX+this.width,0)
 this.rows[0].cells[1].innerHTML =  (this.fixTop && header_value != "" )? header_value: this.baseX+this.width;
 for(var y = 0 ; y < this.rows.length; y ++){
    var r = this.rows[y];
    var c = r.cells[1];
    if (y>0) this.loadCell(c, this.baseX+this.width-1, this.baseY+y-1);
    r.appendChild(c);
  }

}


scrollUp(){
 var r = this.rows[this.rows.length-1];
  for (var x = 1 ; x < r.cells.length ; x++ ){
    this.loadCell(r.cells[x], this.baseX+x-1, this.baseY);
  }
  let header_value = this.df.get(0, this.baseY+1)

  r.cells[0].innerHTML =(this.fixLeft && header_value != "" )? header_value: this.baseY+1;
  this.insertBefore(r, this.rows[1]);

}

scrollDown(){
  var r = this.rows[1];
  for (var x = 1 ; x < r.cells.length ; x++ ){
    this.loadCell(r.cells[x], this.baseX+x-1, this.baseY+this.height-1);
  }
  let header_value = this.df.get(0,this.baseY+this.height)
  r.cells[0].innerHTML =(this.fixLeft && header_value != "" )? header_value: this.baseY+this.height;
  this.appendChild(r);
  
}

shift(direction){
  switch(direction){
    case 0:this.df.shiftRow(this.y-1);this.y--;break;
    case 1:this.df.shiftCol(this.x)  ;this.x++ ;break;
    case 2:this.df.shiftRow(this.y)  ;this.y++ ;break;
    case 3:this.df.shiftCol(this.x-1);this.x--; break;
  }
  this.refresh();
  this.slctRefresh();
}


insert(direction){
  switch(direction){
    case 0:this.df.insertRow(this.y) ;this.y++;break;
    case 1:this.df.insertCol(this.x+1) ;break;
    case 2:this.df.insertRow(this.y+1) ;break;
    case 3:this.df.insertCol(this.x) ; this.x++ ;break;
  }
  this.refresh();
  this.slctRefresh();
}




input(txt){
  if (!this.slct)return;
  this.inputing = true;
  this.inputField.value = txt ? txt : this.df.get(this.x,this.y);
  this.slct.appendChild(this.inputField);
  this.inputField.focus();
}

inputBlur(){
  var e = this.inputField.value;
  if(!this.escape){
    this.rangeEdit(e);
    if(!this.rangeInit) this.loadCell(this.inputField.parentNode, this.x, this.y);
    else this.refresh();
  }
  this.inputField.remove();
  this.inputing = false;
  this.escape = false;
}

dblclick(e){
  var t = e.target;
  if (t.tagName==="TD")this.input();
 
}


click(e){
  var t = e.target;
  if (t.tagName=="TD"){
    var x = t.cellIndex+this.baseX -1;
    var y = t.parentNode.rowIndex+this.baseY - 1; 
    if(this.inputing && e.ctrlKey){
      e.preventDefault();
      this.inputField.value+= this.df.get(x,y).split('=')[0];
      this.inputField.selectionStart = this.inputField.value.length;
      return 
    }


    this.x = x;
    this.y = y;
    this.slctRefresh();
  }
  if(t.tagName==="TH" && t.cellIndex >0) this.slctCol(this.baseX+t.cellIndex -1);
  if(t.tagName==="TH" && t.parentNode.rowIndex >0) this.slctRow(this.baseY+t.parentNode.rowIndex -1);
}


footerUpdate(){
  var f = dom.footer;
  if(this.rangeInit){
    var deltaX = Math.abs((this.rangeInit.x) - (this.x))+1
    var deltaY = Math.abs((this.rangeInit.y) - (this.y))+1
    f.left.innerHTML = (this.rangeInit.x+1)+":"+(this.rangeInit.y+1)+" to "+(this.x+1)+":"+(this.y+1)+" ("+ deltaX + "x" + deltaY + ")";
  }
  else  f.left.innerHTML =(this.x+1)+":"+(this.y+1);
  f.right.innerHTML =this.df.width+":"+this.df.height;
  f.center.innerHTML = this.df.get(this.x, this.y).replaceAll('&','&amp;').replaceAll('<' , '&lt;').replaceAll(' ', '<span style="color:var(--dots)">&bull;</span>');
  f.lock.src = (this.df.isSaved) ? "icn/lock.svg":"icn/edit.svg";
}

scrollerUpdate(){
  let offset = this.rows[1].getBoundingClientRect().top;
  let theight = this.getBoundingClientRect().bottom - offset- dom.content.scroller.offsetHeight ;
  dom.content.scroller.style.top = String(Math.round(offset + theight * this.baseY/(this.df.height))) + "px";
  this.slctRefresh(false);
}

slctCol(n){
  this.slctRange =true;
  this.rangeInit = {x:n, y:0}
  this.x = n;
  this.y = this.df.height-1;
  this.slctRange =false;
  this.slctRefresh(); 
}

slctRow(n){
  this.slctRange =true;
  this.rangeInit = {x:0, y:n}
  this.x = this.df.width-1;
  this.y =n;
  this.slctRange =false;
  this.slctRefresh(); 
}

rangeArray(){
  if(!this.rangeInit)return [[this.df.get(this.x,this.y)]];
  var xStart = Math.min(this.x, this.rangeInit.x);
  var yStart = Math.min(this.y, this.rangeInit.y);
  var xEnd   = Math.max(this.x ,this.rangeInit.x);
  var yEnd   = Math.max(this.y, this.rangeInit.y);
  var mat = [];
  for(var y = yStart; y <= yEnd; y++) {
    var row = []; 
    for(var x = xStart;x<=xEnd;x++)row.push(this.df.get(x,y)); 
    mat.push(row);
  }
  return mat;
}
rangeEdit(value){
  if(!this.rangeInit)return this.df.edit(this.x,this.y,value);
  var xStart = Math.min(this.x, this.rangeInit.x);
  var yStart = Math.min(this.y, this.rangeInit.y);
  var xEnd   = Math.max(this.x ,this.rangeInit.x);
  var yEnd   = Math.max(this.y, this.rangeInit.y);
  for(var x = xStart; x <= xEnd ; x++ ) for(var y = yStart; y <= yEnd; y++) this.df.edit(x,y,value);

} 

allApply(cb){
  for(var y = 0; y < this.df.height; y++) for(var x = 0; x < this.df.width ; x++ )  cb(x,y);
}



rangeApply(cb){
  if(!this.rangeInit)return cb(this.x,this.y);
  var xStart = Math.min(this.x, this.rangeInit.x);
  var yStart = Math.min(this.y, this.rangeInit.y);
  var xEnd   = Math.max(this.x ,this.rangeInit.x);
  var yEnd   = Math.max(this.y, this.rangeInit.y);
  for(var x = xStart; x <= xEnd ; x++ ) for(var y = yStart; y <= yEnd; y++) cb(x,y);

} 

rangeTranspose(){
  if(this.df.lock) return;
  if (!this.rangeInit)return;
  var r = this.rangeArray();
  var t = [];
  for (var x = 0 ; x < r[0].length;x++ ){
    var row = [];
    for(var y =0; y<r.length;y++){
      row.push(r[y][x]);
    }
    t.push(row);
  }
  this.rangeEdit('');
  this.paste(t);
}
 

rangeRender(){
  var xStart = Math.min(this.x, this.rangeInit.x) - this.baseX;
  var yStart = Math.min(this.y, this.rangeInit.y) - this.baseY;
  var xEnd   = Math.max(this.x ,this.rangeInit.x) - this.baseX;
  var yEnd   = Math.max(this.y, this.rangeInit.y) - this.baseY;
  if(xStart<0) xStart=0;
  if(yStart<0) yStart=0;
  if (xEnd>=this.width) xEnd = this.width-1;
  if (yEnd>=this.height) yEnd = this.height-1;
  for(var x = xStart; x <= xEnd ; x++ )
    for(var y = yStart; y <= yEnd; y++)
      this.rows[y+1].cells[x+1].classList.add("slct");
  this.footerUpdate();
}



round(integer=true){
  this.rangeApply((x,y)=>{
    var n = this.df.get(x,y);
    if (!isNaN(n) && n!==''){
      n= Number(n);
      if(!integer) n*=100;
      n= Math.round(n+Number.EPSILON);
      if(!integer){
        n/=100;
        n+=0.001;
        n= Math.round(n*1000)/1000;
        n=String(n).slice(0,-1);
      }
    }
    this.df.edit(x,y,n);
  })  
}


paste(mat){
  var minX = this.x;
  var minY = this.y;
  if(this.rangeInit){ minX= Math.min(minX, this.rangeInit.x); minY = Math.min(minY, this.rangeInit.y)}
  for(var y = 0 ; y < mat.length; y++ )for(var x = 0 ; x < mat[y].length; x++)this.df.edit(minX+x, minY+y, mat[y][x]);
}




slctRefresh(focus = true){
  this.slctClear();
  if(focus)this.slctFocus();
  if (this.rangeInit)return this.rangeRender();
  var y = this.y-this.baseY;
  var x = this.x-this.baseX;
  if (x<0||y<0||x>=this.width||y>=this.height)return;
  this.rows[y+1].cells[x+1].classList.add("slct");
  this.footerUpdate();
}

slctFocus(){
       if (this.x < this.baseX) this.baseX = this.x;
  else if (this.y < this.baseY) this.baseY = this.y;
  else if (this.x >=this.baseX+this.width) this.baseX=this.x-this.width+1;
  else if (this.y >=this.baseY+this.height) this.baseY=this.y-this.height+1;
  else return;
}


slctClear(){var td;while(  td = this.getElementsByClassName('slct')[0]) td.classList.remove('slct');}

scroll(e){
    var coef = 16;
    if(e.altKey)  this.baseX+= (e.deltaY>0)? Math.floor(e.deltaY/coef):Math.ceil(e.deltaY/coef);
    else{
      this.baseX+= (e.deltaX>0)? Math.floor(e.deltaX/coef):Math.ceil(e.deltaX/coef);
      this.baseY+= (e.deltaY>0)? Math.floor(e.deltaY/coef):Math.ceil(e.deltaY/coef);
    }
    this.slctRefresh(false);

}

loadCell(c, x, y){
    c.innerHTML = "";
    var d = this.df.get(x,y);
    if (d.length<1)return;
    var txt=d.replace('&','&amp;').replace('<','&lt;');
    var div = document.createElement("div");
    if(txt[0]==='!') div.classList.add("error");
    if(txt!=='' && !isNaN(txt)) div.classList.add("num");
    div.innerHTML = txt;
    c.appendChild(div)       
}

loadTopHeader(x){
   if (this.fixTop){
      var d = this.df.get(this.baseX+x,0);
      if(d.length>0){  
        this.rows[0].cells[x+1].innerHTML =  "<div>"+this.df.get(this.baseX+x,0)+"</div>";
        return ;
      }
   }
   this.rows[0].cells[x+1].innerHTML = this.baseX+x+1; 
}


loadLeftHeader(y){
   if (this.fixLeft){
      var d = this.df.get(0,this.baseY+y);
      if(d.length>0){  
        this.rows[y+1].cells[0].innerHTML =  "<div>"+this.df.get(0,this.baseY+y)+"</div>";
        return ;
      }
   }
   this.rows[y+1].cells[0].innerHTML = this.baseY+y+1; 
}


refresh(){window.requestAnimationFrame(()=>{
  for(var x=0;x<this.width;x++) this.loadTopHeader(x);
//   var time = new Timer();

  for(var y=0;y<this.height;y++) {
      var by=this.baseY+y;
      this.loadLeftHeader(y);
      for(var x=0;x<this.width;x++)this.loadCell(this.rows[y+1].cells[x+1],this.baseX+x,by) ;
  }
  if (this.inputing) this.slct.appendChild(this.inputField);
  this.footerUpdate();
    this.scrollerUpdate()
    //   time.log();
})}

reloadFile(){
   if(this.df.file === undefined)return Msg.quick("No file to reload");
  Msg.choice("File will reload to last saved state.<br>Changes made since last save will be lost!",()=>{
  this.df.reload(f=>{this.df=new Matrix(Csv.parse(f.content)) ;this.reload()})
  })
}

reload(){
    while(this.rows[0]) this.rows[0].remove();
    for(var y=0; y< stg.rows+1; y++){
        var tr = document.createElement("tr");
        this.appendChild(tr);
        for(var x=0; x< stg.cols+1; x++)tr.appendChild(document.createElement((y===0||x===0)?"th":"td"));
    }
    for(var y=0; y< this.height; y++){
        for(var x=0; x<this.width; x++){
          this.rows[y+1].cells[x+1].onpointerenter = e=> { 
            var t = e.target;
            if(e.buttons===1 && ! this.scrolling){
              this.rangeInit = {x:t.cellIndex-1 +this.baseX,y:t.parentNode.rowIndex -1+this.baseY};
              this.slctRefresh();
            }
          };
        }
    }
    for (var i =0 ; i < this.width; i++){
        this.rows[0].cells[i+1].ondblclick=e=>{e.target.style.width=(e.target.style.width!=="auto")?"auto":"50%"};
    }
    this.rows[0].cells[0].onclick=e=>{this.slctAll()}

    this.refresh();
}
}


customElements.define('ui-sheet', Sheet, { extends: 'table' });




 