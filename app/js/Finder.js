class Finder extends HTMLElement {
constructor(sheet) {
  super();
  this.sheet            = sheet;
  this.found            = [];
  this.search           ="";
 
  this.lastSearch       ="";
  this.idx              = 0;
  this.advanced         = false;
  this.table            = new Table();  
  var img;
  
  this.caseSensitive   = new BoolInput(true);
  this.colBool         = new BoolInput();
  this.colNum          = new NumInput(1);
  this.rowBool         = new BoolInput();
  this.rowNum          = new NumInput(1); 
  this.findIn          = document.createElement("input");
  this.foundInfo       = document.createElement("span")
  this.replaceIn       = document.createElement("input");
  this.listB           = document.createElement("button");
  this.caseInfo        = document.createElement("span");

  this.table.br();
  this.table.push(this.caseSensitive);
  this.table.push(this.caseInfo);
  this.table.br();
  this.table.push(this.colBool);
  this.table.push(["Col : ",this.colNum]);
  this.table.br();
  this.table.push(this.rowBool);
  this.table.push(["Row : ",this.rowNum]);
  this.table.br();
  img                 = document.createElement("img");
  img.src             = "icn/menu/find.svg";
  this.table.push(img);
  this.table.push(this.findIn);
  this.table.push(this.foundInfo);
  this.table.br();
  img                 = document.createElement("img");
  img.src             = "icn/menu/replace.svg";
  this.table.push(img);
  this.table.push(this.replaceIn);    
  this.table.br();
  this.table.push();
  this.table.push(this.listB);
  this.listTable  =new Table();
      
  this.appendChild(this.listTable);
     
  this.appendChild(this.table);
 
  this.findIn   .addEventListener('input'   ,e=>{this.find()});
  this.findIn   .addEventListener("keydown" ,e=>{switch(e.key.toUpperCase()){case "ENTER":this.find()}});
  this.replaceIn.addEventListener("keydown" ,e=>{switch(e.key.toUpperCase()){case "ENTER":this.replaceAll()}});
  this.listB    .addEventListener("click"   ,e=>{this.showTable()});
  this.caseSensitive   .onchange= e=>{
    this.caseInfo.innerHTML=this.caseSensitive.value?"Case sensentive ( A &ne; a )":"Case insensentive ( A = a )"  ;
    this.find(true)
  }
  this.colBool         .onchange= e=>{this.find(true)} 
  this.colNum          .onchange= e=>{this.find(true)} 
  this.rowBool         .onchange= e=>{this.find(true)} 
  this.rowNum          .onchange= e=>{this.find(true)} 

  this.caseInfo.innerHTML = "Case sensentive ( A &ne; a )";
  this.listB.innerHTML  ="No match";
   
  this.listTable.style.maxHeight = "20em";

  this.listTable.classList.add("scroll");
  this.listTable.style.margin = "1em";
  this.listTable.style.display = "inline-block";
  this.table.style.display = "inline-block";
}
showTable(){
  var i =  0;
  this.listTable.style.display = "block";
  while(this.listTable.rows.length>0)this.listTable.rows[0].remove();
  for (var e of this.found){
    i++;
    if (i>500) return;
    this.listTable.br();
    this.listTable.push( e.x+1);
    this.listTable.push( e.y+1);
    this.listTable.push( e.v.replace(this.exp,"<b>"+ this.search+"</b>"));
   

  }
}
find(force = false){

  this.listTable.style.display = "none";
  this.search =this.findIn.value;
  if (this.search.length<1){
    this.lastSearch = this.search;
    this.found = [];
  }else if (this.lastSearch===this.search && !force){
      this.idx = (this.idx+1)%this.found.length;
  }else{
    this.lastSearch = this.search;
    this.idx = 0;
    this.found = [];
    this.exp=  new RegExp(this.search, (this.caseSensitive.value && this.advanced)?'g':'gi');
    var yStart = (this.advanced && this.rowBool.value)?this.rowNum.value-1:0;
    var xStart = (this.advanced && this.colBool.value)?this.colNum.value-1:0;
    var yEnd   = (this.advanced && this.rowBool.value)?this.rowNum.value-1:this.sheet.df.height-1;
    var xEnd   = (this.advanced && this.colBool.value)?this.colNum.value-1:this.sheet.df.width-1;
    for(var y = yStart; y <=yEnd;y++ )for(var x = xStart ; x <=xEnd; x++) {
          var v = this.sheet.df.get(x,y);
          this.exp.lastIndex = 0;
          if (this.exp.test(v))this.found.push({x:x,y:y,v:v});
      } 
    
        
  }
  var info = (this.found.length===0)?"No match":(this.idx+1)+' / '+this.found.length;
  this.listB.innerHTML =  info;
  this.foundInfo.innerHTML = info;
  if (this.found.length>0){
    sheet.x = this.found[this.idx].x;
    sheet.y = this.found[this.idx].y;  
    sheet.slctRefresh();
  }

}


findMenu(adv=false){

  this.listTable.style.display = "none";
  this.advanced = adv;
  if (this.advanced){
    for(var row of this.table.rows)row.style.display="table-row";
    this.foundInfo.style.display = "none";
  }
  else{
    for(var row of this.table.rows)if(row.rowIndex !== 3) row.style.display="none";
    this.foundInfo.style.display = "inline-block";
    
  } 
  dom.dialog.push(this);
  this.findIn.focus();
}

replaceAll(){
  if (this.search.length <1 )return ;
  for(var e of this.found){
    this.exp.lastIndex = 0;
    this.sheet.df.edit(e.x,e.y, e.v.replace(this.exp, this.replaceIn.value));
  }
  this.sheet.refresh();
  this.find(true);
}

}

customElements.define('ui-finder', Finder);
  