import { createContext } from "react";

export const InventoryContext = createContext({
    balance: 0,
    setBalance: () => { },
    userSkins: [],
    userData: {},
    setUserData: () => { },
    setUserSkins: () => { },
    allSkins: [],
    setAllSkins: () => { },
    buyItem: async () => { },
    unList: async () => { },
    List: async () => { },
    itemColourDefiner: () => { }
});