import { customAlphabet } from "nanoid"

export const generatePassword = () => {
    const randomLength = Math.floor(Math.random() * (12 -8 + 1)) + 8
    const nanoId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', randomLength)
    return nanoId()
}