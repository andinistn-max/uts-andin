import { createContext, useContext, useReducer, useEffect, useMemo } from "react";
import menu from "../data/menu";
import useLocalStorage from "../hooks/useLocalStorage";
import { calcTotals } from "../utils/pricing";

const CartContext = createContext(null);

// items: { idMenu: jumlah }, sold: { idMenu: terjual }, history: daftar pesanan
const initialState = { items: {}, promo: "", sold: {}, history: [] };

function reducer(state, action) {
  switch (action.type) {
    case "ADD":
      return { ...state, items: { ...state.items, [action.id]: (state.items[action.id] || 0) + 1 } };
    case "DEC": {
      const items = { ...state.items };
      const qty = (items[action.id] || 0) - 1;
      if (qty <= 0) delete items[action.id];
      else items[action.id] = qty;
      return { ...state, items };
    }
    case "REMOVE": {
      const items = { ...state.items };
      delete items[action.id];
      return { ...state, items };
    }
    case "PROMO":
      return { ...state, promo: action.code };
    case "CHECKOUT": {
      const sold = { ...state.sold };
      action.order.items.forEach((i) => (sold[i.id] = (sold[i.id] || 0) + i.qty));
      return { items: {}, promo: "", sold, history: [action.order, ...state.history] };
    }
    case "RESET":
      return { ...state, sold: {}, history: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [saved, setSaved] = useLocalStorage("kopiku-cart", initialState);
  const [state, dispatch] = useReducer(reducer, saved);

  useEffect(() => setSaved(state), [state, setSaved]);

  const lines = useMemo(
    () => menu.filter((m) => state.items[m.id]).map((m) => ({ ...m, qty: state.items[m.id] })),
    [state.items]
  );
  const totals = useMemo(() => calcTotals(lines, state.promo), [lines, state.promo]);
  const count = lines.reduce((t, l) => t + l.qty, 0);
  const remaining = (id) => menu.find((m) => m.id === id).stock - (state.sold[id] || 0);

  return (
    <CartContext.Provider value={{ state, dispatch, lines, totals, count, remaining }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
