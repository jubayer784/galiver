
import React from 'react';
import { 
  ShieldCheck, 
  Users, 
  Store, 
  AlertCircle, 
  ChevronRight, 
  PieChart as PieChartIcon, 
  Settings,
  Menu,
  FileText
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { MOCK_VENDORS } from '../constants';

const categoryData = [
  { name: 'Electronics', value: 45 },
  { name: 'Fashion', value: 30 },
  { name: 'Home & Kitchen', value: 15 },
  { name: 'Beauty', value: 10 },
];

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981'];

const AdminView: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Admin Sidebar */}
      <aside className="w-20 lg:w-72 bg-white border-r border-slate-200 flex flex-col items-center lg:items-stretch py-8 transition-all">
        <div className="px-6 mb-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold hidden lg:block text-slate-900">BazaarAdmin</span>
        </div>

        <nav className="flex-grow px-4 space-y-2">
           {[
               { icon: PieChartIcon, label: 'Overview', active: true },
               { icon: Users, label: 'User Management' },
               { icon: Store, label: 'Vendor Requests', badge: '3' },
               { icon: AlertCircle, label: 'Reports & Appeals' },
               { icon: FileText, label: 'CMS / Pages' },
               { icon: Settings, label: 'Global Settings' },
           ].map((item, i) => (
               <div key={i} className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl cursor-pointer transition-all ${item.active ? 'bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}>
                   <item.icon className="w-6 h-6 shrink-0" />
                   <span className="font-semibold text-sm hidden lg:block flex-grow">{item.label}</span>
                   {item.badge && <span className="hidden lg:block bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{item.badge}</span>}
               </div>
           ))}
        </nav>

        <div className="p-4 mt-auto">
            <div className="bg-slate-900 rounded-3xl p-6 hidden lg:block relative overflow-hidden">
                <div className="relative z-10">
                    <h4 className="text-white font-bold mb-1">Support available</h4>
                    <p className="text-slate-400 text-xs mb-4">Dedicated manager ready to help.</p>
                    <button className="bg-indigo-600 text-white w-full py-2 rounded-xl text-xs font-bold">Contact Support</button>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-grow p-6 lg:p-10">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900">Global Overview</h2>
            <p className="text-slate-500 font-medium">Platform-wide statistics and management</p>
          </div>
          <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 text-sm font-semibold flex items-center gap-2">
                  <span>Last 24 Hours</span>
                  <ChevronRight className="w-4 h-4 rotate-90" />
              </div>
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100">Export Report</button>
          </div>
        </header>

        {/* Global Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
                { label: 'Total Revenue', value: '৳4.2M', trend: '+14%', trendColor: 'text-emerald-500' },
                { label: 'Active Sellers', value: '450', trend: '+12', trendColor: 'text-indigo-500' },
                { label: 'New Registrations', value: '1.2k', trend: '+45%', trendColor: 'text-emerald-500' },
                { label: 'Fraud Alerts', value: '2', trend: '-80%', trendColor: 'text-rose-500' },
            ].map((stat, i) => (
                <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">{stat.label}</p>
                    <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-black text-slate-900">{stat.value}</span>
                        <span className={`text-xs font-bold ${stat.trendColor}`}>{stat.trend}</span>
                    </div>
                </div>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sales Distribution */}
            <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] border border-slate-200">
                <h3 className="text-xl font-bold mb-8">Sales by Category</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={120}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" align="center" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Pending Approvals */}
            <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold">New Vendor Requests</h3>
                    <button className="text-indigo-600 text-sm font-bold hover:underline">View All</button>
                </div>
                <div className="space-y-4">
                    {MOCK_VENDORS.map(vendor => (
                        <div key={vendor.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-slate-50 rounded-3xl gap-4 group hover:bg-white hover:border hover:border-indigo-100 transition-all">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 bg-white rounded-2xl p-2 border border-slate-200 shadow-sm shrink-0">
                                    <img src={vendor.logo} className="w-full h-full object-contain" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg text-slate-900">{vendor.name}</h4>
                                    <p className="text-slate-500 text-sm">Requested 2 hours ago • Electronic Niche</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="px-5 py-2.5 bg-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-300 transition-colors">Review Docs</button>
                                <button className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Approve</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Global System Logs */}
        <section className="mt-10 bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-indigo-50/30">
                <h3 className="font-bold text-lg">System Audit Log</h3>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-white rounded-lg text-xs font-bold text-slate-500 border">All Events</span>
                </div>
            </div>
            <div className="p-4">
                <div className="space-y-2">
                    {[
                        { time: '12:45 PM', event: 'Commission rate updated for "Fashion" category by Admin #12', type: 'info' },
                        { time: '11:20 AM', event: 'New high-risk transaction detected (Order #9923) - Flagged for review', type: 'warning' },
                        { time: '10:05 AM', event: 'Server maintenance completed successfully', type: 'success' },
                        { time: '09:30 AM', event: 'Vendor "GadgetHub" suspended for persistent shipping delays', type: 'error' },
                    ].map((log, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors cursor-default">
                            <span className="text-xs font-bold text-slate-400 shrink-0 w-20">{log.time}</span>
                            <div className={`w-2 h-2 rounded-full shrink-0 ${
                                log.type === 'error' ? 'bg-red-500' : 
                                log.type === 'warning' ? 'bg-amber-500' :
                                log.type === 'success' ? 'bg-emerald-500' : 'bg-indigo-500'
                            }`}></div>
                            <p className="text-sm font-medium text-slate-700">{log.event}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
      </main>
    </div>
  );
};

export default AdminView;
