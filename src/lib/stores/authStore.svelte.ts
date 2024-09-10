import SessionLS, { type Session } from '$lib/localStorage/session';

interface AuthState {
  isAuth: boolean;
  password: string;
  isDemoMode: boolean;
  userId: string;
  needLogin: boolean;
  email: string;
}

interface AuthStore {
  isAuth: boolean;
  password: string;
  email: string;
  isDemoMode: boolean;
  userId: string;
  needLogin: boolean;
  setDemoMode: (demoMode: boolean) => void;
  setPassword: (password: string) => void;
  setEmail: (email: string) => void;
  saveSession: (session: Session) => void;
  getSession: () => Session | null;
  removeSession: () => void;
  setUserId: (userId: string) => void;
  removeSessionAndReload: () => void;
  changeUserPassword: (oldPassword: string, newPassword: string) => Promise<void>;
  init: () => void;
}

const defaultAuthStoreValue: AuthState = { isAuth: false, password: '', email: '', isDemoMode: false, userId: '', needLogin: true };

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
  get email() {
    return authState.email;
  },
  set needLogin(needLogin: boolean) {
    authState.needLogin = needLogin;
  },
  init() {
    const session = SessionLS.getLoginSession();
    if (session) {
      authStore.setDemoMode(!!session.demoMode);
      authStore.setPassword(session.password);
      authStore.setEmail(session.email);
    }
  },
  setDemoMode(demoMode: boolean) {
    authState.isDemoMode = demoMode;
  },
  setPassword(password: string) {
    authState.password = password;
  },
  setEmail(email: string) {
    authState.email = email;
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
  },
  async changeUserPassword(oldPassword: string, newPassword: string) {
    const session = authStore.getSession();
    if (!session) {
      return;
    }
    const res = await fetch('/api/account/modifyPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: session.email,
        oldPassword,
        newPassword
      })
    });
    if (res.ok) {
      authStore.removeSessionAndReload();
    }
  }
};

export default authStore;
