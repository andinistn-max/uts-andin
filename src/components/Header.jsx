import { Coffee, Search, ShoppingCart, Bell, Receipt } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useNotifications } from "../context/NotificationContext";

export default function Header({ search, onSearch, onOpen }) {
  const { count } = useCart();
  const { unread } = useNotifications();

  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand">
          <span className="brand-logo"><Coffee size={22} /></span>
          <div>
            <strong>KopiKu</strong>
            <small>Seduh harimu</small>
          </div>
        </div>

        <label className="search">
          <Search size={18} />
          <input value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Cari menu favoritmu..." />
        </label>

        <div className="header-actions">
          <button className="icon-btn light" onClick={() => onOpen("history")} title="Riwayat transaksi">
            <Receipt size={21} />
          </button>
          <button className="icon-btn light" onClick={() => onOpen("notif")} title="Notifikasi">
            <Bell size={21} />
            {unread > 0 && <span className="badge">{unread > 99 ? "99+" : unread}</span>}
          </button>
          <button className="icon-btn light" onClick={() => onOpen("cart")} title="Keranjang">
            <ShoppingCart size={21} />
            {count > 0 && <span className="badge">{count}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
