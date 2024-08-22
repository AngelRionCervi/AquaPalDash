import users from "../db/users.json"
import { User } from "../wsGlobal/types";

export function getUserWithPass(pass: string): User | undefined {
  const user  = users.find((user) => user.password === pass)
  console.log('user', user);
  return user;
}

export function getBoxIdWithUserId(userId: string) {
  const user = users.find((user) => user.userId === userId)
  return user?.boxId;
}

export function getUserIdWithBoxId(boxId: string) {
  const user = users.find((user) => user.boxId === boxId)
  return user?.userId;
}
