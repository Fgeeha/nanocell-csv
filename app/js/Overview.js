

class Overview {
constructor(f,d){
    this.file = f;
    this.stat = d.stats;
    this.sep = d.sep;
    this.rows = d.rowCount;


}





show(){
    var content = document.createElement("div");
    var title = document.createElement("h1")
    title.innerHTML = this.file.name;
    content.appendChild(title);
    content.style.margin = "2em";
    content.style.textAlign= "left";


    var miscTable = new Table();
    miscTable.push("Size (ko)")
    miscTable.push(this.file.size )
    miscTable.br()

    miscTable.push("Separator")
    miscTable.push(this.sep.replace(",","[,] Comma").replace("\t","[TAB]").replace(";","[;] Semicolon") )
    miscTable.br()

    miscTable.push("Number of columns")
    miscTable.push(this.stat.length) 
    miscTable.br()

    miscTable.push("Number of rows")
    miscTable.push(this.rows) 
    miscTable.br()

        // miscTable.push("Last Modified")
    // miscTable.push(this.file.lastModifiedDate)
    // miscTable.br()
    


   
    content.appendChild(miscTable);

    var title = document.createElement("h1")
    title.innerHTML = "Stats";
    content.appendChild(title);

    var statTable = new Table();
    statTable.pushRow(["Header","Null","Text","Numeric", "Sum", "Average"])
    statTable.br()
    statTable.br()

    for (var i = 0; i < this.stat.length; i++) {
        let d = this.stat[i];
        statTable.push(this.stat[i].header)
        statTable.push(this.stat[i].count_null, "ov_null")
        statTable.push(this.stat[i].count_txt, "ov_txt")
        statTable.push(this.stat[i].count_num, "ov_num")
        statTable.push(this.stat[i].total_sum, "ov_sum")
        statTable.push(round(this.stat[i].total_sum/this.stat[i].count_num, false), "ov_avg")
        statTable.br()
    }


    content.appendChild(statTable);

    var title = document.createElement("h1")
    title.innerHTML = "Distinct Values";
    content.appendChild(title);



    var distinctWrapper = document.createElement("div")
    var distinctLeftWrapper = document.createElement("div")
    var distinctRightWrapper = document.createElement("div")
    var distinctCenterWrapper = document.createElement("div")

    var distinctLeft = new Table()
    var distinctRight = new Table ()
    distinctWrapper.style.display = "flex"
    distinctWrapper.style.height = "70vh"
    distinctRightWrapper.style.overflow="scroll"
    distinctLeftWrapper.style.overflow="scroll"
    distinctRightWrapper.style.height="100%"
    distinctLeftWrapper.style.height="100%"
    distinctCenterWrapper.style.flexGrow="2"
    distinctLeft.style.height="100%"
    distinctLeft.style.margin="0 1em 0 0"
    distinctRight.style.margin="0 1em 0 1em"



    for (var i = 0; i < this.stat.length; i++) {
        // b.innerHTML = this.stat[i].header
        distinctLeft.push(this.stat[i].header)
        distinctLeft.row.addEventListener("click", e=>{
            console.log(e.target.position())
            let idx = e.target.parentNode.position()
            distinctRight.empty()
            for (var j = 0; j < this.stat[idx].distinct_value.length; j++) {
                distinctRight.push(this.stat[idx].distinct_value[j])
                distinctRight.push(this.stat[idx].distinct_count[j])
                distinctRight.br()

            }

        })
        distinctLeft.br()
    }

    for (var i = 0; i < this.stat[1].distinct_value.length; i++) {
        distinctRight.push(this.stat[1].distinct_value[i])
        distinctRight.push(this.stat[1].distinct_count[i])
        distinctRight.br()
    }

    distinctLeftWrapper.appendChild(distinctLeft);
    distinctRightWrapper.appendChild(distinctRight);

    distinctWrapper.appendChild(distinctLeftWrapper);
    distinctWrapper.appendChild(distinctCenterWrapper);
    distinctWrapper.appendChild(distinctRightWrapper);

    content.appendChild(distinctWrapper);


    dom.dialog.push(content, true);     
}



}

// Object.defineProperty(Setting, 'list', {value: [
// {title:"Appearance"},
//     {key:"theme"            ,dflt:"light"       ,name:"Theme", list:[ "light" , "dark"],hide:true, cb:Setting.setTheme},
//     {key:"font"             ,dflt:13            ,name:"Font-size",   min:7, max:24 ,cb:n=>{dom.body.style.fontSize = n+"px"; }   },
//     {key:"rows"             ,dflt:25            ,name:"Rows",        min:5, max:60 ,cb:n=>{if (sheet)sheet.reload()}   },
//     {key:"cols"             ,dflt:7             ,name:"Cols",        min:3, max:30 ,cb:n=>{if (sheet)sheet.reload()} },

// {title:"Csv Read"},
//     {key:"viewFirst"        ,dflt:true          ,name:"Show overview before edit"},
//     {key:"editMaxFileSize"  ,dflt:"100"         ,name:"Quick-view file size threshold (Mo)",list:["1", "10" , "30", "60","100", "250", "500"],hide:true },

// {title:"Csv Write"},
//     {key:"encoding"         ,dflt:"utf-8"       ,name:"Encoding"},
//     {key:"delimiter"        ,dflt:","           ,name:"Delimiter", list:[",", ";" , ":"],hide:true},
//     {key:"strictComma"      ,dflt:false         ,name:"Save-Strict (error on comma)"},
//     {key:"strictQuote"      ,dflt:false         ,name:"Save-Strict (error on double quote)"},
    
    
// ]});
 