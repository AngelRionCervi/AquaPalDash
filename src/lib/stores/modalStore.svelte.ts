import type { ModalTypes } from '$lib/components/Modal/types';

interface ModalState {
  isOpen: boolean;
  type: ModalTypes | null;
  subtitle?: string;
  childProps?: Record<string, any>;
}

interface ModalStore {
  isOpen: boolean;
  type: ModalTypes | null;
  subtitle?: string;
  childProps?: Record<string, any>;
  toggle: (type?: ModalTypes, childProps?: ModalState['childProps'], subtitle?: string) => void;
}

const defaultModalStoreValue: ModalState = { isOpen: false, type: null };

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
  get childProps() {
    return modalState.childProps;
  },
  set childProps(value) {
    modalState.childProps = value;
  },
  toggle(type?: ModalTypes, childProps?: ModalState['childProps'], subtitle?: string) {
    console.log('toggle', type, childProps, subtitle);

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
    } else {
      document.body.classList.remove('no-scroll');
    }
  }
};

export default modalStore;
