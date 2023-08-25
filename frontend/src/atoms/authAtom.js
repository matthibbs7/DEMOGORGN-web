import { atom } from "recoil";

// TypeScript interface
// export interface AuthState {
//     authenticated: boolean;
//     email?: string;
//     username?: string;
//     password?: string;
// }

// Auth Modal, default state
const defaultState = {
    authenticated: false,
}

export const authStateAtom = atom({
    key: 'authState',
    default: defaultState
})