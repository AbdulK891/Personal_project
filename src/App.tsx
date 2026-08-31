import { useEffect, useState, type CSSProperties, type MouseEvent } from "react";
import { ArrowLeft, ArrowRight, House, Minus, Plus, ShoppingBag, Sofa, Sparkles, Table2, Tv, X, ZoomIn } from "lucide-react";

type Category = "couches" | "tv-stands" | "coffee-tables";
type Product = { id: string; category: Category; tone: string; images: string[]; match?: string | string[]; shortNote?: string };
const endpoint = "https://script.google.com/macros/s/AKfycbxsFDHmXiFCiWHEx9W6uDxEA2ROC5pUMkz45JgwVPhbwJWg6fIk1I32ZPHf0YalHUXtUQ/exec";
const info: Record<Category, { label: string; count: number }> = { couches: { label: "Couches", count: 3 }, "tv-stands": { label: "TV Stands", count: 9 }, "coffee-tables": { label: "Coffee Tables", count: 12 } };
const make = (id: string, category: Category, tone: string, file: string, count: number, extra: Partial<Product> = {}): Product => ({ id, category, tone, images: Array.from({ length: count }, (_, i) => `images/${file}-${i + 1}.png`), ...extra });
const products: Product[] = [
  make("c1", "couches", "clay", "couch-1", 3), make("c2", "couches", "sage", "couch-2", 4), make("c3", "couches", "oat", "couch-3", 2),
  make("t1", "tv-stands", "walnut", "tv-1", 3, { match: ["m1", "m2", "m3"] }), make("t2", "tv-stands", "honey", "tv-2", 3, { match: ["m1", "m2", "m3"], shortNote: "Not a fan of the LEDs, but I guess we could keep them turned off." }), make("t3", "tv-stands", "rose", "tv-3", 3, { match: "m6" }), make("t4", "tv-stands", "ink", "tv-4", 3, { match: "m6" }), make("t5", "tv-stands", "walnut", "tv-5", 2), make("t6", "tv-stands", "walnut", "tv-6", 4), make("t7", "tv-stands", "ink", "tv-7", 3), make("t8", "tv-stands", "ink", "tv-8", 3), make("t9", "tv-stands", "ink", "tv-9", 3),
  make("m1", "coffee-tables", "honey", "table-1", 2), make("m2", "coffee-tables", "walnut", "table-2", 2), make("m3", "coffee-tables", "sand", "table-3", 3), make("m4", "coffee-tables", "sand", "table-4", 3), make("m5", "coffee-tables", "sage", "table-5", 2), make("m6", "coffee-tables", "ink", "table-6", 2), make("m7", "coffee-tables", "walnut", "table-7", 2), make("m8", "coffee-tables", "honey", "table-8", 2), make("m9", "coffee-tables", "walnut", "table-9", 2), make("m10", "coffee-tables", "walnut", "table-10", 4), make("m11", "coffee-tables", "sand", "table-11", 2), make("m12", "coffee-tables", "oat", "table-12", 2),
];
const colors: Record<string, string> = { clay: "#f2d9ca", sage: "#dce6d8", oat: "#eee7dc", walnut: "#c8aa91", honey: "#ead1ad", rose: "#f0dddd", ink: "#c8c8cf", sand: "#eee0c7" };
const categories = Object.keys(info) as Category[];
function Image({ product, image, className = "" }: { product: Product; image: number; className?: string }) { return <img className={`product-photo ${className}`} style={{ background: colors[product.tone] }} src={product.images[image]} alt={`${info[product.category].label} option photo ${image + 1}`} />; }
function CategoryIcon({ category }: { category: Category }) { return category === "couches" ? <Sofa /> : category === "tv-stands" ? <Tv /> : <Table2 />; }

export default function App() {
  const [category, setCategory] = useState<Category | null>(null); const [item, setItem] = useState(0); const [photo, setPhoto] = useState(0); const [chosen, setChosen] = useState<string[]>([]); const [cart, setCart] = useState(false); const [zoom, setZoom] = useState(false); const [origin, setOrigin] = useState({ x: 50, y: 50 }); const [sending, setSending] = useState(false); const [message, setMessage] = useState(""); const [success, setSuccess] = useState(false); const [confetti, setConfetti] = useState(false);
  useEffect(() => { try { const saved = localStorage.getItem("haadiya-picks"); if (saved) setChosen(JSON.parse(saved)); } catch { localStorage.removeItem("haadiya-picks"); } }, []);
  useEffect(() => localStorage.setItem("haadiya-picks", JSON.stringify(chosen)), [chosen]);
  useEffect(() => {
    const visitKey = "furniture-visit-notified";

    try {
      if (sessionStorage.getItem(visitKey) === "yes") return;

      // Set this before the request so React Strict Mode and quick refreshes
      // cannot send duplicate visit events in the same browser session.
      sessionStorage.setItem(visitKey, "yes");

      fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          eventType: "page_visit",
          page: window.location.href,
          referrer: document.referrer || "Direct",
          userAgent: navigator.userAgent,
          language: navigator.language,
        }),
      }).catch(() => {
        // Allow a later refresh to retry if the browser could not send it.
        sessionStorage.removeItem(visitKey);
      });
    } catch {
      // Visit tracking must never prevent the furniture site from loading.
    }
  }, []);
  const items = category ? products.filter((product) => product.category === category) : []; const product = items[item];
  const option = (value: Product) => `Option ${products.filter((product) => product.category === value.category).findIndex((product) => product.id === value.id) + 1}`;
  const open = (next: Category, target?: string) => { const nextItems = products.filter((product) => product.category === next); setCategory(next); setItem(target ? Math.max(0, nextItems.findIndex((product) => product.id === target)) : 0); setPhoto(0); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const toggle = (id: string) => { setMessage(""); setChosen((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]); };
  const zoomAt = (event: MouseEvent<HTMLButtonElement>) => { const bounds = event.currentTarget.getBoundingClientRect(); setOrigin({ x: (event.clientX - bounds.left) / bounds.width * 100, y: (event.clientY - bounds.top) / bounds.height * 100 }); setZoom(true); };
  const submit = async () => { if (!chosen.length) return; setSending(true); try { const selections = chosen.map((id) => { const value = products.find((product) => product.id === id)!; return { category: info[value.category].label, option: option(value) }; }); await fetch(endpoint, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ selections }) }); setChosen([]); setCart(false); setCategory(null); setMessage("Your picks were sent."); setSuccess(true); setConfetti(true); window.scrollTo({ top: 0, behavior: "smooth" }); window.setTimeout(() => setConfetti(false), 1500); window.setTimeout(() => setSuccess(false), 10000); } catch { setMessage("Could not send your picks. Please try again."); } finally { setSending(false); } };
  return <main>
    <header className="topbar"><button className="brand" onClick={() => setCategory(null)} aria-label="Go to the home page"><span className="brand-home"><House size={18} /></span><span><b>Our New Place</b><small>The Furniture Edit</small></span></button><nav aria-label="Furniture categories">{categories.map((key) => <button key={key} className={category === key ? "active" : ""} onClick={() => open(key)}>{info[key].label}</button>)}</nav><button className="cart-button" onClick={() => setCart(true)}><ShoppingBag size={19} /><span className="cart-text">Your Picks</span><b>{chosen.length}</b></button></header>
    {!category ? <section className="landing"><div className="intro"><span>FOR OUR NEW HOME</span><h1>I shortlisted a few.<br />The final choice is yours.</h1><p>If you find or like something else, let me know :)</p></div><div className="category-grid">{categories.map((key, index) => <button key={key} className={`category-card card-${index}`} onClick={() => open(key)}><span className="category-art"><CategoryIcon category={key} /></span><span className="category-copy"><small>{info[key].count} SHORTLISTED</small><strong>{info[key].label}</strong></span><ArrowRight className="category-arrow" /></button>)}</div></section> : product && <section className="product-page"><div className="crumb"><button onClick={() => setCategory(null)}>Our Edit</button><span>/</span><b>{info[category].label}</b></div><div className="product-counter"><span>{String(item + 1).padStart(2, "0")}</span> / {String(items.length).padStart(2, "0")}</div><div className="product-layout"><div className="gallery"><button className="gallery-arrow left" onClick={() => setPhoto((photo + product.images.length - 1) % product.images.length)} aria-label="Previous photo"><ArrowLeft /></button><button className="main-image" onClick={zoomAt} aria-label="Zoom image"><Image product={product} image={photo} /><span className="zoom"><ZoomIn size={17} />Click to zoom</span></button><button className="gallery-arrow right" onClick={() => setPhoto((photo + 1) % product.images.length)} aria-label="Next photo"><ArrowRight /></button><div className="thumbnails">{product.images.map((_, index) => <button key={index} className={index === photo ? "current" : ""} onClick={() => setPhoto(index)}><Image product={product} image={index} /></button>)}</div></div><div className="product-info"><h1>{option(product)}</h1>{product.shortNote && <p className="short-note">{product.shortNote}</p>}{category === "couches" && <p className="couch-detail">These were the three distinct couches I could find.</p>}<button className={`select-button ${chosen.includes(product.id) ? "remove" : ""}`} onClick={() => toggle(product.id)}>{chosen.includes(product.id) ? <><Minus />Remove from Your Picks</> : <><Plus />Select This One</>}</button>{product.match && <div className="match-list">{(Array.isArray(product.match) ? product.match : [product.match]).map((match) => { const table = products.find((value) => value.id === match)!; return <button className="match-card" key={match} onClick={() => open("coffee-tables", match)}><span><Sparkles /></span><span><small>A PERFECT PAIR</small><b>See {option(table)}</b></span><ArrowRight /></button>; })}</div>}</div></div><div className="item-nav"><button onClick={() => { setItem((item + items.length - 1) % items.length); setPhoto(0); }}><ArrowLeft />Previous</button><span>{items.map((_, index) => <i key={index} className={index === item ? "active" : ""} />)}</span><button onClick={() => { setItem((item + 1) % items.length); setPhoto(0); }}>Next<ArrowRight /></button></div></section>}
    {cart && <div className="overlay" onMouseDown={() => setCart(false)}><aside className="cart-panel" role="dialog" aria-modal="true" aria-label="Your Picks" onMouseDown={(event) => event.stopPropagation()}><div className="panel-heading"><h2>Your Picks</h2><button onClick={() => setCart(false)} aria-label="Close"><X /></button></div><div className="cart-list">{chosen.length === 0 ? <div className="empty-cart"><ShoppingBag /><h3>Nothing here yet</h3><p>Tap “Select This One” when something feels right.</p></div> : chosen.map((id) => { const value = products.find((product) => product.id === id)!; return <div className="cart-item" key={id}><Image product={value} image={0} /><div><small>{info[value.category].label}</small><strong>{option(value)}</strong><button onClick={() => toggle(id)}>Remove</button></div></div>; })}</div>{chosen.length > 0 && <div className="submit-area"><button className="submit-picks" disabled={sending} onClick={submit}>{sending ? "Sending..." : "Submit Picks"}</button>{message && <p className={message.startsWith("Could not") ? "submit-error" : "submit-success"}>{message}</p>}</div>}</aside></div>}
    {zoom && product && <div className="overlay zoom-overlay" onMouseDown={() => setZoom(false)}><div className="zoom-dialog" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}><button className="zoom-close" onClick={() => setZoom(false)} aria-label="Close zoom"><X /></button><div className="zoom-stage" style={{ "--zoom-x": `${origin.x}%`, "--zoom-y": `${origin.y}%` } as CSSProperties}><Image product={product} image={photo} className="zoomed-photo" /></div></div></div>}
    {confetti && <div className="confetti" aria-hidden="true">{Array.from({ length: 36 }, (_, index) => <i key={index} style={{ "--x": `${(index * 37) % 100}%`, "--delay": `${(index % 8) * .045}s`, "--color": ["#bd6f65", "#d9b45a", "#738270", "#d99b7b"][index % 4] } as CSSProperties} />)}</div>}
    {success && <div className="success-overlay" role="status"><div className="success-pop"><button onClick={() => setSuccess(false)} aria-label="Close message"><X /></button><Sparkles /><h2>Great!</h2><p>I have noted down all your choices, and I will make all the purchases shortly :)</p></div></div>}
  </main>;
}
