
import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign, 
  Plus, 
  Search,
  MoreVertical,
  Bell,
  Settings,
  X,
  Upload,
  // Added missing imports for Star and PhoneCall
  Star,
  PhoneCall,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  Trash2,
  ChevronRight,
  LogOut,
  Store,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { MOCK_PRODUCTS, CATEGORIES } from '../constants';
import { Product, Order } from '../types';

const REVENUE_DATA = [
  { name: 'শনি', sales: 4000 },
  { name: 'রবি', sales: 3000 },
  { name: 'সোম', sales: 5000 },
  { name: 'মঙ্গল', sales: 2780 },
  { name: 'বুধ', sales: 6890 },
  { name: 'বৃহস্পতি', sales: 2390 },
  { name: 'শুক্র', sales: 7490 },
];

type VendorTab = 'DASHBOARD' | 'PRODUCTS' | 'ORDERS' | 'SETTINGS';

const VendorView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<VendorTab>('DASHBOARD');
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Local form state for new product
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState(CATEGORIES[0].name);
  const [newProdStock, setNewProdStock] = useState('10');
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop');

  // Simulated Orders state
  const [orders, setOrders] = useState<Order[]>([
    { id: 'ORD-5501', customerId: 'c1', customerPhone: '01829128381', total: 154999, status: 'pending', date: '২০২৪-০৬-০১', items: [] },
    { id: 'ORD-5502', customerId: 'c2', customerPhone: '01711111111', total: 4500, status: 'accepted', date: '২০২৪-০৬-০২', items: [] },
    { id: 'ORD-5503', customerId: 'c3', customerPhone: '01912345678', total: 1200, status: 'shipped', date: '২০২৪-০৬-০৩', items: [] },
  ]);

  const stats = useMemo(() => ({
    totalSales: products.length * 45000, // Simulated
    activeOrders: orders.filter(o => o.status !== 'delivered').length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    outOfStock: products.filter(p => p.stock === 0).length
  }), [products, orders]);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: `p-${Date.now()}`,
      name: newProdName,
      price: Number(newProdPrice),
      image: newProdImage,
      category: newProdCategory,
      stock: Number(newProdStock),
      vendorId: 'v1',
      rating: 0,
      reviews: 0
    };
    setProducts([newProduct, ...products]);
    setIsAddModalOpen(false);
    // Reset form
    setNewProdName('');
    setNewProdPrice('');
  };

  const updateOrderStatus = (id: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const deleteProduct = (id: string) => {
    if (confirm('আপনি কি নিশ্চিত যে এই প্রোডাক্টটি মুছতে চান?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f1f5f9] font-['Outfit']">
      {/* Enhanced Sidebar */}
      <aside className="w-72 bg-[#0f172a] text-white p-6 hidden lg:flex flex-col border-r border-white/5 shadow-2xl">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-11 h-11 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 rotate-3">
             <Store className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight leading-none uppercase italic">Galiver</h1>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Seller Center</span>
          </div>
        </div>
        
        <nav className="space-y-1 flex-grow">
          {[
            { id: 'DASHBOARD', icon: LayoutDashboard, label: 'ড্যাশবোর্ড', sub: 'Overview' },
            { id: 'PRODUCTS', icon: Package, label: 'পণ্য ম্যানেজমেন্ট', sub: 'Manage Stock' },
            { id: 'ORDERS', icon: ShoppingCart, label: 'অর্ডার লিস্ট', sub: 'Customer Orders', badge: stats.pendingOrders },
            { id: 'SETTINGS', icon: Settings, label: 'স্টোর সেটিংস', sub: 'Profile' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as VendorTab)}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group ${activeTab === item.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <div className={`p-2 rounded-xl ${activeTab === item.id ? 'bg-white/20' : 'bg-slate-800'}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <div className="text-left flex-grow">
                <p className="font-bold text-sm leading-none">{item.label}</p>
                <p className="text-[10px] opacity-50 font-medium mt-1 uppercase tracking-tight">{item.sub}</p>
              </div>
              {item.badge && item.badge > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full ring-4 ring-[#0f172a]">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-5 rounded-[2rem] border border-white/5 shadow-inner">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                   <CheckCircle2 className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                   <p className="text-xs font-black uppercase tracking-tighter italic">Verified Seller</p>
                   <p className="text-[10px] text-slate-500">Apple Official Store</p>
                </div>
             </div>
             <button className="w-full py-3 bg-white/5 text-slate-400 text-xs font-black uppercase rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <LogOut className="w-4 h-4" /> Sign Out
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 lg:p-10 max-h-screen overflow-y-auto no-scrollbar">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
              {activeTab === 'DASHBOARD' && 'ড্যাশবোর্ড ওভারভিউ'}
              {activeTab === 'PRODUCTS' && 'পণ্য ম্যানেজমেন্ট'}
              {activeTab === 'ORDERS' && 'অর্ডার লিস্ট'}
              {activeTab === 'SETTINGS' && 'স্টোর সেটিংস'}
            </h2>
            <p className="text-slate-500 font-medium mt-2 text-sm uppercase tracking-widest italic">স্বাগতম, Apple Official Store!</p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="relative group hidden sm:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input type="text" placeholder="Search anything..." className="pl-11 pr-6 py-3.5 bg-white rounded-2xl border-2 border-transparent focus:border-blue-600 outline-none w-64 text-sm font-bold shadow-sm transition-all" />
             </div>
             <div className="relative p-3.5 bg-white rounded-2xl shadow-sm border border-transparent hover:border-blue-600 cursor-pointer transition-all">
                <Bell className="w-6 h-6 text-slate-600" />
                <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
             </div>
             <div className="w-12 h-12 rounded-2xl bg-white p-1 border shadow-sm">
                <img src="https://logo.clearbit.com/apple.com" className="w-full h-full object-contain rounded-xl" />
             </div>
          </div>
        </header>

        {activeTab === 'DASHBOARD' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-500">
            {/* Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'মোট সেলস', value: `৳${stats.totalSales.toLocaleString()}`, icon: DollarSign, trend: '+১২%', color: 'bg-emerald-500' },
                { label: 'সক্রিয় অর্ডার', value: stats.activeOrders, icon: ShoppingCart, trend: '+৫', color: 'bg-blue-500' },
                { label: 'পেন্ডিং অর্ডার', value: stats.pendingOrders, icon: Clock, trend: 'Critical', color: 'bg-rose-500' },
                { label: 'স্টক আউট', value: stats.outOfStock, icon: Package, trend: 'Restock', color: 'bg-orange-500' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-xl transition-all">
                  <div className={`absolute -right-4 -top-4 w-20 h-20 ${stat.color} opacity-[0.03] rounded-full group-hover:scale-150 transition-transform`}></div>
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className={`${stat.color} p-3 rounded-2xl shadow-lg shadow-${stat.color.split('-')[1]}-500/20`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full uppercase tracking-widest">{stat.trend}</span>
                  </div>
                  <h4 className="text-slate-400 text-xs font-black uppercase tracking-[0.15em] mb-1 italic">{stat.label}</h4>
                  <p className="text-3xl font-black text-slate-900 tracking-tighter italic leading-none">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between mb-8">
                     <div>
                        <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">সাপ্তাহিক রিপোর্ট</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Revenue Performance</p>
                     </div>
                     <div className="flex gap-2">
                        <button className="p-2 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"><Filter className="w-5 h-5 text-slate-400" /></button>
                     </div>
                  </div>
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={REVENUE_DATA}>
                        <defs>
                          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                        <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 800 }} />
                        <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
               </div>

               <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                     <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">সাম্প্রতিক অর্ডার</h3>
                     <ArrowUpRight className="w-5 h-5 text-slate-300" />
                  </div>
                  <div className="space-y-5">
                     {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center gap-4 group cursor-pointer hover:bg-slate-50 p-2 rounded-2xl transition-all">
                           <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0 border-2 border-white shadow-sm overflow-hidden">
                              <img src={`https://picsum.photos/seed/${order.id}/100/100`} className="w-full h-full object-cover" />
                           </div>
                           <div className="flex-grow min-w-0">
                              <h4 className="text-sm font-black text-slate-900 uppercase tracking-tighter italic leading-none">{order.id}</h4>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{order.date}</p>
                           </div>
                           <div className="text-right">
                              <p className="text-sm font-black text-blue-600 italic leading-none">৳{order.total.toLocaleString()}</p>
                              <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full mt-2 inline-block ${
                                 order.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'
                              }`}>{order.status}</span>
                           </div>
                        </div>
                     ))}
                  </div>
                  <button onClick={() => setActiveTab('ORDERS')} className="w-full mt-10 py-4 bg-slate-900 text-white rounded-[1.5rem] text-xs font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all">অর্ডার বুক দেখুন</button>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'PRODUCTS' && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-slate-50/30">
                <div>
                   <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">সব পণ্যসমূহ</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Inventory Management</p>
                </div>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-blue-600 text-white px-8 py-4 rounded-[1.5rem] font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
                >
                  <Plus className="w-5 h-5" /> পণ্য যোগ করুন
                </button>
              </div>
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50">
                      <th className="px-8 py-5">প্রোডাক্ট তথ্য</th>
                      <th className="px-8 py-5">ক্যাটাগরি</th>
                      <th className="px-8 py-5">স্টক</th>
                      <th className="px-8 py-5">মূল্য</th>
                      <th className="px-8 py-5 text-center">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map(p => (
                      <tr key={p.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-[1.2rem] bg-white border border-slate-100 p-1 shadow-sm shrink-0 overflow-hidden">
                               <img src={p.image} className="w-full h-full object-contain rounded-lg group-hover:scale-110 transition-transform" />
                            </div>
                            <div>
                              <p className="font-black text-slate-900 uppercase italic tracking-tighter leading-none">{p.name}</p>
                              <div className="flex gap-1 mt-2">
                                 {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} />)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                           <span className="text-[10px] font-black text-slate-500 uppercase bg-slate-100 px-3 py-1 rounded-full">{p.category}</span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                             <span className={`text-sm font-black italic ${p.stock < 10 ? 'text-rose-500' : 'text-slate-700'}`}>{p.stock} টি</span>
                             <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                                <div className={`h-full ${p.stock < 10 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, p.stock)}%` }}></div>
                             </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                           <p className="text-lg font-black text-blue-600 italic">৳{p.price.toLocaleString()}</p>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                             <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Settings className="w-5 h-5" /></button>
                             <button onClick={() => deleteProduct(p.id)} className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><Trash2 className="w-5 h-5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ORDERS' && (
           <div className="animate-in fade-in slide-in-from-right duration-500 space-y-6">
              <div className="flex flex-wrap gap-4 mb-2">
                 {['সব অর্ডার', 'পেন্ডিং', 'শিপড', 'ডেলিভারড'].map((f, i) => (
                    <button key={i} className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${i === 0 ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'}`}>
                       {f}
                    </button>
                 ))}
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                 {orders.map((order) => (
                    <div key={order.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-8 group hover:shadow-xl transition-all">
                       <div className="flex items-center gap-6">
                          <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 border-2 border-white shadow-lg ${
                             order.status === 'pending' ? 'bg-orange-500 text-white' : 
                             order.status === 'shipped' ? 'bg-blue-500 text-white' : 'bg-emerald-500 text-white'
                          }`}>
                             <ShoppingCart className="w-8 h-8" />
                          </div>
                          <div>
                             <div className="flex items-center gap-3">
                                <h4 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">{order.id}</h4>
                                <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full ${
                                   order.status === 'pending' ? 'bg-orange-100 text-orange-600' : 
                                   order.status === 'shipped' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                                }`}>{order.status}</span>
                             </div>
                             <div className="flex items-center gap-4 mt-3">
                                <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {order.date}</p>
                                <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5"><PhoneCall className="w-3.5 h-3.5" /> {order.customerPhone}</p>
                             </div>
                          </div>
                       </div>
                       
                       <div className="flex flex-col sm:flex-row items-center gap-6">
                          <div className="text-center sm:text-right">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">অর্ডার মূল্য</p>
                             <p className="text-2xl font-black text-slate-900 italic leading-none">৳{order.total.toLocaleString()}</p>
                          </div>
                          <div className="h-10 w-px bg-slate-100 hidden sm:block"></div>
                          <div className="flex gap-2">
                             {order.status === 'pending' && (
                               <button onClick={() => updateOrderStatus(order.id, 'accepted')} className="px-6 py-4 bg-emerald-500 text-white text-[10px] font-black uppercase rounded-2xl shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all">Accept Order</button>
                             )}
                             {order.status === 'accepted' && (
                               <button onClick={() => updateOrderStatus(order.id, 'shipped')} className="px-6 py-4 bg-blue-600 text-white text-[10px] font-black uppercase rounded-2xl shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all">Ship Items</button>
                             )}
                             <button className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all"><ChevronRight className="w-5 h-5" /></button>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}
      </main>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setIsAddModalOpen(false)}></div>
           <div className="bg-white w-full max-w-2xl rounded-[3rem] p-8 sm:p-12 relative z-10 animate-in zoom-in-95 duration-300 shadow-2xl border border-white/10">
              <div className="flex items-center justify-between mb-10">
                 <div>
                    <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">নতুন পণ্য যোগ করুন</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mt-2 italic">Add to Store Inventory</p>
                 </div>
                 <button onClick={() => setIsAddModalOpen(false)} className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-all"><X className="w-6 h-6" /></button>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-2 italic">Product Name</label>
                          <input required type="text" value={newProdName} onChange={(e) => setNewProdName(e.target.value)} className="w-full px-6 py-4.5 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl outline-none font-bold text-sm shadow-inner transition-all" placeholder="যেমন: iPhone 15 Pro" />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-2 italic">Price (৳)</label>
                             <input required type="number" value={newProdPrice} onChange={(e) => setNewProdPrice(e.target.value)} className="w-full px-6 py-4.5 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl outline-none font-bold text-sm shadow-inner transition-all" placeholder="৳" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-2 italic">Stock</label>
                             <input required type="number" value={newProdStock} onChange={(e) => setNewProdStock(e.target.value)} className="w-full px-6 py-4.5 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl outline-none font-bold text-sm shadow-inner transition-all" />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-2 italic">Category</label>
                          <select value={newProdCategory} onChange={(e) => setNewProdCategory(e.target.value)} className="w-full px-6 py-4.5 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl outline-none font-bold text-sm shadow-inner transition-all appearance-none cursor-pointer">
                             {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                          </select>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-2 italic">Product Image</p>
                       <div className="aspect-square bg-slate-50 rounded-[2.5rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-blue-600 transition-all overflow-hidden relative shadow-inner">
                          <img src={newProdImage} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform" />
                          <div className="relative z-10 flex flex-col items-center">
                             <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl mb-4"><Upload className="w-8 h-8 text-blue-600" /></div>
                             <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Click to Upload</p>
                             <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase">Max size: 5MB</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="pt-6 border-t border-slate-100 flex gap-4">
                    <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-grow py-5 bg-slate-100 text-slate-500 rounded-[1.8rem] font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
                    <button type="submit" className="flex-[2] py-5 bg-blue-600 text-white rounded-[1.8rem] font-black uppercase text-xs tracking-widest shadow-2xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all">Add to Store</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default VendorView;
