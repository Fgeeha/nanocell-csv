var stg = {};


class Setting {
constructor(s){
    var stored_val = localStorage.getItem(s.key);
    if (! (isNaN(stored_val) ||  stored_val==null) ) stored_val = Number(stored_val)
    this.key = s.key;
    this.value = (stored_val == null)? s.dflt : stored_val;
    this.cb = s.cb;
    Object.defineProperty(stg, this.key, {
        get:( )=>{return this.value},
        set:(e)=>{
            // console.log( "setting ",this.key)
            this.value=e;
            localStorage.setItem(this.key, e);
            if(this.cb)this.cb(this.value);
            }
        });    
}



static init(cb){
    for(var s of Setting.list) if(!s.title) new Setting(s);
}


static build(setting){
    var row = document.createElement("tr");
    var name = document.createElement("td");
    if(setting.title) {
        var title = document.createElement("h3");
        title.innerHTML = setting.title;
        name.appendChild(title);
        row.appendChild(name);
        return row;
    }


    var inputCell = document.createElement("td");
    name.innerHTML= setting.name;
    var input = document.createElement("input");
    if (setting.list) input = new ListInput(setting.list, setting.hide);
    else if (setting.max){
        input = new NumInput(setting.dflt, setting.min, setting.max);
    }else if (typeof setting.dflt === "boolean"){
        input = new BoolInput();
    }


    input.value = stg[setting.key];
    input.onchange=e=>{var c=e.target.value;stg[setting.key]=isNaN(c)?c:Number(c)}
//     input.addEventListener('select', function(){this.selectionStart = this.selectionEnd}, false);
    inputCell.appendChild(input);

    row.appendChild(name);
    row.appendChild(inputCell);
    return row;
}


static show(){
    var content = document.createElement("div");
    var title = document.createElement("h1")
    title.innerHTML = "Settings";

    content.appendChild(title);
    content.style.margin = "2em";
       


    content.classList.add("stg");
    var table = document.createElement("table");
    for(var s of Setting.list) table.appendChild(Setting.build(s));
    var b = document.createElement("button");
    b.innerHTML = "Reset to default settings";
    b.style.marginTop = "1em"
    b.onclick = Setting.resetDefault;
    content.appendChild(table);
    content.appendChild(b);
    dom.dialog.push(content, true);     
}


static setTheme(){
    console.log("setting theme callback")
    dom.theme.href = "css/themes/"+stg.theme+".css";
    dom.palette.href = "css/palettes/"+stg.theme+".css";
}

static log(){
    for (var i = 0; i < localStorage.length; i++){
        console.log (  localStorage.key(i) , " ==> ", (localStorage.getItem(localStorage.key(i)) ) ) ;
    }
}

static resetDefault(){
    localStorage.clear();
    for(var s of Setting.list) if (s.key) stg[s.key] = s.dflt;
    cmd.settings.run();
}

}

Object.defineProperty(Setting, 'list', {value: [
{title:"Appearance"},
    {key:"theme"            ,dflt:"light"       ,name:"Theme", list:[ "light" , "dark"],hide:true, cb:Setting.setTheme},
    {key:"font"             ,dflt:13            ,name:"Font Size",   min:7, max:24 ,cb:n=>{dom.body.style.fontSize = n+"px"; }   },
    {key:"rows"             ,dflt:25            ,name:"Rows",        min:5, max:60 ,cb:n=>{if (sheet)sheet.reload()}   },
    {key:"cols"             ,dflt:7             ,name:"Cols",        min:3, max:30 ,cb:n=>{if (sheet)sheet.reload()} },

{title:"Csv Read"},
    {key:"editMaxFileSize"  ,dflt: navigator.deviceMemory*500         ,name:"View Only File Size (Mo)"},

{title:"Csv Write"},
    {key:"encoding"         ,dflt:"utf-8"       ,name:"Encoding"},
    {key:"delimiter"        ,dflt:","           ,name:"Delimiter", list:[",", ";" , "TAB"],hide:true},
    {key:"strictComma"      ,dflt:false         ,name:"Save-Strict (error on comma)"},
    {key:"strictQuote"      ,dflt:false         ,name:"Save-Strict (error on double quote)"},
    
    
]});
 