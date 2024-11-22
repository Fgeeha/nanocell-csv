class Scroller extends HTMLElement {
    constructor(vertical =true) {
        super();
        this.style.display = "none";
        this.style.position = "fixed";
        this.style.backgroundColor = "grey";
        this.style.borderRadius = ".4em";
        this.style.opacity = ".5";
        this.style.zIndex = "90";

        if (vertical) {
            this.style.width = ".7em";
            this.style.height = "4em";
            this.style.top = "0";
            this.style.right = "0";
        }else {
            this.style.width = "4em";
            this.style.height = ".7em";
            this.style.left = "0";
            this.style.bottom = "0";
        }
    }
}
customElements.define('ui-scroller', Scroller);




