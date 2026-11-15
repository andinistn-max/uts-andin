import { Coffee, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="brand-mini"><Coffee size={18} /> KopiKu</span>
        <span>Dibuat dengan <Heart size={13} className="inline-heart" /> oleh Andin | UTS React Fundamental 2026</span>
      </div>
    </footer>
  );
}
