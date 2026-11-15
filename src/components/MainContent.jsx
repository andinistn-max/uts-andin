import { useState } from "react";
import { Heart, Package, SearchX, Star } from "lucide-react";
import MenuCard from "./MenuCard";
import Modal from "./Modal";
import StarRating from "./StarRating";
import { rupiah, formatDate } from "../utils/pricing";
import { useCart } from "../context/CartContext";

const TABS = ["Semua", "Kopi", "Non-Kopi", "Makanan", "Snack", "Favorit"];
const SORTS = {
  default: "Urutan menu",
  "price-asc": "Harga termurah",
  "price-desc": "Harga termahal",
  rating: "Rating tertinggi",
  name: "Nama A-Z",
  "fav-new": "Favorit terbaru",
  "fav-old": "Favorit terlama",
};

function InfoModal({ item, reviews, onClose }) {
  const { remaining } = useCart();
  return (
    <Modal title="Detail Menu" onClose={onClose}>
      <div className="info-photo">
        <img src={item.image} alt={item.name} onError={(e) => (e.currentTarget.style.display = "none")} />
      </div>
      <h2 className="info-title">{item.name}</h2>
      <div className="info-grid">
        <div><small>Kategori</small><b>{item.category}</b></div>
        <div><small>Harga</small><b>{rupiah(item.price)}</b></div>
        <div><small>Stok</small><b>{remaining(item.id)} tersisa</b></div>
        <div><small>Rating</small><b><Star size={14} className="star on" /> {item.rating.toFixed(1)}</b></div>
      </div>
      <p className="desc full">{item.description}</p>
      <h4>Ulasan ({reviews.length})</h4>
      {reviews.length === 0 ? (
        <p className="muted">Belum ada ulasan. Jadilah yang pertama!</p>
      ) : (
        <ul className="review-list">
          {reviews.map((r) => (
            <li key={r.id}>
              <StarRating value={r.rating} size={14} />
              <p>{r.text}</p>
              <small>{formatDate(r.at)}</small>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}

function CommentModal({ item, reviews, onSubmit, onClose }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const send = () => {
    if (rating < 1) return setError("Pilih rating bintang 1 sampai 5.");
    if (text.trim().length < 5) return setError("Komentar minimal 5 karakter.");
    onSubmit(rating, text.trim());
    setRating(0);
    setText("");
    setError("");
  };

  return (
    <Modal title={`Komentar: ${item.name}`} onClose={onClose}>
      <div className="form">
        <label>Rating kamu</label>
        <StarRating value={rating} onChange={(n) => { setRating(n); setError(""); }} size={30} />
        <label>Komentar</label>
        <textarea rows={3} value={text} onChange={(e) => { setText(e.target.value); setError(""); }} placeholder="Ceritakan pengalamanmu..." />
        {error && <p className="error">{error}</p>}
        <button className="primary" onClick={send}>Kirim Komentar</button>
      </div>
      <h4>Komentar masuk ({reviews.length})</h4>
      {reviews.length === 0 ? (
        <p className="muted">Belum ada komentar.</p>
      ) : (
        <ul className="review-list">
          {reviews.map((r) => (
            <li key={r.id}>
              <StarRating value={r.rating} size={14} />
              <p>{r.text}</p>
              <small>{formatDate(r.at)}</small>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}

export default function MainContent({ menu, search, favorites, comments, onToggleFavorite, onAddComment }) {
  const [tab, setTab] = useState("Semua");
  const [sort, setSort] = useState("default");
  const [infoId, setInfoId] = useState(null);
  const [commentId, setCommentId] = useState(null);

  const matches = (m, cat) =>
    cat === "Semua" || (cat === "Favorit" ? favorites.includes(m.id) : m.category === cat);
  const bySearch = menu.filter((m) => m.name.toLowerCase().includes(search.trim().toLowerCase()));

  // urutan aktif: opsi "favorit" hanya berlaku di tab Favorit
  const active = tab === "Favorit" ? (sort === "default" ? "fav-new" : sort) : sort.startsWith("fav") ? "default" : sort;
  const sorters = {
    default: () => 0,
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating,
    name: (a, b) => a.name.localeCompare(b.name),
    "fav-new": (a, b) => favorites.indexOf(b.id) - favorites.indexOf(a.id),
    "fav-old": (a, b) => favorites.indexOf(a.id) - favorites.indexOf(b.id),
  };
  const list = bySearch.filter((m) => matches(m, tab)).sort(sorters[active]);
  const options = Object.entries(SORTS).filter(([k]) => tab === "Favorit" || !k.startsWith("fav"));

  const infoItem = menu.find((m) => m.id === infoId);
  const commentItem = menu.find((m) => m.id === commentId);

  return (
    <main className="main">
      <section className="hero">
        <div>
          <span className="hero-tag"><Package size={14} /> {menu.length} menu pilihan</span>
          <h1>Kopi enak, hari jadi lebih baik.</h1>
          <p>Pilih menu favoritmu, tambahkan ke keranjang, dan nikmati promo spesial dengan kode UTS25, HEMAT10, atau KOPI15.</p>
        </div>
      </section>

      <section className="toolbar">
        <div className="tabs">
          {TABS.map((t) => (
            <button key={t} className={`tab${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>
              {t === "Favorit" && <Heart size={14} />} {t}
              <span className="count">{bySearch.filter((m) => matches(m, t)).length}</span>
            </button>
          ))}
        </div>
        <select className="sort" value={active} onChange={(e) => setSort(e.target.value)}>
          {options.map(([k, label]) => (
            <option key={k} value={k}>Urutkan: {label}</option>
          ))}
        </select>
      </section>

      {list.length === 0 ? (
        <div className="empty">
          <SearchX size={48} />
          <h3>{tab === "Favorit" ? "Belum ada menu favorit" : "Menu tidak ditemukan"}</h3>
          <p>{tab === "Favorit" ? "Klik ikon hati pada menu untuk menyimpannya di sini." : "Coba kata kunci atau kategori lain."}</p>
        </div>
      ) : (
        <div className="grid">
          {list.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              isFav={favorites.includes(item.id)}
              reviewCount={(comments[item.id] || []).length}
              onFav={() => onToggleFavorite(item)}
              onInfo={() => setInfoId(item.id)}
              onComment={() => setCommentId(item.id)}
            />
          ))}
        </div>
      )}

      {infoItem && <InfoModal item={infoItem} reviews={comments[infoItem.id] || []} onClose={() => setInfoId(null)} />}
      {commentItem && (
        <CommentModal
          item={commentItem}
          reviews={comments[commentItem.id] || []}
          onSubmit={(rating, text) => onAddComment(commentItem, rating, text)}
          onClose={() => setCommentId(null)}
        />
      )}
    </main>
  );
}
