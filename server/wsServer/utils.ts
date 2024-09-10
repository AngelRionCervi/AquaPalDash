import users from '../db/users.json';
import { User } from '../wsGlobal/types';
import fs from 'fs/promises'

export function getUserWithPass(pass: string): User | undefined {
  const user = users.find((user) => user.password === pass);
  return user;
}

export function getBoxIdWithUserId(userId: string) {
  const user = users.find((user) => user.userId === userId);
  return user?.boxId;
}

export function getUserIdWithBoxId(boxId: string) {
  const user = users.find((user) => user.boxId === boxId);
  return user?.userId;
}

export function getUserWithEmailAndPass(email: string, pass: string): User | undefined {
  const user = users.find((user) => user.email === email && user.password === pass);
  return user;
}

export function getUserWithUserId(userId: string): User | undefined {
  const user = users.find((user) => user.userId === userId);
  return user;
}

export async function updateUserPassword(userId: string, newPassword: string) {
  const userIndex = users.findIndex((user) => user.userId === userId);
  if (userIndex === -1) {
    return false;
  }
  users[userIndex].password = newPassword;

  try {
    await fs.writeFile('./src/db/users.json', JSON.stringify(users, null, 2));
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
