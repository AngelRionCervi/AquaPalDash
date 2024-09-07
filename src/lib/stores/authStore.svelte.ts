import SessionLS, { type Session } from '$lib/localStorage/session';

interface AuthState {
  isAuth: boolean;
  password: string;
  isDemoMode: boolean;
  userId: string;
  needLogin: boolean;
}

interface AuthStore {
  isAuth: boolean;
  password: string;
  isDemoMode: boolean;
  userId: string;
  needLogin: boolean;
  setDemoMode: (demoMode: boolean) => void;
  setPassword: (password: string) => void;
  saveSession: (session: Session) => void;
  getSession: () => Session | null;
  removeSession: () => void;
  setUserId: (userId: string) => void;
  removeSessionAndReload: () => void;
  init: () => void;
}

const defaultAuthStoreValue: AuthState = { isAuth: false, password: '', isDemoMode: false, userId: '', needLogin: true };

const authState = $state<AuthState>(defaultAuthStoreValue);

const authStore: AuthStore = {
  get isAuth() {
    return authState.isAuth;
  },
  get password() {
    return authState.password;
  },
  get isDemoMode() {
    return authState.isDemoMode;
  },
  get userId() {
    return authState.userId;
  },
  get needLogin() {
    return authState.needLogin;
  },
  set needLogin(needLogin: boolean) {
    authState.needLogin = needLogin;
  },
  init() {
    const session = SessionLS.getLoginSession();
    if (session) {
      authStore.setDemoMode(!!session.demoMode);
      authStore.setPassword(session.password);
    }
  },
  setDemoMode(demoMode: boolean) {
    authState.isDemoMode = demoMode;
  },
  setPassword(password: string) {
    authState.password = password;
  },
  saveSession(session: Session) {
    SessionLS.setLoginSession(session);
  },
  getSession() {
    return SessionLS.getLoginSession();
  },
  removeSession() {
    SessionLS.removeLoginSession();
  },
  setUserId(userId: string) {
    authState.userId = userId;
  },
  removeSessionAndReload() {
    authStore.removeSession();
    window.location.reload();
  }
};

export default authStore;
