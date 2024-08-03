interface WindowState {
	width: number;
	height: number;
}

interface WindowStore {
	width: WindowState['width'];
	height: WindowState['height'];
	init: () => void;
	setWindowSizes: () => void;
}

const defaultWindowState: WindowState = { width: 0, height: 0 };

const windowState = $state<WindowState>(defaultWindowState);

const windowStore: WindowStore = {
	get width() {
		return windowState.width;
	},
	get height() {
		return windowState.height;
	},
	setWindowSizes() {
		windowState.width = window.innerWidth;
		windowState.height = window.innerHeight;
	},
	init() {
		windowStore.setWindowSizes();
		window.addEventListener('resize', () => {
			windowStore.setWindowSizes();
		});
	}
};

export default windowStore;
