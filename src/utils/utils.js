import { hash, compare } from "bcrypt";

export async function hashPassword(password) {
    const salt = parseInt('salt');
    const hashedPassword = await hash(password, salt);
    return hashedPassword;
}

export async function isUser(password, hashedPassword) {
    return await compare(password, hashedPassword)
}