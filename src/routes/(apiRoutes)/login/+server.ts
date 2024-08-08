import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const { pass } = await request.json();

	if (pass === import.meta.env.VITE_LOGIN_PASS) {
		return json({ status: 'success', data: import.meta.env.VITE_CONTROLLER_PORT }, { status: 201 });
	}

	return json({ status: 'error', data: "Wrong password !" }, { status: 201 });
}
