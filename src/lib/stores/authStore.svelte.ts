import { API_ROUTE } from "$lib/constants";
import SessionLS, { type Session } from "$lib/localStorage/session";

interface AuthState {
	isAuth: boolean;
	password: string;
  isDemoMode: boolean;
}

interface AuthStore {
	isAuth: boolean;
	password: string;
  fullApiRoute: string;
  isDemoMode: boolean;
	setPassword: (password: string) => void;
  setDemoMode: (demoMode: boolean) => void;
  saveSession: (session: Session) => void;
  getSession: () => Session | null;
  removeSession: () => void;
  init: () => void;
}

const defaultAuthStoreValue: AuthState = { isAuth: false, password: '', isDemoMode: false };

const authState = $state<AuthState>(defaultAuthStoreValue);

const authStore: AuthStore = {
	get isAuth() {
		return authState.isAuth;
	},
	get password() {
		return authState.password;
	},
  get fullApiRoute() {
    return `${API_ROUTE}${authStore.password}`;
  },
  get isDemoMode() {
    return authState.isDemoMode;
  },
  init() {
    const session = SessionLS.getLoginSession();
    if (session) {
      authStore.setPassword(session.port);
      authStore.setDemoMode(!!session.demoMode);
    }
  },
	setPassword(port: string) {
		authState.password = port;
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
