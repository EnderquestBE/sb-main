import { ShopCurrency } from "../../Types/types";

const CurrencyInfo: { [key in ShopCurrency]: { prefix: string, suffix: string } } = {
    money: {
        prefix: "$",
        suffix: ""
    },
    xp: {
        prefix: "",
        suffix: " XP"
    }
}

export { CurrencyInfo }