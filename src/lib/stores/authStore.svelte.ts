import { API_ROUTE } from "$lib/constants";

interface AuthState {
	isAuth: boolean;
	pass: string;
}

interface AuthStore {
	isAuth: boolean;
	pass: string;
  fullApiRoute: string;
	setPass: (pass: string) => void;
}

const defaultAuthStoreValue: AuthState = { isAuth: false, pass: '' };

const authState = $state<AuthState>(defaultAuthStoreValue);

const authStore: AuthStore = {
	get isAuth() {
		return authState.isAuth;
	},
	get pass() {
		return authState.pass;
	},
  get fullApiRoute() {
    return `${API_ROUTE}${authStore.pass}`;
  },
	setPass(pass: string) {
		authState.pass = pass;
	}
};

export default authStore;
