import { atom } from "recoil";

// Auth Modal, default state
const defaultState = {
    view: 'login'
}

export const authModalStateAtom = atom({
    key: 'authModalState',
    default: defaultState
})