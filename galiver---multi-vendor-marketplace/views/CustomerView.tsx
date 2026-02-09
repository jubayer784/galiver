
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, 
  ShoppingCart, 
  User, 
  ChevronRight, 
  Star, 
  X,
  ShoppingBag,
  CheckCircle2,
  Sparkles,
  Loader2,
  Home,
  Truck,
  PhoneCall,
  Info,
  ShieldCheck,
  Globe,
  Mic,
  ArrowLeft,
  Flame,
  Plus,
  Minus,
  MapPin,
  RotateCcw,
  CreditCard,
  Store,
  Heart,
  Share2,
  Smartphone,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Trash2,
  MessageSquare,
  AlertCircle,
  Camera,
  Tag,
  ShieldAlert,
  Clock,
  History,
  Grid,
  Gift,
  Mail,
  Shirt,
  Eye,
  Leaf,
  LayoutGrid,
  MapPinned,
  SearchCode,
  CircleDashed,
  FileText
} from 'lucide-react';
import { CATEGORIES, MOCK_PRODUCTS, MOCK_VENDORS } from '../constants';
import { Product, CartItem, Order } from '../types';
import { fetchCourierTracking, CourierTrackingData } from '../services/steadfast';

type ViewMode = 'HOME' | 'CATALOG' | 'PRODUCT' | 'CHECKOUT' | 'SUCCESS' | 'ALL_CATEGORIES' | 'ABOUT' | 'TRACKING';
type ShippingZone = 'DHAKA_CITY' | 'DHAKA_SUB_AREA' | 'OUTSIDE_DHAKA';

const HERO_SLIDES = [
  { id: 1, image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop', title: 'Eid Offer 1' },
  { id: 2, image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=400&fit=crop', title: 'Smart Gadgets' },
  { id: 3, image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&h=400&fit=crop', title: 'Home Appliances' }
];

const MOCK_ORDER_HISTORY: Order[] = [
  {
    id: 'ord-101',
    customerId: 'user-1',
    customerPhone: '01829128381',
    items: [{ productId: 'p1', quantity: 1, price: 154999 }],
    total: 155069,
    status: 'shipped',
    date: '2023-10-10',
    courierTrackingCode: 'ST-123456789'
  },
  {
    id: 'ord-102',
    customerId: 'user-1',
    customerPhone: '01711111111',
    items: [{ productId: 'p2', quantity: 1, price: 4500 }],
    total: 4570,
    status: 'pending',
    date: '2024-05-20'
  }
];

const INITIAL_REVIEWS = Array.from({ length: 48 }, (_, i) => ({
  id: i + 1,
  user: `Verified Customer ${i + 1}`,
  rating: Math.floor(Math.random() * 2) + 4,
  text: i % 4 === 0 ? "অসাধারণ সার্ভিস! গালিভার থেকে কেনাকাটা করে সবসময়ই ভালো লাগে।" : "অরিজিনাল প্রোডাক্ট দেওয়ার জন্য ধন্যবাদ। ডেলিভারিও খুব দ্রুত ছিল।",
  date: `${i + 1} days ago`,
  image: i % 6 === 0 ? `https://picsum.photos/seed/rev${i}/400/400` : null
}));

const GaliverLogo = ({ className = "h-8 sm:h-11" }: { className?: string }) => (
  <div className={`flex items-center gap-2 sm:gap-2.5 shrink-0 cursor-pointer ${className}`}>
    <div className="bg-[#f85606] p-1.5 rounded-xl shadow-lg">
       <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
    </div>
    <span className="text-xl sm:text-2xl font-black tracking-tighter text-[#f85606]" style={{ fontFamily: "'Outfit', sans-serif" }}>Galiver</span>
  </div>
);

const ProductCard: React.FC<{ product: Product; onSelect: (p: Product) => void; compact?: boolean }> = ({ product, onSelect, compact = false }) => {
  return (
    <article 
      onClick={() => onSelect(product)}
      className={`bg-white group cursor-pointer border border-gray-100 hover:border-[#f85606] transition-all rounded-xl flex flex-col h-full shadow-sm hover:shadow-md overflow-hidden ${compact ? 'w-32 sm:w-44 shrink-0' : ''}`}
    >
      <div className="relative aspect-square overflow-hidden bg-[#f8f8f8]">
        <img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt={product.name} />
        {product.discount && (
          <div className="absolute top-1.5 left-1.5 bg-[#10b981] text-white text-[10px] sm:text-[13px] font-black px-2 py-0.5 rounded uppercase shadow-sm">
            {product.discount} TK OFF
          </div>
        )}
      </div>
      <div className="p-2 sm:p-3 flex flex-col flex-grow">
        <h3 className="text-[10px] sm:text-[11px] text-gray-800 line-clamp-2 mb-1 font-bold group-hover:text-[#f85606] uppercase tracking-tighter leading-tight">{product.name}</h3>
        <div className="mt-auto flex flex-col">
          <span className="text-[12px] sm:text-[14px] font-black text-[#f85606]">৳{product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-[9px] text-gray-400 line-through font-bold">৳{product.originalPrice.toLocaleString()}</span>
          )}
        </div>
      </div>
    </article>
  );
};

const CustomerView: React.FC = () => {
  const [view, setView] = useState<ViewMode>('HOME');
  const [viewHistory, setViewHistory] = useState<ViewMode[]>(['HOME']);
  const [activeProd, setActiveProd] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [prodQty, setProdQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState('Black');
  const [selectedVariant, setSelectedVariant] = useState('128GB');
  const [selectedSize, setSelectedSize] = useState('M');
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(2);
  const [reviewPhone, setReviewPhone] = useState('');
  const [isReviewEligible, setIsReviewEligible] = useState<boolean | null>(null);
  const [isVerifyingReview, setIsVerifyingReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewImage, setReviewImage] = useState<string | null>(null);
  const [reviewsList, setReviewsList] = useState(INITIAL_REVIEWS);

  // Search related states
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Swipe logic states
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Tracking States
  const [trackPhone, setTrackPhone] = useState('');
  const [trackedOrders, setTrackedOrders] = useState<Order[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [activeCourierData, setActiveCourierData] = useState<Record<string, CourierTrackingData>>({});

  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [shippingZone, setShippingZone] = useState<ShippingZone>('DHAKA_CITY');
  const [checkoutAddress, setCheckoutAddress] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const allProductsPool = useMemo(() => Array(10).fill(MOCK_PRODUCTS).flat().map((p, i) => ({ ...p, id: `${p.id}-${i}` })), []);
  const relatedProducts = useMemo(() => allProductsPool.slice(0, 18), [allProductsPool]);

  // Keyword-only suggestions (Daraz style)
  const suggestions = useMemo(() => {
    if (searchQuery.trim().length === 0) return [];
    const query = searchQuery.toLowerCase();
    
    const keywords = new Set<string>();
    
    CATEGORIES.forEach(c => {
      if (c.name.toLowerCase().includes(query)) keywords.add(c.name);
    });

    MOCK_PRODUCTS.forEach(p => {
      if (p.name.toLowerCase().includes(query)) {
        keywords.add(p.name);
      }
    });
    
    return Array.from(keywords).slice(0, 8);
  }, [searchQuery]);

  // Catalog filtered products
  const catalogProducts = useMemo(() => {
    if (view !== 'CATALOG') return [];
    const query = searchQuery.toLowerCase();
    return allProductsPool.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.category.toLowerCase().includes(query)
    );
  }, [view, searchQuery, allProductsPool]);

  // View management with history
  const navigateTo = (newView: ViewMode) => {
    setViewHistory(prev => [...prev, newView]);
    setView(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (viewHistory.length > 1) {
      const newHistory = [...viewHistory];
      newHistory.pop();
      const prevView = newHistory[newHistory.length - 1];
      setViewHistory(newHistory);
      setView(prevView);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setView('HOME');
      setViewHistory(['HOME']);
    }
  };

  // Right-to-Left Swipe Logic (Back Gesture)
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX.current = e.changedTouches[0].clientX;
      if (touchStartX.current === null || touchEndX.current === null) return;
      
      const deltaX = touchStartX.current - touchEndX.current;
      if (deltaX > 80) {
        goBack();
      }
      touchStartX.current = null;
      touchEndX.current = null;
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [viewHistory]);

  useEffect(() => {
    if (view === 'HOME' || view === 'CATALOG') {
      const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length), 5000);
      return () => clearInterval(timer);
    }
  }, [view]);

  // Handle outside clicks to close search suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const shippingCost = useMemo(() => {
    if (shippingZone === 'DHAKA_CITY') return 70;
    if (shippingZone === 'DHAKA_SUB_AREA') return 100;
    return 130;
  }, [shippingZone]);

  const cartQty = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const finalTotal = cartTotal + shippingCost - discountAmount;

  const handleAddToCart = (p: Product, qty: number = 1, silent: boolean = false) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === p.id && i.selectedColor === selectedColor);
      if (exists) return prev.map(i => (i === exists) ? {...i, quantity: i.quantity + qty} : i);
      return [...prev, { ...p, quantity: qty, selectedColor, selectedSize, selectedVariant }];
    });
    if (!silent) setIsCartOpen(true);
  };

  const updateCartQty = (id: string, delta: number, color?: string) => {
    setCart(prev => prev.map(item => (item.id === id && item.selectedColor === color) ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item).filter(item => item.quantity > 0));
  };

  const openProduct = (prod: Product) => {
    setActiveProd(prod);
    setActiveImage(prod.image);
    setProdQty(1);
    setIsDescExpanded(false);
    setVisibleReviewsCount(2);
    setIsReviewEligible(null);
    setReviewPhone('');
    setReviewImage(null);
    setReviewText('');
    setIsWishlisted(false);
    setShowSuggestions(false);
    setSearchQuery('');
    navigateTo('PRODUCT');
  };

  const performSearch = (keyword: string) => {
    setSearchQuery(keyword);
    setShowSuggestions(false);
    navigateTo('CATALOG');
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'SAVE10') {
      const disc = Math.round(cartTotal * 0.1);
      setDiscountAmount(disc);
      alert(`কুপন প্রয়োগ হয়েছে! আপনি ৳${disc} ছাড় পেয়েছেন।`);
    } else {
      alert('ভুল কুপন কোড। "SAVE10" চেষ্টা করুন।');
    }
  };

  const verifyReviewEligibility = () => {
    const cleanPhone = reviewPhone.trim();
    if (!cleanPhone) return;
    setIsVerifyingReview(true);
    setTimeout(() => {
      const hasOrder = MOCK_ORDER_HISTORY.find(o => o.customerPhone === cleanPhone);
      setIsReviewEligible(!!hasOrder);
      setIsVerifyingReview(false);
    }, 1000);
  };

  const submitReview = () => {
    if (!reviewText.trim()) { alert('কিছু লিখুন!'); return; }
    const newReview = { id: Date.now(), user: "Verified User", rating: reviewRating, text: reviewText, date: "Just now", image: reviewImage };
    setReviewsList([newReview, ...reviewsList]);
    setIsReviewEligible(null);
    setReviewText('');
    setReviewImage(null);
    alert('রিভিউ জমা হয়েছে!');
  };

  const handleTrackOrders = async () => {
    if (!trackPhone.trim()) return;
    setIsTracking(true);
    setTrackedOrders([]);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const results = MOCK_ORDER_HISTORY.filter(o => o.customerPhone === trackPhone.trim());
    setTrackedOrders(results);
    
    for (const order of results) {
      if (order.status === 'shipped' && order.courierTrackingCode) {
        const data = await fetchCourierTracking(order.courierTrackingCode);
        if (data) {
          setActiveCourierData(prev => ({ ...prev, [order.id]: data }));
        }
      }
    }
    
    setIsTracking(false);
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'পেন্ডিং (Pending)';
      case 'accepted': return 'গৃহীত (Accepted)';
      case 'processing': return 'শিপিংয়ের জন্য অপেক্ষা করছে (Waiting to Shipped)';
      case 'shipped': return 'শিপড (Shipped)';
      case 'delivered': return 'ডেলিভারড (Delivered)';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] pb-24 sm:pb-0">
      <nav className="sticky top-0 z-[1000] bg-white shadow-md py-4 sm:py-6 border-b border-gray-100 transition-all">
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-4 sm:gap-12">
          <div onClick={() => { setView('HOME'); setViewHistory(['HOME']); setSearchQuery(''); }}><GaliverLogo className="h-9 sm:h-12" /></div>
          <div className="flex-grow relative" ref={searchRef}>
            <form onSubmit={(e) => { e.preventDefault(); performSearch(searchQuery); }} className="relative flex items-center w-full bg-gray-100 rounded-2xl overflow-hidden h-11 sm:h-14 border border-gray-200">
              <div className="pl-4 text-gray-400"><Search className="w-5 h-5 sm:w-6 sm:h-6" /></div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="পণ্য খুঁজুন..." 
                className="w-full bg-transparent px-3 text-[14px] sm:text-[18px] outline-none font-bold" 
              />
            </form>
            
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[1001] animate-in fade-in slide-in-from-top-2 duration-200">
                 <div className="p-3 border-b border-gray-50 bg-gray-50/30">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Suggested Keywords</p>
                 </div>
                 {suggestions.map((suggestion, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => performSearch(suggestion)}
                      className="flex items-center gap-4 p-4 hover:bg-orange-50 cursor-pointer transition-colors group border-b border-gray-50 last:border-0"
                    >
                       <Search className="w-4 h-4 text-gray-300 group-hover:text-[#f85606]" />
                       <p className="text-sm font-black text-gray-800 uppercase tracking-tighter group-hover:text-[#f85606] transition-colors">{suggestion}</p>
                       <ChevronRight className="w-4 h-4 text-gray-200 ml-auto" />
                    </div>
                 ))}
              </div>
            )}
          </div>
          <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-gray-800 hover:scale-110 transition-transform">
            <ShoppingCart className="w-7 h-7 sm:w-9 sm:h-9" />
            {cartQty > 0 && <span className="absolute top-1 right-1 w-5 h-5 bg-[#f85606] text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white">{cartQty}</span>}
          </button>
        </div>
      </nav>

      <main className="flex-grow">
        {(view === 'HOME' || view === 'CATALOG') && (
          <div className="max-w-6xl mx-auto px-4 pt-1 space-y-2">
             <section className="relative aspect-[21/9] sm:h-[300px] overflow-hidden rounded-2xl shadow-lg border border-gray-100">
                {HERO_SLIDES.map((slide, idx) => (
                  <img key={slide.id} src={slide.image} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`} alt="Hero" />
                ))}
             </section>

             {view === 'HOME' && (
               <>
                 <section className="relative bg-emerald-100/50 py-4 sm:py-5 -mx-4 px-4 rounded-[2.5rem] shadow-sm border border-emerald-200/50">
                    <div className="flex items-center justify-between mb-4">
                       <h3 className="text-[16px] sm:text-[19px] font-black text-gray-800 uppercase italic flex items-center gap-2">
                         <Grid className="w-5 h-5 text-emerald-500" /> Categories
                       </h3>
                       <button onClick={() => navigateTo('ALL_CATEGORIES')} className="bg-white border border-emerald-100 text-[#f85606] text-[10px] font-black px-4 py-1.5 rounded-full uppercase shadow-sm flex items-center gap-1 hover:bg-emerald-50 transition-colors">
                         Show More <ChevronRight className="w-3 h-3" />
                       </button>
                    </div>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                       {CATEGORIES.slice(0, 10).map(cat => (
                          <div key={cat.id} className="flex flex-col items-center gap-2 cursor-pointer group shrink-0 w-16 sm:w-20">
                             <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-gray-100 p-2.5 flex items-center justify-center shadow-sm group-hover:border-[#f85606] transition-all overflow-hidden group-hover:shadow-md">
                                <img src={cat.image} className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform" />
                             </div>
                             <span className="text-[10px] font-black text-center text-gray-600 uppercase tracking-tighter line-clamp-1">{cat.name}</span>
                          </div>
                       ))}
                    </div>
                 </section>

                 <section className="bg-orange-100/30 -mx-4 px-4 py-3 sm:py-5 rounded-[2.5rem] mt-1">
                    <div className="flex items-center justify-between mb-3">
                       <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-[#f85606] rounded-full flex items-center justify-center shadow-lg"><Flame className="w-5 h-5 text-white animate-pulse" /></div>
                          <h3 className="text-[16px] sm:text-[20px] font-black text-gray-900 uppercase italic">Flash Sale</h3>
                       </div>
                    </div>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
                      {allProductsPool.slice(0, 10).map((p) => <ProductCard key={p.id} product={p} compact={true} onSelect={openProduct} />)}
                    </div>
                 </section>

                 <section className="mt-1 pb-10">
                    <div className="flex items-center gap-2 mb-4">
                       <div className="w-1.5 h-6 bg-[#f85606] rounded-full"></div>
                       <h3 className="text-[16px] sm:text-[21px] font-black text-gray-800 uppercase tracking-tight">Just For You</h3>
                    </div>
                    <div className="product-grid">
                      {allProductsPool.map((p) => <ProductCard key={p.id} product={p} onSelect={openProduct} />)}
                    </div>
                 </section>
               </>
             )}

             {view === 'CATALOG' && (
               <div className="pt-2 pb-20 space-y-4 animate-in fade-in slide-in-from-bottom duration-500">
                  <div className="flex items-center justify-between">
                     <div>
                        <h2 className="text-xl font-black uppercase italic tracking-tighter text-gray-900 leading-none">Search Results</h2>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1.5 italic">Query: "{searchQuery}" • {catalogProducts.length} items</p>
                     </div>
                  </div>
                  
                  {catalogProducts.length > 0 ? (
                    <div className="product-grid">
                       {catalogProducts.map((p) => <ProductCard key={p.id} product={p} onSelect={openProduct} />)}
                    </div>
                  ) : (
                    <div className="h-[40vh] flex flex-col items-center justify-center text-center space-y-4">
                       <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center shadow-inner text-gray-300">
                          <SearchCode className="w-8 h-8" />
                       </div>
                       <p className="text-xs font-black text-gray-400 uppercase tracking-widest italic">No products found matching your search</p>
                       <button onClick={() => navigateTo('HOME')} className="bg-[#f85606] text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] shadow-xl active:scale-95 transition-all">Back to Home</button>
                    </div>
                  )}
               </div>
             )}
          </div>
        )}

        {view === 'PRODUCT' && activeProd && (
          <div className="pb-16 max-w-6xl mx-auto px-4 bg-white min-h-screen pt-2">
             <div className="mb-2">
                <span className="bg-orange-100 text-[#f85606] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">{activeProd.category}</span>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 lg:gap-8">
                <div className="lg:col-span-7">
                    <div className="aspect-square rounded-[2rem] overflow-hidden bg-white border border-gray-100 flex items-center justify-center mb-2 shadow-inner">
                        <img src={activeImage || activeProd.image} className="w-full h-full object-contain" alt="Product" />
                    </div>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar mb-2">
                       {[1,2,3,4,5,6].map(i => (
                          <button key={i} onClick={() => setActiveImage(`https://picsum.photos/seed/p${i}/500/500`)} className="w-12 h-12 rounded-xl border-2 border-gray-50 overflow-hidden shrink-0 hover:border-[#f85606] transition-colors">
                             <img src={`https://picsum.photos/seed/p${i}/500/500`} className="w-full h-full object-cover" />
                          </button>
                       ))}
                    </div>
                </div>

                <div className="lg:col-span-5 flex flex-col gap-2">
                    <div className="space-y-0.5">
                        <h1 className="text-xl sm:text-2xl font-black text-gray-900 uppercase italic tracking-tighter leading-tight">{activeProd.name}</h1>
                        <div className="flex items-center justify-between mt-1">
                           <div className="flex items-center gap-2">
                              <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <Star key={i} className={`w-3.5 h-3.5 ${i <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />)}</div>
                              <span className="text-[12px] font-black text-gray-900">4.8</span>
                              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                              <span className="text-[10px] font-black text-blue-500 underline underline-offset-2 tracking-tight">1,250 Reviews</span>
                           </div>
                           <div className="flex gap-3">
                              <button onClick={() => setIsWishlisted(!isWishlisted)} className={`p-2 rounded-full border transition-all hover:scale-110 active:scale-90 ${isWishlisted ? 'bg-rose-50 border-rose-200 text-rose-500 shadow-md' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                                <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                              </button>
                              <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Product link copied!'); }} className="p-2 rounded-full border bg-gray-50 border-gray-100 text-gray-400 hover:text-[#f85606] hover:bg-orange-50 transition-all hover:scale-110 active:scale-90">
                                <Share2 className="w-6 h-6" />
                              </button>
                           </div>
                        </div>
                    </div>
                    
                    <div className="bg-orange-50/50 p-4 rounded-[1.5rem] border border-orange-100/20 shadow-sm">
                        <div className="flex items-center gap-4">
                           <span className="text-4xl sm:text-4xl font-black text-[#f85606] tracking-tighter italic leading-none">৳{activeProd.price.toLocaleString()}</span>
                           <div className="flex flex-col">
                             {activeProd.originalPrice && (
                               <span className="text-sm text-gray-400 line-through font-bold">৳{activeProd.originalPrice.toLocaleString()}</span>
                             )}
                             <span className="text-[10px] font-black text-[#10b981] uppercase tracking-widest italic bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 inline-block">Save ৳{(activeProd.originalPrice! - activeProd.price).toLocaleString()} Off</span>
                           </div>
                        </div>
                    </div>

                    <div className="space-y-2 mt-1">
                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic leading-none">COLOR: <span className="text-gray-900">{selectedColor}</span></p>
                        <div className="grid grid-cols-5 gap-2">
                           {['Black', 'White', 'Blue', 'Red', 'Silver'].map(color => (
                              <div key={color} className="flex flex-col items-center gap-1.5">
                                 <button onClick={() => setSelectedColor(color)} className={`relative aspect-square w-full rounded-xl border-2 overflow-hidden shadow-sm transition-all hover:scale-105 ${selectedColor === color ? 'border-[#f85606] ring-2 ring-orange-100' : 'border-gray-50 opacity-80'}`}>
                                    <img src={activeProd.image} className="w-full h-full object-cover" />
                                 </button>
                                 <span className={`text-[8px] font-black uppercase text-center leading-tight ${selectedColor === color ? 'text-[#f85606]' : 'text-gray-400'}`}>{color}</span>
                              </div>
                           ))}
                        </div>
                    </div>

                    <div className="space-y-3 mt-1">
                        <div className="space-y-1.5">
                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic leading-none">SIZE:</p>
                            <div className="flex flex-wrap gap-1.5">
                               {['S', 'M', 'L', 'XL'].map(s => (
                                  <button key={s} onClick={() => setSelectedSize(s)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase border-2 transition-all ${selectedSize === s ? 'border-[#f85606] bg-orange-50 text-[#f85606]' : 'border-gray-100 text-gray-400 hover:bg-gray-50'}`}>{s}</button>
                               ))}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic leading-none">VARIANT:</p>
                            <div className="flex flex-wrap gap-1.5">
                               {['128GB', '256GB', '512GB'].map(v => (
                                  <button key={v} onClick={() => setSelectedVariant(v)} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase border-2 transition-all ${selectedVariant === v ? 'border-[#f85606] bg-orange-50 text-[#f85606]' : 'border-gray-100 text-gray-400 hover:bg-gray-50'}`}>{v}</button>
                               ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 py-3 border-y border-gray-50 mt-1">
                        <div className="flex items-center bg-gray-100 rounded-xl p-1 border border-gray-200">
                          <button onClick={() => setProdQty(Math.max(1, prodQty-1))} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm"><Minus className="w-3.5 h-3.5 text-gray-400" /></button>
                          <span className="w-10 text-center text-base font-black">{prodQty}</span>
                          <button onClick={() => setProdQty(prodQty+1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm"><Plus className="w-3.5 h-3.5 text-gray-400" /></button>
                        </div>
                        <div>
                           <span className="text-[9px] font-black text-gray-400 uppercase italic">STOCK:</span>
                           <span className="text-base font-black text-emerald-500 italic mt-0 block leading-none">{activeProd.stock} Available</span>
                        </div>
                    </div>

                    {/* Balanced Thick Action Buttons - Adjusted Size as Requested */}
                    <div className="space-y-4 mt-4">
                        <button onClick={() => { handleAddToCart(activeProd, prodQty, true); navigateTo('CHECKOUT'); }} className="w-full bg-[#10b981] text-white py-6 sm:py-7 rounded-[1.8rem] font-black uppercase text-[17px] sm:text-[19px] shadow-2xl flex items-center justify-center gap-4 animate-buy-now transition-all active:scale-95 leading-none">
                           <CheckCircle2 className="w-7 h-7" /> Buy Now
                        </button>
                        <button onClick={() => handleAddToCart(activeProd, prodQty)} className="w-full bg-[#f85606] text-white py-6 sm:py-7 rounded-[1.8rem] font-black uppercase text-[17px] sm:text-[19px] shadow-2xl flex items-center justify-center gap-4 transition-all hover:brightness-110 active:scale-95 leading-none">
                           <ShoppingCart className="w-7 h-7" /> Add to Cart
                        </button>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-[1.5rem] border border-gray-100 shadow-sm space-y-3 mt-4">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                             <Truck className="w-6 h-6 text-[#f85606]" />
                          </div>
                          <div>
                             <p className="text-[13px] font-black text-gray-900 leading-none">All Bangladesh Cash on Delivery</p>
                             <p className="text-[10px] text-emerald-500 font-bold uppercase mt-1 italic tracking-wide">Reliable Logistics Guaranteed</p>
                          </div>
                       </div>
                    </div>

                    <div className="bg-white p-4 rounded-[1.5rem] border border-gray-100 mt-1 shadow-sm">
                       <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gray-50 rounded-[1rem] p-2 border border-gray-100 flex items-center justify-center shadow-inner">
                             <Store className="w-7 h-7 text-indigo-500" />
                          </div>
                          <div className="flex-grow">
                             <h4 className="text-[14px] font-black text-gray-900 uppercase italic leading-none">Galiver Mall Official</h4>
                             <div className="flex items-center gap-2 mt-1.5">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-[10px] font-black text-gray-600 tracking-tight">4.9/5.0 Store Rating</span>
                             </div>
                          </div>
                          <button className="bg-black text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase hover:bg-[#f85606] transition-all shadow-md active:scale-95">Visit Store</button>
                       </div>
                    </div>

                    <div className="mt-4 space-y-3">
                       <h3 className="text-[15px] font-black text-gray-900 uppercase italic flex items-center gap-2 tracking-tighter">
                         <FileText className="w-4 h-4 text-[#f85606]" /> Product Description
                       </h3>
                       <div className="bg-emerald-50/50 p-5 rounded-[1.5rem] border border-emerald-100 shadow-sm relative overflow-hidden group">
                          <div className={`text-[13px] text-gray-700 leading-relaxed font-medium italic transition-all duration-500 ${!isDescExpanded ? 'line-clamp-4' : ''}`} style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                             {activeProd.description || 'এই প্রোডাক্টটির জন্য কোনো বিশেষ ডেসক্রিপশন পাওয়া যায়নি। এটি একটি মানসম্মত এবং টেকসই পণ্য যা আপনার দৈনন্দিন প্রয়োজন মেটাতে সাহায্য করবে।'}
                          </div>
                          <div className="mt-4 flex justify-center">
                             <button 
                               onClick={() => setIsDescExpanded(!isDescExpanded)} 
                               className="text-[9px] font-black text-[#f85606] uppercase tracking-[0.2em] flex items-center gap-2 bg-white px-5 py-1.5 rounded-full shadow-sm hover:scale-105 transition-all active:scale-95"
                             >
                               {isDescExpanded ? 'Show Less' : 'Show More'} 
                               {isDescExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                             </button>
                          </div>
                       </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 mt-6 space-y-6 pb-2">
                       <h3 className="text-[15px] font-black text-gray-900 uppercase italic flex items-center gap-2 tracking-tighter">
                         <MessageSquare className="w-4 h-4 text-[#f85606]" /> Customer Reviews
                       </h3>
                       <div className="bg-gray-50 rounded-[1.5rem] p-5 border border-gray-100 shadow-inner">
                          {isReviewEligible === null ? (
                             <div className="space-y-3 text-center">
                                <p className="text-[10px] font-black text-gray-600 uppercase italic">Check eligibility with your phone number</p>
                                <div className="flex gap-2">
                                   <input type="tel" value={reviewPhone} onChange={(e) => setReviewPhone(e.target.value)} placeholder="01XXXXXXXXX" className="flex-grow px-5 py-3.5 bg-white rounded-xl outline-none font-black text-sm border-2 border-transparent focus:border-[#f85606] transition-all" />
                                   <button onClick={verifyReviewEligibility} disabled={isVerifyingReview} className="bg-black text-white px-6 rounded-xl font-black text-[11px] uppercase shadow-md active:scale-95">
                                      {isVerifyingReview ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Check'}
                                   </button>
                                </div>
                             </div>
                          ) : (
                             <div className="space-y-3 animate-in zoom-in-95 duration-300">
                                <div className="flex gap-1.5 mb-2">{[1, 2, 3, 4, 5].map(i => <Star key={i} onClick={() => setReviewRating(i)} className={`w-7 h-7 cursor-pointer transition-all active:scale-125 ${i <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />)}</div>
                                <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="আপনার অভিজ্ঞতা লিখুন..." className="w-full p-4 bg-white rounded-xl outline-none font-medium text-xs border border-gray-200 h-24 resize-none shadow-sm focus:border-[#f85606] transition-all"></textarea>
                                <button onClick={submitReview} className="w-full bg-[#f85606] text-white py-4 rounded-xl font-black uppercase text-sm shadow-lg active:scale-95">Submit Review</button>
                             </div>
                          )}
                       </div>
                       
                       <div className="space-y-5 pb-20">
                          {reviewsList.slice(0, visibleReviewsCount).map((review) => (
                             <div key={review.id} className="border-b border-gray-50 pb-5 last:border-0 last:pb-0">
                                <div className="flex justify-between items-center mb-2">
                                   <p className="text-[13px] font-black text-gray-900 tracking-tight">{review.user}</p>
                                   <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} className={`w-2.5 h-2.5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-100'}`} />)}</div>
                                </div>
                                <p className="text-[12px] text-gray-600 font-medium italic leading-relaxed tracking-tight">"{review.text}"</p>
                                {review.image && <img src={review.image} className="w-24 h-24 rounded-xl mt-3 object-cover border-2 border-white shadow-md hover:scale-105 transition-transform" />}
                             </div>
                          ))}
                          {visibleReviewsCount < reviewsList.length && (
                            <button onClick={() => setVisibleReviewsCount(prev => prev + 10)} className="w-full py-3 text-[#f85606] text-[11px] font-black uppercase border-2 border-dashed border-orange-200 rounded-2xl flex items-center justify-center gap-2 hover:bg-orange-50 transition-all">Load More (10+) <ChevronDown className="w-4 h-4" /></button>
                          )}
                       </div>
                    </div>
                </div>
             </div>
          </div>
        )}

        {view === 'CHECKOUT' && (
          <div className="max-w-xl mx-auto px-4 py-8 pb-40">
            <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
               <div className="p-6 text-center relative bg-[#f85606] text-white">
                  <h2 className="text-2xl font-black uppercase italic tracking-tight">Order Details</h2>
                  <button onClick={() => setView('HOME')} className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"><X className="w-5 h-5" /></button>
               </div>
               <div className="p-6 space-y-6">
                  <div className="space-y-3">
                    <p className="text-[13px] font-black text-gray-500 uppercase tracking-widest italic mb-1">Selected Products</p>
                    {cart.map((item, idx) => (
                      <div key={`${item.id}-${idx}`} className="flex gap-4 items-center bg-gray-50/50 p-4 rounded-3xl border border-gray-100">
                         <img src={item.image} className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm shrink-0" />
                         <div className="flex-grow min-w-0">
                            <p className="font-black text-[14px] text-gray-900 truncate uppercase tracking-tighter leading-none mb-1.5">{item.name}</p>
                            <div className="flex flex-wrap gap-x-2 text-[10px] font-black text-gray-400 uppercase italic tracking-tighter">
                               {item.selectedColor && <span className="bg-gray-100 px-2 py-0.5 rounded">C: {item.selectedColor}</span>}
                               {item.selectedVariant && <span className="bg-gray-100 px-2 py-0.5 rounded">V: {item.selectedVariant}</span>}
                               {item.selectedSize && <span className="bg-gray-100 px-2 py-0.5 rounded">S: {item.selectedSize}</span>}
                            </div>
                         </div>
                         <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-gray-100">
                            <button onClick={() => updateCartQty(item.id, -1, item.selectedColor)} className="w-7 h-7 flex items-center justify-center text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"><Minus className="w-4 h-4" /></button>
                            <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateCartQty(item.id, 1, item.selectedColor)} className="w-7 h-7 flex items-center justify-center text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"><Plus className="w-4 h-4" /></button>
                         </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 gap-5">
                    {[
                      { label: "নাম*", value: checkoutName, setter: setCheckoutName, placeholder: "আপনার পূর্ণ নাম", icon: User },
                      { label: "ফোন*", value: checkoutPhone, setter: setCheckoutPhone, placeholder: "০১৭XXXXXXXX", icon: PhoneCall },
                      { label: "ইমেইল (ঐচ্ছিক)", value: checkoutEmail, setter: setCheckoutEmail, placeholder: "আপনি চাইলে দিতে পারেন", icon: Mail },
                      { label: "পূর্ণ ঠিকানা*", value: checkoutAddress, setter: setCheckoutAddress, placeholder: "বাসা, রোড, এলাকা", icon: MapPin },
                    ].map((field, i) => (
                      <div key={i} className="space-y-2">
                        <label className="text-[13px] font-black text-gray-700 uppercase ml-2 flex items-center gap-2" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}><field.icon className="w-4 h-4 text-[#f85606]" /> {field.label}</label>
                        <input type="text" value={field.value} onChange={(e) => field.setter(e.target.value)} placeholder={field.placeholder} className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-[1.5rem] focus:border-[#f85606] focus:bg-white outline-none font-bold text-base transition-all shadow-inner" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }} />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-[13px] font-black text-gray-700 uppercase ml-2 flex items-center gap-2"><Gift className="w-4 h-4 text-[#f85606]" /> Coupon Code</label>
                    <div className="flex gap-2">
                       <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="কুপন কোড (Try SAVE10)" className="flex-grow px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-[1.5rem] focus:border-[#f85606] outline-none font-bold text-base shadow-inner" />
                       <button onClick={applyCoupon} className="bg-black text-white px-6 rounded-[1.2rem] font-black text-xs uppercase shadow-xl hover:brightness-125 transition-all">Apply</button>
                    </div>
                  </div>

                  <div className="bg-orange-50/50 border-2 border-[#f85606]/10 rounded-[2.5rem] p-6 space-y-4 shadow-sm">
                     <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest italic mb-1">Select Area</p>
                     <label className="flex items-center justify-between cursor-pointer group p-2 hover:bg-white rounded-2xl transition-all">
                        <div className="flex items-center gap-4">
                           <input type="radio" checked={shippingZone === 'DHAKA_CITY'} onChange={() => setShippingZone('DHAKA_CITY')} className="w-6 h-6 accent-[#f85606]" />
                           <span className="text-[15px] font-black text-gray-800 uppercase italic" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>ঢাকার ভিতরে (৳70)</span>
                        </div>
                     </label>
                     <div className="h-px bg-orange-100/50 mx-2"></div>
                     <label className="flex items-center justify-between cursor-pointer group p-2 hover:bg-white rounded-2xl transition-all">
                        <div className="flex items-center gap-4">
                           <input type="radio" checked={shippingZone === 'DHAKA_SUB_AREA'} onChange={() => setShippingZone('DHAKA_SUB_AREA')} className="w-6 h-6 accent-[#f85606]" />
                           <div>
                              <span className="text-[15px] font-black text-gray-800 uppercase italic" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>ঢাকা সাব-এরিয়া (৳100)</span>
                              <p className="text-[9px] font-bold text-gray-400 uppercase italic leading-none mt-1">Savar, Ashulia, Gazipur, Keranigonj</p>
                           </div>
                        </div>
                     </label>
                     <div className="h-px bg-orange-100/50 mx-2"></div>
                     <label className="flex items-center justify-between cursor-pointer group p-2 hover:bg-white rounded-2xl transition-all">
                        <div className="flex items-center gap-4">
                           <input type="radio" checked={shippingZone === 'OUTSIDE_DHAKA'} onChange={() => setShippingZone('OUTSIDE_DHAKA')} className="w-6 h-6 accent-[#f85606]" />
                           <span className="text-[15px] font-black text-gray-800 uppercase italic" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>ঢাকার বাহিরে (৳130)</span>
                        </div>
                     </label>
                  </div>

                  <div className="bg-[#f85606]/5 p-8 rounded-[2.5rem] border border-[#f85606]/10 shadow-inner space-y-3">
                     <div className="flex justify-between text-[12px] font-black uppercase text-gray-500 tracking-widest italic"><span>Subtotal</span><span>৳{cartTotal.toLocaleString()}</span></div>
                     <div className="flex justify-between text-[12px] font-black uppercase text-gray-500 tracking-widest italic"><span>Shipping Fee</span><span>৳{shippingCost.toLocaleString()}</span></div>
                     {discountAmount > 0 && (
                       <div className="flex justify-between text-[12px] font-black uppercase text-[#10b981] tracking-widest italic"><span>Discount</span><span>- ৳{discountAmount.toLocaleString()}</span></div>
                     )}
                     <div className="h-px bg-orange-200/50 my-4"></div>
                     <div className="flex justify-between text-2xl font-black uppercase tracking-tighter italic text-[#f85606]"><span>Grand Total</span><span>৳{finalTotal.toLocaleString()}</span></div>
                  </div>
                  
                  <button onClick={() => { setIsPlacingOrder(true); setTimeout(() => { setView('SUCCESS'); setIsPlacingOrder(false); setCart([]); }, 1500); }} className="w-full bg-[#10b981] text-white py-5 rounded-[2.2rem] font-black uppercase text-lg shadow-2xl flex items-center justify-center gap-3 hover:brightness-110 active:scale-95 transition-all">
                     {isPlacingOrder ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Confirm Order Now <CheckCircle2 className="w-6 h-6" /></>}
                  </button>
               </div>
            </div>
          </div>
        )}

        {view === 'SUCCESS' && (
           <div className="min-h-[70vh] flex items-center justify-center px-4">
              <div className="bg-white p-12 rounded-[4rem] shadow-2xl max-w-sm w-full text-center space-y-8 border border-emerald-50">
                 <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto shadow-inner"><CheckCircle2 className="w-12 h-12 text-emerald-500" /></div>
                 <div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase italic tracking-tighter">Order Placed!</h2>
                    <p className="text-[#f85606] text-[12px] font-black tracking-widest uppercase italic leading-relaxed">অর্ডারটি সফলভাবে সম্পন্ন হয়েছে। আমরা শীঘ্রই যোগাযোগ করব।</p>
                 </div>
                 <button onClick={() => { setView('HOME'); setViewHistory(['HOME']); }} className="w-full bg-black text-white py-5 rounded-3xl font-black uppercase text-sm shadow-2xl active:scale-95 hover:scale-105 transition-all">Return to Shopping</button>
              </div>
           </div>
        )}

        {view === 'ABOUT' && (
          <div className="max-w-4xl mx-auto px-4 py-10 pb-40 min-h-screen">
             <div className="flex items-center gap-4 mb-8">
                <button onClick={goBack} className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-600 hover:text-[#f85606] transition-colors"><ArrowLeft className="w-6 h-6" /></button>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900">আমাদের সম্পর্কে | Galiver</h2>
             </div>
             <div className="text-center py-10 space-y-4">
                <p className="text-xl font-black text-gray-900 uppercase italic tracking-tighter">স্টাইলিশ থাকুন। স্মার্ট থাকুন। সচেতন থাকুন।</p>
                <button onClick={() => navigateTo('HOME')} className="bg-[#f85606] text-white px-10 py-5 rounded-3xl font-black uppercase text-xs shadow-2xl hover:scale-105 transition-all active:scale-95">Shop Now</button>
             </div>
          </div>
        )}

        {view === 'TRACKING' && (
          <div className="max-w-2xl mx-auto px-4 py-10 pb-40 min-h-screen">
             <div className="flex items-center gap-4 mb-10">
                <button onClick={goBack} className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-600 hover:text-[#f85606] transition-colors"><ArrowLeft className="w-6 h-6" /></button>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900">Order Tracking</h2>
             </div>
             <div className="bg-white p-8 rounded-[3rem] shadow-2xl space-y-8">
                <input 
                  type="tel" 
                  value={trackPhone} 
                  onChange={(e) => setTrackPhone(e.target.value)}
                  placeholder="01XXXXXXXXX" 
                  className="w-full p-6 bg-gray-50 rounded-[2rem] border-2 border-gray-100 focus:border-[#f85606] outline-none font-black text-xl" 
                />
                <button onClick={handleTrackOrders} className="w-full bg-[#f85606] text-white py-6 rounded-[2rem] font-black uppercase text-sm">অর্ডার খুঁজুন</button>
             </div>
          </div>
        )}
      </main>

      {isCartOpen && (
        <div className="fixed inset-0 z-[2001] bg-black/50 backdrop-blur-sm flex justify-end">
           <div onClick={() => setIsCartOpen(false)} className="absolute inset-0"></div>
           <div className="w-full max-w-[380px] bg-white h-full relative flex flex-col animate-in slide-in-from-right duration-500 shadow-2xl">
              <div className="p-6 border-b flex justify-between items-center bg-[#f85606] text-white">
                <h2 className="font-black text-xl uppercase italic tracking-tighter">Your Cart</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2.5 bg-white/10 rounded-full"><X className="w-6 h-6" /></button>
              </div>
              <div className="flex-grow overflow-y-auto p-5 space-y-4 no-scrollbar">
                {cart.length > 0 ? cart.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="flex gap-4 items-center bg-gray-50/50 p-3.5 rounded-2xl border border-gray-100">
                     <img src={item.image} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                     <div className="flex-grow min-w-0">
                        <p className="font-black text-[12px] text-gray-900 truncate uppercase">{item.name}</p>
                        <p className="text-[15px] font-black text-[#f85606] italic">৳{item.price.toLocaleString()}</p>
                     </div>
                     <div className="flex items-center gap-2">
                        <button onClick={() => updateCartQty(item.id, -1, item.selectedColor)} className="w-7 h-7 bg-white rounded-lg shadow-sm border"><Minus className="w-3 h-3" /></button>
                        <span className="text-sm font-black w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateCartQty(item.id, 1, item.selectedColor)} className="w-7 h-7 bg-white rounded-lg shadow-sm border"><Plus className="w-3 h-3" /></button>
                     </div>
                  </div>
                )) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-10 space-y-3 italic">
                    <ShoppingBag className="w-20 h-20" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em]">Empty Cart</p>
                  </div>
                )}
              </div>
              <div className="p-8 bg-white border-t-2 space-y-6">
                <div className="flex justify-between font-black text-2xl uppercase italic tracking-tighter text-gray-900"><span>TOTAL:</span><span>৳{cartTotal.toLocaleString()}</span></div>
                <button onClick={() => { navigateTo('CHECKOUT'); setIsCartOpen(false); }} className="w-full bg-[#f85606] text-white py-5 rounded-[2rem] font-black uppercase text-xs shadow-xl">Proceed to Checkout</button>
              </div>
           </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-[0_-5px_30px_rgba(0,0,0,0.08)] flex items-center justify-around h-16 z-[2000] sm:hidden border-t border-gray-100 px-4">
         <button onClick={() => { setView('HOME'); setViewHistory(['HOME']); }} className={`flex flex-col items-center gap-0.5 transition-colors ${view === 'HOME' ? 'text-[#f85606]' : 'text-gray-400'}`}><User className="w-5 h-5" /><span className="text-[8px] font-black uppercase tracking-tighter">Profile</span></button>
         <button onClick={() => navigateTo('TRACKING')} className={`flex flex-col items-center gap-0.5 transition-colors ${view === 'TRACKING' ? 'text-[#f85606]' : 'text-gray-400'}`}><Truck className="w-5 h-5" /><span className="text-[8px] font-black uppercase tracking-tighter">Tracking</span></button>
         <button onClick={() => { setView('HOME'); setViewHistory(['HOME']); }} className="w-14 h-14 bg-[#f85606] text-white rounded-full flex items-center justify-center shadow-2xl -mt-8 border-[5px] border-white active:scale-90 transition-all"><Home className="w-6 h-6" /></button>
         <button onClick={() => navigateTo('ABOUT')} className={`flex flex-col items-center gap-0.5 transition-colors ${view === 'ABOUT' ? 'text-[#f85606]' : 'text-gray-400'}`}><Info className="w-5 h-5" /><span className="text-[8px] font-black uppercase tracking-tighter">About</span></button>
         <button onClick={() => setIsContactOpen(true)} className={`flex flex-col items-center gap-0.5 transition-colors ${isContactOpen ? 'text-[#f85606]' : 'text-gray-400'}`}><PhoneCall className="w-5 h-5" /><span className="text-[8px] font-black uppercase tracking-tighter">Contact</span></button>
      </nav>
    </div>
  );
};

export default CustomerView;
