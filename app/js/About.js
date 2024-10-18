class About extends HTMLElement {
    constructor() {
            super();
            var title = document.createElement("h1")
            var version = document.createElement("h3")
            var logo = document.createElement("img")
            var link = document.createElement("a")
            title.innerHTML = "Nanocell Csv Editor";
            logo.src = "./logo/nanocell.svg"
            link.href = "https://nanocell-csv.com/"
            link.innerHTML = "https://nanocell-csv.com/"
            this.style.display = "flex"
            this.style.flexDirection = "column"
            this.style.height = "100vh"
            this.style.justifyContent = "center"
            this.style.alignItems = "center"
            logo.style.filter = "none";
            logo.style.height = "auto";
            logo.style.width  = "10em";
            logo.style.borderRadius = "0";
            link.style.position ="absolute"
            link.style.bottom ="3em"
            link.style.left ="0"
            link.style.width ="100%"
            link.style.textDecoration ="none"
            link.style.color ="royalblue"
            this.getVersion(e=>{version.innerHTML = e});
            this.appendChild(logo)
            this.appendChild(title);
            this.appendChild(version)
            this.appendChild(link)
            dom.dialog.push(this, true);
    }
    getVersion(cb){caches.keys().then(cache=>{cb(cache.join('<br>'))}).catch(()=>{cb("version error")})}
    }
    customElements.define('ui-about', About );