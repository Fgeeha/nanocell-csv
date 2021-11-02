


class Shortcuts extends HTMLElement {
constructor() {
        super();
        var title = document.createElement("h1")
        title.innerHTML = "Keyboard Shortcuts";
        this.appendChild(title);
        this.table = new Table();
        this.build();
        this.appendChild(this.table)
        dom.dialog.push(this, true);
        this.style.textAlign = "left";
        this.style.margin = "2em";

        this.table.style.borderSpacing = "1em 0";
    
}

build(){
        for (var c of Object.values(cmd)){
                var k = c.k;
                k = k.replace("ENTER","&#11152;").replace("BACKSPACE","&#9003;").replace("TAB","&#11122;").replace("SPACE","&#9251;")
                k = k.replace("ARROWUP",'&uarr;').replace("ARROWRIGHT",'&rarr;').replace("ARROWDOWN",'&darr;').replace("ARROWLEFT",'&larr;')

                this.table.br();
                this.table.push((c.ctrl)?'Ctrl':'');
                this.table.push((c.alt)?'Alt':'');
                this.table.push((c.shift)?'&#8679;':'');
                this.table.push(k); 
                this.table.push(c.description);
               
          }

}


}


customElements.define('ui-shortcuts', Shortcuts );




 

//     this.content.appendChild(document.createElement("hr"));
//         var cmdTitle =   document.createElement("h1");  
//         var cmdTable =   document.createElement("table");
//         cmdTitle.innerHTML = "Keyboard shortcuts"
//         for (var c of Object.values(cmd)){
//             var row  =    document.createElement("tr");
//             var td1 = document.createElement("td");
//             var td2 = document.createElement("td");
                
//             var k = c.k;
//             k = k.replace("ARROW",'&#8599;').replace("ENTER","&#11152;").replace("BACKSPACE","&#9003;").replace("TAB","&#11122;").replace("SPACE","&#9251;")
//             if(c.ctrl) k+=" Ctrl";
//             if(c.alt)  k+=" alt"
//             if(c.shift) k+= " &#8679;"

//             td1.innerHTML = c.description;
//             td2.innerHTML = k;
//             row.appendChild(td1);
//             row.appendChild(td2);
//             cmdTable.appendChild(row);
//         } 
        
//         this.content.appendChild(cmdTitle);
//         this.content.appendChild(cmdTable);