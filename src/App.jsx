import { useState } from "react";
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import HistoryModal from "./components/HistoryModal";
import NotificationsModal from "./components/NotificationsModal";
import menu from "./data/menu";
import useLocalStorage from "./hooks/useLocalStorage";
import { useToast } from "./context/ToastContext";

export default function App() {
  const [search, setSearch] = useState("");
  const [panel, setPanel] = useState(null); // "cart" | "history" | "notif" | null
  const [favorites, setFavorites] = useLocalStorage("kopiku-favorites", []); // urutan = waktu ditambahkan
  const [comments, setComments] = useLocalStorage("kopiku-comments", {}); // { idMenu: [ulasan terbaru di atas] }
  const { notify } = useToast();

  const toggleFavorite = (item) => {
    const isFav = favorites.includes(item.id);
    setFavorites(isFav ? favorites.filter((id) => id !== item.id) : [...favorites, item.id]);
    notify(isFav ? `${item.name} dihapus dari favorit` : `${item.name} masuk ke favorit`);
  };

  const addComment = (item, rating, text) => {
    const review = { id: Date.now(), rating, text, at: Date.now() };
    setComments({ ...comments, [item.id]: [review, ...(comments[item.id] || [])] });
    notify(`Komentar untuk ${item.name} terkirim`);
  };

  return (
    <div className="app">
      <Header search={search} onSearch={setSearch} onOpen={setPanel} />
      <MainContent
        menu={menu}
        search={search}
        favorites={favorites}
        comments={comments}
        onToggleFavorite={toggleFavorite}
        onAddComment={addComment}
      />
      <Footer />

      {panel === "cart" && <CartDrawer onClose={() => setPanel(null)} />}
      {panel === "history" && <HistoryModal onClose={() => setPanel(null)} />}
      {panel === "notif" && <NotificationsModal onClose={() => setPanel(null)} />}
    </div>
  );
}
