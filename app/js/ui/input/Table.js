class Table extends HTMLTableElement {
constructor() {super();  this.row = undefined;

 }

br(){
    this.row = document.createElement("tr");
    this.appendChild(this.row);
}

push(ele=""){
   
    var td = document.createElement("td")
    if(Array.isArray(ele))for (var e of ele) try{td.appendChild(e)}catch(err){td.innerHTML = e}
    else try{td.appendChild(ele)}catch(err){td.innerHTML = ele}
    
    this.row.appendChild(td);
}


pushRow(array){
    this.br();
    for (var a of array) this.push(a);
}




}


customElements.define('ui-table', Table, { extends: 'table' });




 