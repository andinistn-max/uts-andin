import { useState } from "react";
import { Receipt, RotateCcw } from "lucide-react";
import Modal from "./Modal";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { rupiah, formatDate } from "../utils/pricing";

export default function HistoryModal({ onClose }) {
  const { state, dispatch } = useCart();
  const { notify } = useToast();
  const [confirming, setConfirming] = useState(false);
  const spent = state.history.reduce((t, o) => t + o.total, 0);

  const reset = () => {
    dispatch({ type: "RESET" });
    setConfirming(false);
    notify("Stok dan riwayat transaksi direset");
  };

  return (
    <Modal title="Riwayat Transaksi" onClose={onClose} wide>
      <div className="summary">
        <div><small>Pesanan dibayar</small><b>{state.history.length}</b></div>
        <div><small>Total belanja</small><b>{rupiah(spent)}</b></div>
      </div>

      {state.history.length === 0 ? (
        <div className="empty small"><Receipt size={40} /><p>Belum ada transaksi.</p></div>
      ) : (
        <ul className="history-list">
          {state.history.map((o) => (
            <li key={o.id}>
              <div className="row"><b>{o.id}</b><span>{formatDate(o.at)}</span></div>
              <small>{o.items.map((i) => `${i.name} x${i.qty}`).join(", ")}</small>
              <div className="row">
                <span>{o.promo ? `Promo ${o.promo}` : "Tanpa promo"}</span>
                <b>{rupiah(o.total)}</b>
              </div>
            </li>
          ))}
        </ul>
      )}

      {confirming ? (
        <div className="confirm">
          <p>Reset stok dan hapus semua riwayat? Tindakan ini tidak bisa dibatalkan.</p>
          <button className="danger" onClick={reset}>Ya, reset</button>
          <button className="ghost-text" onClick={() => setConfirming(false)}>Batal</button>
        </div>
      ) : (
        <button className="danger-outline" onClick={() => setConfirming(true)}>
          <RotateCcw size={16} /> Reset stok + riwayat
        </button>
      )}
    </Modal>
  );
}
