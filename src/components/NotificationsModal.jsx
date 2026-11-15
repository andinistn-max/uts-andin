import { Bell, BellOff } from "lucide-react";
import Modal from "./Modal";
import { useNotifications } from "../context/NotificationContext";
import { formatDate } from "../utils/pricing";

export default function NotificationsModal({ onClose }) {
  const { list, unread, markAllRead, clear } = useNotifications();

  return (
    <Modal title="Notifikasi" onClose={onClose}>
      <div className="notif-actions">
        <button className="ghost-text" onClick={markAllRead} disabled={unread === 0}>Tandai semua dibaca</button>
        <button className="ghost-text" onClick={clear} disabled={list.length === 0}>Hapus semua</button>
      </div>
      {list.length === 0 ? (
        <div className="empty small"><BellOff size={40} /><p>Belum ada notifikasi.</p></div>
      ) : (
        <ul className="notif-list">
          {list.map((n) => (
            <li key={n.id} className={n.read ? "" : "unread"}>
              <Bell size={16} />
              <div><p>{n.message}</p><small>{formatDate(n.at)}</small></div>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
