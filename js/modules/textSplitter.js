export class InfoTextSplitter {
    constructor() {
        this.container = document.querySelector('.info__header');
        
        if (!this.container) {
            console.warn('.info__header не найден');
            return;
        }
        
        this.title = this.container.querySelector('#infoTitle');
        this.image = this.container.querySelector('#infoImage');
        this.isMobile = window.innerWidth <= 768;
        this.originalHtml = null;
        this.isSplit = false;
        
        this.init();
    }
    
    init() {
        if (!this.title || !this.image) return;
        
        this.originalHtml = this.title.outerHTML;
        this.originalDisplay = this.container.style.display;
        
        this.checkAndSplit();
        
        window.addEventListener('resize', () => {
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth <= 768;
            
            if (this.isMobile !== wasMobile) {
                this.checkAndSplit();
            }
        });
    }
    
    checkAndSplit() {
        if (this.isMobile && !this.isSplit) {
            this.splitText();
        } else if (!this.isMobile && this.isSplit) {
            this.restoreText();
        }
    }
    
    splitText() {
        if (this.isSplit) return;
        
        const accentSpan = this.title.querySelector('.info__accent');
        if (!accentSpan) return;
        
        const accentHtml = accentSpan.outerHTML;
        
        const beforeText = "Чтобы поддержать Международный васюкинский турнир";
        const afterText = "посетите лекцию на тему: ";
        
        this.container.innerHTML = '';
        
        const beforeDiv = document.createElement('div');
        beforeDiv.className = 'info__text-before';
        beforeDiv.innerHTML = `<span class="info__title main__title main__title--small">${beforeText}</span>`;
        
        const imageClone = this.image.cloneNode(true);
        
        const afterDiv = document.createElement('div');
        afterDiv.className = 'info__text-after';
        afterDiv.innerHTML = `<span class="info__title main__title main__title--small">${afterText} ${accentHtml}</span>`;
        
        this.container.appendChild(beforeDiv);
        this.container.appendChild(imageClone);
        this.container.appendChild(afterDiv);
        
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'column';
        this.container.style.gap = '24px';
        
        this.isSplit = true;
    }
    
    restoreText() {
        if (!this.isSplit) return;
        
        this.container.innerHTML = '';
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = this.originalHtml;
        const originalTitle = tempDiv.firstChild;
        
        const originalImage = this.image.cloneNode(true);
        
        this.container.appendChild(originalTitle);
        this.container.appendChild(originalImage);
        
        this.container.style.display = this.originalDisplay || '';
        this.container.style.flexDirection = '';
        this.container.style.gap = '';
        
        this.title = this.container.querySelector('#infoTitle');
        this.image = this.container.querySelector('#infoImage');
        
        this.isSplit = false;
    }
}