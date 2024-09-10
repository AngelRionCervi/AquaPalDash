import { json } from '@sveltejs/kit';
import { getUserWithEmailAndPass, updateUserPassword } from '$wsServer/utils';
import { MIN_PASSWORD_LENGTH } from '$lib/constants.js';

export async function POST({ request }) {
  const { email, oldPassword, newPassword } = await request.json();
  console.log('POST NEW PASS', email, oldPassword, newPassword);

  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return json({ error: 'Password must be at least 6 characters long' }, { status: 401 });
  }

  if (newPassword === oldPassword) {
    return json({ error: 'New password must be different' }, { status: 401 });
  }

  const user = await getUserWithEmailAndPass(email, oldPassword);
  console.log('USERUSERUSERUSERUSER', user, email, oldPassword);

  if (!user) {
    return json({ error: 'No user found with the previous password' }, { status: 401 });
  }

  try {
    const isUpdated = await updateUserPassword(user.userId, newPassword);

    if (!isUpdated) {
      return json({ error: 'Error while changing password' }, { status: 500 });
    }

    return json({ message: 'Success' }, { status: 201 });
  } catch (err) {
    console.error(err);
    return json({ error: 'Error while changing password' }, { status: 500 });
  }
}
