async function modifyUserPassword(email: string, oldPassword: string, newPassword: string) {
  return await fetch('/api/account/modifyPassword', {
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
}

async function checkIfUserExists(email: string, password: string) {
  return await fetch('/api/account/checkUserExists', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password
    })
  });
}

export const API_ACCOUNT = {
  modifyUserPassword,
  checkIfUserExists
};
