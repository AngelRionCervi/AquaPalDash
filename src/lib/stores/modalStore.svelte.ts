import type { ModalTypes } from '$lib/components/Modal/types';

interface ModalState {
  isOpen: boolean;
  type: ModalTypes | null;
  scrolledTop: number;
  subtitle?: string;
  frozen?: boolean;
  childProps?: Record<string, any>;
}

interface ModalStore {
  isOpen: boolean;
  type: ModalTypes | null;
  scrolledTop: number;
  subtitle?: string;
  childProps?: Record<string, any>;
  frozen?: boolean;
  toggle: (type?: ModalTypes, childProps?: ModalState['childProps'], subtitle?: string) => void;
}

const defaultModalStoreValue: ModalState = { isOpen: false, type: null, scrolledTop: 0 };

const modalState = $state<ModalState>(defaultModalStoreValue);

const modalStore: ModalStore = {
  get isOpen() {
    return modalState.isOpen;
  },
  get subtitle() {
    return modalState.subtitle;
  },
  get type() {
    return modalState.type;
  },
  get frozen() {
    return modalState.frozen;
  },
  set frozen(value) {
    modalState.frozen = value;
  },
  get childProps() {
    return modalState.childProps;
  },
  set childProps(value) {
    modalState.childProps = value;
  },
  get scrolledTop() {
    return modalState.scrolledTop;
  },
  toggle(type?: ModalTypes, childProps?: ModalState['childProps'], subtitle?: string) {

    modalState.isOpen = !!type;

    if (!childProps) {
      modalState.childProps = {};
    }

    if (!modalState.isOpen) {
      modalState.type = null;
      modalState.childProps = {};
      modalState.subtitle = '';
    }

    if (type) {
      modalState.type = type;
    }
    if (childProps) {
      modalState.childProps = childProps;
    }
    if (subtitle) {
      modalState.subtitle = subtitle;
    }

    if (modalState.isOpen) {
      document.body.classList.add('no-scroll');
      modalState.scrolledTop = window.scrollY;
    } else {
      document.body.classList.remove('no-scroll');
      window.scrollTo(0, modalState.scrolledTop);
    }
  }
};

export default modalStore;
