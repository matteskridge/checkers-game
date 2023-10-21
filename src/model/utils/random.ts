import { v4 } from "uuid";

export const randomNumber = () => {
  return Math.random();
}

export const getId = () => {
  return v4();
}
