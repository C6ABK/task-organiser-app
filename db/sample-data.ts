import { hashSync } from "bcrypt-ts-edge";

const users = [
  {
    email: "john@example.com",
    firstName: "John",
    lastName: "Doe",
    password: hashSync("password123", 10),
  },
  {
    email: "jane@example.com",
    firstName: "Jane",
    lastName: "Doe",
    password: hashSync("password123", 10),
  },
];

export default users;
