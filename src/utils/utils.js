import { genSalt, hash } from "bcrypt";

export function hashPassword(password) {
    const salt = genSalt(10);
    const hashedPassword = hash(password, salt);
    return hashedPassword;
}