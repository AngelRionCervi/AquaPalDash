import type { ModalTypes } from '$lib/components/Modal/types';

interface ModalState {
	isOpen: boolean;
	title: string;
  type: ModalTypes | null;
}

interface ModalStore {
	isOpen: boolean;
  title: string;
  type: ModalTypes | null;
	toggle: (title?: string, type?: ModalTypes) => void;
}

let modalState = $state<ModalState>({ isOpen: false, title: '', type: null });

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
	toggle(title?: string, type?: ModalTypes) {
		modalState.isOpen = !modalState.isOpen;
		if (title) {
			modalState.title = title;
		}
    if (type) {
			modalState.type = type;
		}
	},
};

export default modalStore;
