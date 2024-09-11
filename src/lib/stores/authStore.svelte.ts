import SessionLS, { type Session } from '$lib/localStorage/session';

interface CallState {
  isLoading: boolean;
  error: string;
}

interface AuthState {
  isAuth: boolean;
  password: string;
  isDemoMode: boolean;
  userId: string;
  needLogin: boolean;
  email: string;
  callStates: {
    modifyPassword: CallState;
    checkIfUserExists: CallState;
  };
}

interface AuthStore {
  isAuth: boolean;
  password: string;
  email: string;
  isDemoMode: boolean;
  userId: string;
  needLogin: boolean;
  modifyPasswordError: string;
  callStates: AuthState['callStates'];
  setDemoMode: (demoMode: boolean) => void;
  setPassword: (password: string) => void;
  setEmail: (email: string) => void;
  saveSession: (session: Session) => void;
  getSession: () => Session | null;
  removeSession: () => void;
  setUserId: (userId: string) => void;
  removeSessionAndReload: () => void;
  checkIfUserExists: (email: string, password: string) => Promise<boolean>;
  modifyUserPassword: (oldPassword: string, newPassword: string) => Promise<void>;
  init: () => void;
}

const defaultAuthStoreValue: AuthState = {
  isAuth: false,
  password: '',
  email: '',
  isDemoMode: false,
  userId: '',
  needLogin: true,
  callStates: {
    modifyPassword: { error: '', isLoading: false },
    checkIfUserExists: { error: '', isLoading: false }
  }
};

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
  get modifyPasswordError() {
    return authState.callStates.modifyPassword.error;
  },
  get callStates() {
    return authState.callStates;
  },
  set modifyPasswordError(error: string) {
    authState.callStates.modifyPassword.error = error;
    if (error) {
      console.error(error);
    }
  },
  set needLogin(needLogin: boolean) {
    authState.needLogin = needLogin;
  },
  init() {
    const session = SessionLS.getLoginSession();
    console.log('init session', session);
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
  async checkIfUserExists(email: string, password: string) {
    try {
      authState.callStates.checkIfUserExists.isLoading = true;
      const res = await fetch('/api/account/checkUserExists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });
      if (res.ok) {
        authState.needLogin = false;
        return true;
      } else {
        authState.needLogin = true;
        console.error('Could not find user');
        authState.callStates.checkIfUserExists.error = 'Could not find user';
        return false;
      }
    } catch (err) {
      console.error('Error while checking if user exists', err);
      authState.needLogin = true;
      authState.callStates.checkIfUserExists.error = 'Error while checking if user exists';
      return false;
    } finally {
      authState.callStates.checkIfUserExists.isLoading = false;
    }
  },
  async modifyUserPassword(oldPassword: string, newPassword: string) {
    console.log('authState.email', authState.email);
    const email = authState.email;
    if (!email) {
      return;
    }
    try {
      authState.callStates.modifyPassword.isLoading = true;
      const res = await fetch('/api/account/modifyPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          oldPassword,
          newPassword
        })
      });
      if (res.ok) {
        authState.callStates.modifyPassword.error = '';
      } else {
        authState.callStates.modifyPassword.error = 'Error while changing password';
      }
    } catch (err) {
      authState.callStates.modifyPassword.error = 'Error while changing password';
      console.error('Error while changing password', err);
    } finally {
      authState.callStates.modifyPassword.isLoading = false;
    }
  }
};

export default authStore;
