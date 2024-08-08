import { API_ROUTE } from "$lib/constants";
import SessionLS, { type Session } from "$lib/localStorage/session";

interface AuthState {
	isAuth: boolean;
	pass: string;
  isDemoMode: boolean;
}

interface AuthStore {
	isAuth: boolean;
	pass: string;
  fullApiRoute: string;
  isDemoMode: boolean;
	setPass: (pass: string) => void;
  setDemoMode: (demoMode: boolean) => void;
  saveSession: (session: Session) => void;
  getSession: () => Session | null;
  removeSession: () => void;
  init: () => void;
}

const defaultAuthStoreValue: AuthState = { isAuth: false, pass: '', isDemoMode: false };

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
  get isDemoMode() {
    return authState.isDemoMode;
  },
  init() {
    const session = SessionLS.getLoginSession();
    if (session) {
      authStore.setPass(session.password);
      authStore.setDemoMode(!!session.demoMode);
    }
  },
	setPass(pass: string) {
		authState.pass = pass;
	},
  setDemoMode(demoMode: boolean) {
    authState.isDemoMode = demoMode
  },
  saveSession(session: Session) {
    SessionLS.setLoginSession(session);
  },
  getSession() {
    return SessionLS.getLoginSession();
  },
  removeSession() {
    SessionLS.removeLoginSession();
  }
};

export default authStore;
