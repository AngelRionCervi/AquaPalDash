import type { ModalTypes } from '$lib/components/Modal/types';

interface ModalState {
	isOpen: boolean;
	title: string;
	type: ModalTypes | null;
  childProps?: Record<string, any>
}

interface ModalStore {
	isOpen: boolean;
	title: string;
	type: ModalTypes | null;
  childProps?: Record<string, any>
	toggle: (title?: string, type?: ModalTypes, childProps?: ModalState["childProps"]) => void;
}

const defaultModalStoreValue: ModalState = { isOpen: false, title: '', type: null };

let modalState = $state<ModalState>(defaultModalStoreValue);

const modalStore: ModalStore = {
	get isOpen() {
		return modalState.isOpen;
	},
	get title() {
		return modalState.title;
	},
	get type() {
		return modalState.type;
	},
  get childProps() {
    return modalState.childProps;
  },
	toggle(title?: string, type?: ModalTypes, childProps?: ModalState["childProps"]) {
		modalState.isOpen = !modalState.isOpen;
		if (title) {
			modalState.title = title;
		}
		if (type) {
			modalState.type = type;
		}
    if (childProps) {
      modalState.childProps = childProps;
    }
	}
};

export default modalStore;
