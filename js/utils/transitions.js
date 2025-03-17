export class ScreenManager {
    constructor() {
        this.currentScreen = null;
        this.screens = new Map();
    }

    register(screenId, screenModule) {
        this.screens.set(screenId, screenModule);
    }

    transition(toScreenId) {
        if (this.currentScreen) {
            document.getElementById(this.currentScreen).classList.add('hidden');
        }
        
        const nextScreen = this.screens.get(toScreenId);
        const element = document.getElementById(toScreenId);
        
        element.innerHTML = nextScreen.content;
        element.classList.remove('hidden');
        
        if (nextScreen.init) {
            nextScreen.init();
        }
        
        this.currentScreen = toScreenId;
    }
} 