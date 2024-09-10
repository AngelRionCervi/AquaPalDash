export interface Session {
  email: string;
  password: string;
  demoMode?: boolean;
}

function setLoginSession(session: Session) {
  localStorage.setItem('session', JSON.stringify({ password: session.password, email: session.email, demoMode: !!session.demoMode }));
}

function getLoginSession(): Session | null {
  const session = localStorage.getItem('session');
  return session ? JSON.parse(session) : null;
}

function removeLoginSession() {
  localStorage.removeItem('session');
}

const SessionLS = {
  setLoginSession,
  getLoginSession,
  removeLoginSession
};

export default SessionLS;
