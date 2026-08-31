"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, House, Minus, Plus, ShoppingBag, Sofa, Sparkles, Table2, Tv, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type Category = "couches" | "tv-stands" | "coffee-tables";
type Product = { id: string; name: string; category: Category; note: string; price: string; tone: string; match?: string | string[]; images?: string[]; shortNote?: string };

const categoryInfo = {
  couches: { label: "Couches", count: 3 },
  "tv-stands": { label: "TV Stands", count: 6 },
  "coffee-tables": { label: "Coffee Tables", count: 6 },
};

const products: Product[] = [
  { id: "c1", name: "The Sunday Lounger", category: "couches", note: "Soft, deep, and made for slow mornings.", price: "Couch option 01", tone: "clay", images: ["/images/couch-1-1.png", "/images/couch-1-2.png", "/images/couch-1-3.png"] },
  { id: "c2", name: "The Cozy Corner", category: "couches", note: "A roomy sectional for curling up together.", price: "Couch option 02", tone: "sage", images: ["/images/couch-2-1.png", "/images/couch-2-2.png", "/images/couch-2-3.png", "/images/couch-2-4.png"] },
  { id: "c3", name: "The Cloud Nine", category: "couches", note: "Clean lines with an extra-plush feel.", price: "Couch option 03", tone: "oat", images: ["/images/couch-3-1.png", "/images/couch-3-2.png"] },
  { id: "t1", name: "The Lowline", category: "tv-stands", note: "Calm, minimal, and beautifully grounded.", price: "TV stand option 01", tone: "walnut", match: ["m1", "m2", "m3"], images: ["/images/tv-1-1.png", "/images/tv-1-2.png", "/images/tv-1-3.png"] },
  { id: "t2", name: "The Fluted Oak", category: "tv-stands", note: "Warm texture with tucked-away storage.", price: "TV stand option 02", tone: "honey", match: ["m1", "m2", "m3"], shortNote: "Not a fan of the LEDs, but I guess we could keep them turned off.", images: ["/images/tv-2-1.png", "/images/tv-2-2.png", "/images/tv-2-3.png"] },
  { id: "t3", name: "The Soft Arch", category: "tv-stands", note: "A gentle silhouette for a cozy room.", price: "TV stand option 03", tone: "rose", match: "m6", images: ["/images/tv-3-1.png", "/images/tv-3-2.png", "/images/tv-3-3.png"] },
  { id: "t4", name: "The Studio", category: "tv-stands", note: "Simple proportions and plenty of function.", price: "TV stand option 04", tone: "ink", match: "m6", images: ["/images/tv-4-1.png", "/images/tv-4-2.png", "/images/tv-4-3.png"] },
  { id: "t5", name: "The Cane Cabinet", category: "tv-stands", note: "Airy woven doors and natural warmth.", price: "TV stand option 05", tone: "sand", shortNote: "Not my favorite, but still an option.", images: ["/images/tv-5-1.png", "/images/tv-5-2.png"] },
  { id: "t6", name: "The Floating Frame", category: "tv-stands", note: "Light on its feet, neat in every detail.", price: "TV stand option 06", tone: "sage", images: ["/images/tv-6-1.png", "/images/tv-6-2.png"] },
  { id: "m1", name: "The Pebble", category: "coffee-tables", note: "Rounded edges and an easy, organic shape.", price: "Coffee table option 01", tone: "honey", images: ["/images/table-1-1.png", "/images/table-1-2.png"] },
  { id: "m2", name: "The Nesting Pair", category: "coffee-tables", note: "Flexible, playful, and perfect together.", price: "Coffee table option 02", tone: "walnut", images: ["/images/table-2-1.png", "/images/table-2-2.png"] },
  { id: "m3", name: "The Woven Round", category: "coffee-tables", note: "Natural texture with a relaxed feel.", price: "Coffee table option 03", tone: "sand", images: ["/images/table-3-1.png", "/images/table-3-2.png", "/images/table-3-3.png"] },
  { id: "m4", name: "The Scallop", category: "coffee-tables", note: "A sweet curved detail with personality.", price: "Coffee table option 04", tone: "rose", images: ["/images/table-4-1.png", "/images/table-4-2.png"] },
  { id: "m5", name: "The Quiet Oval", category: "coffee-tables", note: "Softly modern and easy to move around.", price: "Coffee table option 05", tone: "sage", images: ["/images/table-5-1.png", "/images/table-5-2.png"] },
  { id: "m6", name: "The Gallery Table", category: "coffee-tables", note: "A crisp statement for books and blooms.", price: "Coffee table option 06", tone: "ink", images: ["/images/table-6-1.png", "/images/table-6-2.png"] },
];

const tones: Record<string, string[]> = {
  clay: ["#d99b7b", "#f2d9ca"], sage: ["#93a88e", "#dce6d8"], oat: ["#c9b99f", "#eee7dc"],
  walnut: ["#75503e", "#c8aa91"], honey: ["#bd8654", "#ead1ad"], rose: ["#c99a9a", "#f0dddd"],
  ink: ["#54545d", "#c8c8cf"], sand: ["#c6aa82", "#eee0c7"],
};

function Placeholder({ product, image, className = "" }: { product: Product; image: number; className?: string }) {
  if (product.images?.[image]) {
    return <img className={`product-photo ${className}`} src={product.images[image]} alt={`${product.name}, view ${image + 1}`} />;
  }
  const colors = tones[product.tone];
  return <div className={`placeholder ${className}`} style={{ "--shade-a": colors[0], "--shade-b": colors[1] } as React.CSSProperties}>
    <span className="placeholder-shape" />
    <span className="placeholder-label">Photo {image + 1}</span>
  </div>;
}

function CategoryIcon({ category }: { category: Category }) {
  if (category === "couches") return <Sofa aria-hidden="true" />;
  if (category === "tv-stands") return <Tv aria-hidden="true" />;
  return <Table2 aria-hidden="true" />;
}

export default function Home() {
  const [category, setCategory] = useState<Category | null>(null);
  const [itemIndex, setItemIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [zoomed, setZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("haadiya-picks");
    if (stored) setSelected(JSON.parse(stored));
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem("haadiya-picks", JSON.stringify(selected)); }, [selected, ready]);

  const items = category ? products.filter((p) => p.category === category) : [];
  const product = items[itemIndex];
  const imageCount = product?.images?.length ?? 4;
  const optionName = (item: Product) => `Option ${products.filter((p) => p.category === item.category).findIndex((p) => p.id === item.id) + 1}`;
  function openCategory(next: Category, targetId?: string) {
    const nextItems = products.filter((p) => p.category === next);
    setCategory(next);
    setItemIndex(targetId ? Math.max(0, nextItems.findIndex((p) => p.id === targetId)) : 0);
    setImageIndex(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function moveItem(direction: number) {
    setItemIndex((itemIndex + direction + items.length) % items.length);
    setImageIndex(0);
  }
  function toggle(id: string) {
    setSelected((current) => current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);
  }
  function openZoom(event: React.MouseEvent<HTMLButtonElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    setZoomOrigin({
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
    });
    setZoomed(true);
  }

  return <main>
    <header className="topbar">
      <button className="brand" onClick={() => setCategory(null)} aria-label="Go to the homepage">
        <span className="brand-heart"><House size={18}/></span><span><b>Our New Place</b><small>The Furniture Edit</small></span>
      </button>
      <nav aria-label="Furniture categories">
        {(Object.keys(categoryInfo) as Category[]).map((key) => <button key={key} className={category === key ? "active" : ""} onClick={() => openCategory(key)}>{categoryInfo[key].label}</button>)}
      </nav>
      <Sheet>
        <SheetTrigger asChild><Button className="cart-button" aria-label={`Open picks, ${selected.length} items`}><ShoppingBag size={19}/><span className="cart-text">Your Picks</span><b>{selected.length}</b></Button></SheetTrigger>
        <SheetContent className="cart-sheet">
          <SheetHeader><SheetTitle>Your Picks</SheetTitle></SheetHeader>
          <div className="cart-list">
            {selected.length === 0 && <div className="empty-cart"><ShoppingBag/><h3>Nothing here yet</h3><p>Tap “Select This One” when something feels right.</p></div>}
            {selected.map((id) => { const p = products.find((x) => x.id === id)!; return <div className="cart-item" key={id}>
              <Placeholder product={p} image={0}/><div><small>{categoryInfo[p.category].label}</small><strong>{optionName(p)}</strong><button onClick={() => toggle(id)}>Remove</button></div>
            </div>})}
          </div>
        </SheetContent>
      </Sheet>
    </header>

    {!category ? <section className="landing">
      <div className="love-note"><span>FOR OUR NEW HOME</span><h1>I shortlisted a few.<br/>The final choice is yours.</h1><p>If you find or like something else, let me know :)</p></div>
      <div className="category-grid">
        {(Object.keys(categoryInfo) as Category[]).map((key, index) => <button className={`category-card card-${index}`} key={key} onClick={() => openCategory(key)}>
          <span className="category-art"><CategoryIcon category={key} /></span>
          <span className="category-copy"><small>{categoryInfo[key].count} SHORTLISTED</small><strong>{categoryInfo[key].label}</strong></span>
          <ArrowRight className="category-arrow"/>
        </button>)}
      </div>
    </section> : product && <section className="product-page">
      <div className="crumb"><button onClick={() => setCategory(null)}>Our Edit</button><span>/</span><b>{categoryInfo[category].label}</b></div>
      <div className="product-counter"><span>{String(itemIndex + 1).padStart(2,"0")}</span> / {String(items.length).padStart(2,"0")}</div>
      <div className="product-layout">
        <div className="gallery">
          <button className="gallery-arrow left" onClick={() => setImageIndex((imageIndex + imageCount - 1) % imageCount)} aria-label="Previous photo"><ArrowLeft/></button>
          <button className="main-image" onClick={openZoom} aria-label="Zoom image"><Placeholder product={product} image={imageIndex}/><span className="zoom"><ZoomIn size={17}/> Click to zoom</span></button>
          <button className="gallery-arrow right" onClick={() => setImageIndex((imageIndex + 1) % imageCount)} aria-label="Next photo"><ArrowRight/></button>
          <div className="thumbnails">{Array.from({ length: imageCount }, (_, n) => <button key={n} className={n === imageIndex ? "current" : ""} onClick={() => setImageIndex(n)}><Placeholder product={product} image={n}/></button>)}</div>
        </div>
        <div className="product-info">
          <h1>{optionName(product)}</h1>
          {product.shortNote && <p className="short-note">{product.shortNote}</p>}
          {category === "couches" && <div className="detail-line couch-detail">These were the three distinct couches I could find.</div>}
          <Button className={`select-button ${selected.includes(product.id) ? "remove" : ""}`} onClick={() => toggle(product.id)}>
            {selected.includes(product.id) ? <><Minus/> Remove from our picks</> : <><Plus/> Select this one</>}
          </Button>
          {product.match && <div className="match-list">{(Array.isArray(product.match) ? product.match : [product.match]).map((matchId) => {
            const table = products.find((item) => item.id === matchId)!;
            return <button className="match-card" key={matchId} onClick={() => openCategory("coffee-tables", matchId)}>
              <span><Sparkles/></span><span><small>A PERFECT PAIR</small><b>See {optionName(table)}</b></span><ArrowRight/>
            </button>;
          })}</div>}
        </div>
      </div>
      <div className="item-nav"><button onClick={() => moveItem(-1)}><ArrowLeft/> Previous</button><span>{items.map((_,i) => <i key={i} className={i===itemIndex ? "active" : ""}/>)}</span><button onClick={() => moveItem(1)}>Next <ArrowRight/></button></div>
    </section>}
    <Dialog open={zoomed} onOpenChange={setZoomed}><DialogContent className="zoom-dialog"><DialogTitle className="sr-only">Zoomed photo of {product && optionName(product)}</DialogTitle>{product && <div className="zoom-stage" style={{ "--zoom-x": `${zoomOrigin.x}%`, "--zoom-y": `${zoomOrigin.y}%` } as React.CSSProperties}><Placeholder product={product} image={imageIndex} className="zoomed-photo" /></div>}</DialogContent></Dialog>
  </main>;
}
