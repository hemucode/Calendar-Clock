       const domReady = (callback)=> {
  if (document.readyState === 'complete') {
    callback()
  } else {
    window.addEventListener('load', callback, false);
  }
}

class Popup {
	constructor(isArray = {}) {
    	this.params = isArray;
        domReady(() => {this.init()})
	}
	init() {
	    this.id = this.params.id ?? "popup";
        this.title = this.params.title ?? "Popup Title";
        this.content = this.params.content ?? "Popup Content";
        this.titleColor = this.params.titleColor ?? "#000000";
        this.backgroundColor = this.params.backgroundColor ?? "#ffffff";
        this.closeColor = this.params.closeColor ?? "#000000";
        this.textColor = this.params.textColor ?? "#000000";
        this.linkColor = this.params.linkColor ?? "#383838";
        this.widthMultiplier = this.params.widthMultiplier ?? 1;
        this.heightMultiplier = this.params.heightMultiplier ?? 0.66;
        this.inputHeightMultiplier = this.params.inputHeightMultiplier ?? 1;
        this.fontSizeMultiplier = this.params.fontSizeMultiplier ?? 1;
        this.borderRadius = this.params.borderRadius ?? "15px";
        this.sideMargin = this.params.sideMargin ?? "3%";
        this.titleMargin = this.params.titleMargin ?? "2%";
        this.lineSpacing = this.params.lineSpacing ?? "auto";
        this.showImmediately = this.params.showImmediately ?? false;
        this.showOnce = this.params.showOnce ?? false;
        this.fixedHeight = this.params.fixedHeight ?? false;
        this.allowClose = this.params.allowClose ?? true;
        this.underlineLinks = this.params.underlineLinks ?? false;
        this.fadeTime = this.params.fadeTime ?? "0.3s";
        this.buttonWidth = this.params.buttonWidth ?? "fit-content";
        this.borderWidth = this.params.borderWidth ?? "0";
        this.borderColor = this.params.borderColor ?? "#000000";
        this.disableScroll = this.params.disableScroll ?? true;
        this.textShadow = this.params.textShadow ?? "none";
        this.hideCloseButton = this.params.hideCloseButton ?? false;
        this.hideTitle = this.params.hideTitle ?? false;
        this.editHTML = this.params.editHTML ?? false;

        // height and width calculations
        this.height = `min(${770 * this.heightMultiplier}px, ${90 * this.heightMultiplier}vw)`;
        this.width = `min(${770 * this.widthMultiplier}px, ${90 * this.widthMultiplier}vw)`;

        // font size calculation
        this.fontSize = `min(${25 * this.fontSizeMultiplier}px, ${4 * this.fontSizeMultiplier}vw)`;

        this.inputHeight = `min(${25 * this.inputHeightMultiplier}px, ${4 * this.inputHeightMultiplier}vw)`;

        this.css = this.params.css ?? "";
        this.css += `
        .popup#${this.id} {
        	position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		    background-color: rgba(0, 0, 0, .5);
			z-index: 99999;
			font-weight: 400;
			pointer-events: none;
			opacity: 0;
			transition-property: opacity;
            transition-duration: ${this.fadeTime};
            text-shadow: ${this.textShadow};
            font-family: '${this.params.font ?? "Inter"}', 'Inter', Helvetica, sans-serif;
        }
        
        .popup#${this.id} .popup-content {
			position: absolute;
			display: flex;
			flex-direction: column;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			box-shadow: 0 0 10px rgba(0, 0, 0, .5);
            background-color: ${this.backgroundColor};
            width: ${this.width}; 
            height: ${this.fixedHeight ? this.height : "unset"};
            border-radius: ${this.borderRadius};
            border: ${this.borderWidth} solid ${this.borderColor};
        }

        .popup#${this.id} .popup-header {
			display: flex;
			align-items: center;
			justify-content: center;
			text-align: center;
			width: 100%;
			height: 20%;
            margin-bottom: ${this.titleMargin};
        }

        .popup#${this.id} .popup-title {
			margin-top: .9em;
			margin-left: .3em;
			margin-right: .3em;
			font-weight: 600;
            font-size: ${this.fontSize};
            color: ${this.titleColor};
        }

        .popup#${this.id} .popup-close {
			position: absolute;
			top: 0;
			right: 2.2%;
			cursor: pointer;
			font-size: min(48.1px, 8vw);
            color: ${this.closeColor};
        }

        .popup#${this.id} .popup-body {
        	text-align: center;
            color: ${this.textColor};
            margin-left: ${this.sideMargin};
            margin-right: ${this.sideMargin};
            line-height: ${this.lineSpacing};
            font-size: ${this.fontSize};
        }

        .popup#${this.id} .popup-body button { 
            width: ${this.buttonWidth};
            padding: 10px;
            margin: 10px;
            width: 200px; 
        }
        .popup#${this.id} .popup-body input { 
            width: 100%; 
            height: ${this.inputHeight};
            margin-bottom: 10px;
            font-size: ${this.fontSize};
            border-radius: 12px;
            padding: 10px;

        }

        .popup#${this.id} .popup-body a { 
            color: ${this.linkColor};
            ${this.underlineLinks ? "text-decoration: underline;" : ""}
        }
        
		.popup.fade-in {
		  pointer-events: all !important;
		  opacity: 1!important;
		}

		.popup.fade-out {
		  pointer-events: none !important;
		  opacity: 0!important;
		}`;

        let headElement = document.head || document.getElementsByTagName("head")[0];
        let bodyElement = document.body || document.getElementsByTagName("body")[0];

	    if (!headElement || !bodyElement) return void setTimeout((() => {
	      new Popup(this.params).start();
	    }), 100);

	    if (!document.getElementById("popup-style")) {
	      let styleElement = document.createElement("style");
	      styleElement.id = "popup-style",
	      styleElement.appendChild(document.createTextNode(this.css)), 
	      headElement.appendChild(styleElement);
	    }



        // create popup
        this.popupEl = document.createElement("div");
        this.popupEl.className = 'popup';
        this.popupEl.setAttribute('id', this.id);
        bodyElement.appendChild(this.popupEl);

        this.contentEl = document.createElement("div");
        this.contentEl.className = 'popup-content';
        this.popupEl.appendChild(this.contentEl);

        this.headerEl = document.createElement("div");
        this.headerEl.className = 'popup-header';
        this.contentEl.appendChild(this.headerEl);

        this.hideTitle ? null : this.titleEl = document.createElement("div"),
        this.titleEl.className = 'popup-title', 
        this.titleEl.textContent = this.title,
        this.headerEl.appendChild(this.titleEl); 

        !this.allowClose && this.hideCloseButton ? null : 
        this.closeEl = document.createElement("div"),
        this.closeEl.className = 'popup-close', 
        this.closeEl.textContent = '×',
        this.headerEl.appendChild(this.closeEl);

        this.bodyEl = document.createElement("div");
        this.bodyEl.className = 'popup-body';
        this.contentEl.appendChild(this.bodyEl);
        // this.bodyEl.innerText = this.content;

        // process input text
        this.content = this.content.split("\n");
        for (let i = 0; i < this.content.length; i++) {
            let line = this.content[i].trim();
            if (line === "") continue;

            // add <p>
           if (line.includes("§")) {
                const split = line.split("§");
                var p = document.createElement("p");
                p.textContent = split[1].trim();
                p.className = split[0].trim();
                this.bodyEl.appendChild(p); 

            } else {
                var p = document.createElement("p");
                this.bodyEl.appendChild(p); 
                p.textContent = line;
            }
        }

        // edit html
        if (this.editHTML && this.bodyEl) {
            // console.log(this.editHTML)
            for (this.ctx of this.editHTML){
                if (this.ctx.element) {
                    const newEle = document.createElement(this.ctx.element);
                    this.bodyEl.appendChild(newEle);
                    for (var key in this.ctx) {
                        if (this.ctx.hasOwnProperty(key)){
                            if (key=='element' || key=='text') {
                                if (key=='text') {
                                    newEle.textContent = this.ctx[key];
                                }
                            }else{
                                newEle.setAttribute(key, this.ctx[key]);
                            }
                        }
                    }
                }
            }
        }



        this.popupEl.addEventListener("click", (e) => {
            if (e.target.className == "popup-close" || e.target.classList.contains("popup")) {
                if (!this.allowClose) return;
                this.hide();
            }
        });

        // run load callback if specified
        if (this.params.loadCallback && typeof this.params.loadCallback == "function") {
            this.params.loadCallback();
        }


	}

    hide() {
        this.popupEl.classList.remove("fade-in");
        this.popupEl.classList.add("fade-out");
        postHide(this);
    }

	show() {
        this.popupEl.classList.remove("fade-out");
        this.popupEl.classList.add("fade-in");
        postShow(this.params.disableScroll ?? true);
	}
}


const postShow = (disableScrollParam)=> {
    if (disableScrollParam) disableScroll();
}

const postHide = (popup)=> {
    if (popup.params.hideCallback && typeof popup.params.hideCallback == "function") {
        popup.params.hideCallback();
    }
    enableScroll();
}

const disableScroll = ()=> {
    // Get the current page scroll position
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

    // if any scroll is attempted, set this to the previous value
    window.onscroll = function () {
        window.scrollTo(scrollLeft, scrollTop);
    };
}

const enableScroll  = ()=> {
    window.onscroll = function () {};
}

