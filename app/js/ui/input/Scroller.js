class Scroller extends HTMLElement {
    constructor() {
        super();
        this.style.display = "none";
        this.style.width = ".7em";
        this.style.height = "4em";
        this.style.position = "fixed";
        this.style.top = "0";
        this.style.right = "0";
        this.style.backgroundColor = "grey";
        this.style.borderRadius = ".4em";
        this.style.opacity = ".5";
        this.style.zIndex = "999";
    }
}
customElements.define('ui-scroller', Scroller);




