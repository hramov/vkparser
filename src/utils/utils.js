import { genSalt, hash } from "bcrypt";

export async function hashPassword(password) {
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);
    return hashedPassword;
}