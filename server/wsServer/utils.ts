import path from 'path';
import type { User } from '../wsGlobal/types';
import fs from 'fs/promises';

function usersPath() {
  return path.resolve('server', 'db', 'users.json');
}

async function getUsers() {
  const file = await fs.readFile(usersPath(), 'utf-8');
  if (!file) {
    return [];
  }
  return JSON.parse(file) as User[];
}

export async function getUserWithPass(pass: string) {
  const user = (await getUsers()).find((user) => user.password === pass);
  return user;
}

export async function getBoxIdWithUserId(userId: string) {
  const user = (await getUsers()).find((user) => user.userId === userId);
  return user?.boxId;
}

export async function getUserIdWithBoxId(boxId: string) {
  const user = (await getUsers()).find((user) => user.boxId === boxId);
  return user?.userId;
}

export async function getUserWithEmailAndPass(email: string, pass: string) {
  const user = (await getUsers()).find((user) => user.email === email && user.password === pass);
  console.log('getUserWithEmailAndPass USER', user);
  return user;
}

export async function getUserWithUserId(userId: string) {
  const user = (await getUsers()).find((user) => user.userId === userId);
  return user;
}

export async function updateUserPassword(userId: string, newPassword: string) {
  const users = await getUsers();
  console.log('updateUserPassword', userId, newPassword, users);
  const userIndex = users.findIndex((user) => user.userId === userId);
  if (userIndex === -1) {
    return false;
  }
  users[userIndex].password = newPassword;

  try {
    await fs.writeFile(usersPath(), JSON.stringify(users, null, 2));
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
