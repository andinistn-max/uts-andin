import { useState } from "react";
import { X, Minus, Plus, Trash2, ShoppingBag, Tag, CheckCircle2, Coffee } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { PROMOS, rupiah, formatDate } from "../utils/pricing";

function Receipt({ order, onClose }) {
  return (
    <div className="receipt">
      <CheckCircle2 size={44} className="ok" />
      <h3>Pembayaran Berhasil</h3>
      <div className="struk">
        <div className="struk-head"><Coffee size={18} /> KopiKu <small>{order.id}</small></div>
        <small>{formatDate(order.at)}</small>
        <hr />
        {order.items.map((i) => (
          <div className="row" key={i.id}>
            <span>{i.name} x{i.qty}</span><span>{rupiah(i.price * i.qty)}</span>
          </div>
        ))}
        <hr />
        <div className="row"><span>Subtotal</span><span>{rupiah(order.subtotal)}</span></div>
        {order.discount > 0 && <div className="row disc"><span>Promo {order.promo}</span><span>-{rupiah(order.discount)}</span></div>}
        <div className="row"><span>Pajak 10%</span><span>{rupiah(order.tax)}</span></div>
        <div className="row total"><span>Total</span><span>{rupiah(order.total)}</span></div>
      </div>
      <button className="primary" onClick={onClose}>Selesai</button>
    </div>
  );
}

export default function CartDrawer({ onClose }) {
  const { state, dispatch, lines, totals, remaining } = useCart();
  const { notify } = useToast();
  const [code, setCode] = useState("");
  const [receipt, setReceipt] = useState(null);

  // Promo aktif tapi belum berlaku (KOPI15 tanpa menu Kopi di keranjang)
  const activePromo = PROMOS[state.promo];
  const promoIdle =
    activePromo?.category && !lines.some((l) => l.category === activePromo.category);

  const applyPromo = () => {
    const c = code.trim().toUpperCase();
    const promo = PROMOS[c];
    if (!promo) return notify("Kode promo tidak valid", "error");
    if (promo.category && !lines.some((l) => l.category === promo.category)) {
      return notify(`Kode ${c} hanya berlaku untuk menu ${promo.category}`, "error");
    }
    dispatch({ type: "PROMO", code: c });
    setCode("");
    notify(`Kode promo ${c} dipakai`);
  };

  const removePromo = () => {
    dispatch({ type: "PROMO", code: "" });
    notify("Kode promo dilepas");
  };

  const inc = (l) => {
    if (l.qty >= remaining(l.id)) return notify(`Stok ${l.name} tidak mencukupi`, "error");
    dispatch({ type: "ADD", id: l.id });
  };

  const dec = (l) => {
    dispatch({ type: "DEC", id: l.id });
    notify(`${l.name} dikurangi`);
  };

  const remove = (l) => {
    dispatch({ type: "REMOVE", id: l.id });
    notify(`${l.name} dihapus dari keranjang`);
  };

  const checkout = () => {
    const order = {
      id: "TRX-" + Date.now().toString().slice(-6),
      at: Date.now(),
      promo: state.promo,
      items: lines.map((l) => ({ id: l.id, name: l.name, price: l.price, qty: l.qty })),
      ...totals,
    };
    dispatch({ type: "CHECKOUT", order });
    setReceipt(order);
    notify(`Pesanan ${order.id} berhasil dibayar`);
  };

  return (
    <div className="overlay drawer-wrap" onClick={onClose}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3><ShoppingBag size={20} /> Keranjang</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Tutup"><X size={20} /></button>
        </div>

        {receipt ? (
          <Receipt order={receipt} onClose={onClose} />
        ) : lines.length === 0 ? (
          <div className="empty small">
            <ShoppingBag size={44} />
            <p>Keranjang masih kosong.</p>
          </div>
        ) : (
          <>
            <ul className="cart-list">
              {lines.map((l) => (
                <li key={l.id}>
                  <div className="cart-info">
                    <b>{l.name}</b>
                    <small>{rupiah(l.price)}</small>
                  </div>
                  <div className="qty">
                    <button onClick={() => dec(l)}><Minus size={14} /></button>
                    <span>{l.qty}</span>
                    <button onClick={() => inc(l)}><Plus size={14} /></button>
                  </div>
                  <b className="line-total">{rupiah(l.price * l.qty)}</b>
                  <button className="icon-btn del" onClick={() => remove(l)} aria-label="Hapus"><Trash2 size={17} /></button>
                </li>
              ))}
            </ul>

            <div className="drawer-foot">
              <div className="promo">
                <Tag size={16} />
                <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Kode promo" />
                <button onClick={applyPromo}>Pakai</button>
              </div>
              {activePromo && (
                <p className="promo-on">
                  Promo <b>{state.promo}</b> aktif: {activePromo.label}
                  {promoIdle && <span className="error"> (belum berlaku, tidak ada menu {activePromo.category})</span>}
                  <button onClick={removePromo}>lepas</button>
                </p>
              )}
              <div className="row"><span>Subtotal</span><span>{rupiah(totals.subtotal)}</span></div>
              {totals.discount > 0 && <div className="row disc"><span>Diskon</span><span>-{rupiah(totals.discount)}</span></div>}
              <div className="row"><span>Pajak 10%</span><span>{rupiah(totals.tax)}</span></div>
              <div className="row total"><span>Total</span><span>{rupiah(totals.total)}</span></div>
              <button className="primary" onClick={checkout}>Bayar Sekarang</button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}