import { json } from '@sveltejs/kit';
import { getUserWithEmailAndPass, updateUserPassword } from '$wsServer/utils';

export async function POST({ request }) {
  const { email, oldPassword, newPassword } = await request.json();

  const user = getUserWithEmailAndPass(email, oldPassword);

  if (!user) {
    return json({ error: 'Invalid password' }, { status: 401 });
  }

  await updateUserPassword(user.userId, newPassword);

  return json({ message: 'Success' }, { status: 201 });
}
