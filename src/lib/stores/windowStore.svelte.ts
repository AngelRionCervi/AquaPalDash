interface WindowState {
  width: number;
  height: number;
}

interface WindowStore {
  width: WindowState['width'];
  height: WindowState['height'];
  init: () => void;
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
  init() {
    window.addEventListener('resize', () => {
      windowState.width = window.innerWidth;
      windowState.height = window.innerHeight;
    });
  }
};

export default windowStore;
