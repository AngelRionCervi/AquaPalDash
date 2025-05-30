import { json } from '@sveltejs/kit';
import { getUserWithEmailAndPass } from '$wsServer/utils';

export async function POST({ request }) {
  const { email, password } = await request.json();

  try {
    const user = await getUserWithEmailAndPass(email, password);

    if (!user) {
      return json({ error: 'User not found' }, { status: 404 });
    }

    return json({ message: 'Success', data: true }, { status: 201 });
  } catch (err) {
    console.error(err);
    return json({ error: 'User could not be found' }, { status: 500 });
  }
}
