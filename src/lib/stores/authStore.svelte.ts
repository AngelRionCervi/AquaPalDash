import { API_ROUTE } from "$lib/constants";
import SessionLS, { type Session } from "$lib/localStorage/session";

interface AuthState {
	isAuth: boolean;
	port: string;
  isDemoMode: boolean;
}

interface AuthStore {
	isAuth: boolean;
	port: string;
  fullApiRoute: string;
  isDemoMode: boolean;
	setPort: (port: string) => void;
  setDemoMode: (demoMode: boolean) => void;
  saveSession: (session: Session) => void;
  getSession: () => Session | null;
  removeSession: () => void;
  init: () => void;
}

const defaultAuthStoreValue: AuthState = { isAuth: false, port: '', isDemoMode: false };

const authState = $state<AuthState>(defaultAuthStoreValue);

const authStore: AuthStore = {
	get isAuth() {
		return authState.isAuth;
	},
	get port() {
		return authState.port;
	},
  get fullApiRoute() {
    return `${API_ROUTE}${authStore.port}`;
  },
  get isDemoMode() {
    return authState.isDemoMode;
  },
  init() {
    const session = SessionLS.getLoginSession();
    if (session) {
      authStore.setPort(session.port);
      authStore.setDemoMode(!!session.demoMode);
    }
  },
	setPort(port: string) {
		authState.port = port;
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
