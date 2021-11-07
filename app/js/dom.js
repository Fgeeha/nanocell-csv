var dom = { 
palette:                    document.getElementById("palette"),
theme:                      document.getElementById("theme"),
header:                     document.getElementById("header"),
body:                       document.getElementById("body"),
content:                    document.getElementById("content"),
dialog:                     document.getElementById("dialog"),
footer:{
  left:                     document.getElementById("footerLeft"),
  center:                   document.getElementById("footerCenter"),
  right:                    document.getElementById("footerRight"),
  lock:                     document.getElementById("lock"),
},

// menu:document.createElement("ui-menu")

}




// dom.content.appendChild( dom.menu)
// dom.menu.init()



dom.dialog.clear = function (e){ while(this.children.length > 0) this.children[0].remove(); dom.dialog.className=''}
dom.dialog.push = function (e, fullscreen = false, closeButton = true){
 this.clear();


 if (fullscreen)dom.dialog.classList.add("dialog_large");
 else dom.dialog.classList.add("dialog_small");
 dom.dialog.classList.add("scroll");
 dom.dialog.appendChild(e);
 
 if (closeButton){
    var img = document.createElement("img");
    img.src = "icn/off.svg";
    img.style.position = (fullscreen)? "fixed":"absolute";
    img.setAttribute("title","close");
    img.setAttribute("id","closeDialog");
    img.addEventListener("click",function(){dom.dialog.clear()})
    img.style.cursor = "pointer"
    if(!fullscreen){
      img.style.height ="1.3em";
      img.style.marginTop =".5em";
    }
    dom.dialog.appendChild(img)
 }
}
Object.defineProperty(dom.dialog, 'isBusy',{get: function(){return dom.dialog.children.length>0}});

