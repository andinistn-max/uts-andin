import { Heart, Info, MessageCircle, ShoppingCart, Star, Coffee } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { rupiah } from "../utils/pricing";

export default function MenuCard({ item, isFav, reviewCount, onFav, onInfo, onComment }) {
  const { state, dispatch, remaining } = useCart();
  const { notify } = useToast();
  const left = remaining(item.id);
  const inCart = state.items[item.id] || 0;

  const add = () => {
    if (left <= 0) return notify(`${item.name} sedang habis`, "error");
    if (inCart >= left) return notify(`Stok ${item.name} hanya ${left}, semuanya sudah di keranjang`, "error");
    dispatch({ type: "ADD", id: item.id });
    notify(`${item.name} ditambahkan ke keranjang`);
  };

  return (
    <article className="card">
      <div className="thumb">
        <Coffee size={44} className="thumb-ph" />
        <img src={item.image} alt={item.name} loading="lazy" onError={(e) => (e.currentTarget.style.display = "none")} />
        <span className="chip">{item.category}</span>
        <button className={`fav${isFav ? " on" : ""}`} onClick={onFav} aria-label="Favorit" title="Favorit">
          <Heart size={20} />
        </button>
      </div>

      <div className="card-body">
        <div className="rate">
          <Star size={14} className="star on" /> {item.rating.toFixed(1)}
          <span>({reviewCount} ulasan)</span>
        </div>
        <h3>{item.name}</h3>
        <p className="desc">{item.description}</p>
        <div className="meta">
          <strong className="price">{rupiah(item.price)}</strong>
          <span className={`stock${left <= 3 ? " low" : ""}`}>{left > 0 ? `Stok ${left}` : "Habis"}</span>
        </div>
        <div className="actions">
          <button className="ghost" onClick={onInfo} title="Info"><Info size={20} /></button>
          <button className="ghost" onClick={onComment} title="Komentar"><MessageCircle size={20} /></button>
          <button className="add" onClick={add} disabled={left <= 0}>
            <ShoppingCart size={18} /> Add {inCart > 0 && <b>{inCart}</b>}
          </button>
        </div>
      </div>
    </article>
  );
}
