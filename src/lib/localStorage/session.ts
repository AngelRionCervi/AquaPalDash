export interface Session {
	port: string;
  demoMode?: boolean;
}

function setLoginSession(session: Session) {
	localStorage.setItem('session', JSON.stringify({ port: session.port, demoMode: !!session.demoMode }));
}

function getLoginSession() {
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
