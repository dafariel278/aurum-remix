'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, ShieldCheck, History, Settings, Bell, Wallet, Send, FileText, UserPlus, Filter, Download, Activity, Lock, LogOut, Menu, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [wallet, setWallet] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) { alert('Please install MetaMask'); return; }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWallet(accounts[0]);
    } catch (e: any) { console.error('Failed:', e.message); }
  };

  const disconnect = () => setWallet(null);

  const navItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'employees', icon: Users, label: 'Employees' },
    { id: 'zk', icon: ShieldCheck, label: 'ZK-Verification' },
    { id: 'logs', icon: History, label: 'Payroll Logs' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] font-sans">
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#1c1b1b] rounded border border-[#4d4635]">
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {sidebarOpen && <div className="lg:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed left-0 top-0 h-full w-72 bg-[#1c1b1b] border-r border-[#4d4635]/10 z-50 flex flex-col transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="px-8 py-8">
          <h2 className="text-2xl font-bold text-[#f2ca50] tracking-widest">AURUM</h2>
          <p className="text-[10px] text-[#d0c5af]/60 uppercase tracking-widest mt-1">ZK-Identity Payroll</p>
        </div>
        <nav className="flex-1 px-4">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-4 px-6 py-4 text-left transition-all ${activeTab === id ? 'text-[#f2ca50] bg-[#2a2a2a] border-r-2 border-[#f2ca50]' : 'text-[#d0c5af]/40 hover:bg-[#2a2a2a] hover:text-[#d0c5af]'}`}>
              <Icon size={20} /><span className="text-sm tracking-wide">{label}</span>
            </button>
          ))}
        </nav>
        <div className="px-6 pb-8 space-y-4">
          <button className="w-full py-4 bg-[#f2ca50] text-[#3c2f00] font-bold text-[10px] uppercase tracking-widest rounded hover:brightness-110 transition-all">
            Initiate Payout
          </button>
          <div className="pt-4 border-t border-[#4d4635]/10 space-y-2">
            <a href="#" className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-[#d0c5af]/60 hover:text-[#f2ca50]"><Activity size={14} /> Network Status</a>
            <a href="#" className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-[#d0c5af]/60 hover:text-[#f2ca50]"><ShieldCheck size={14} /> Support</a>
          </div>
        </div>
      </aside>

      <main className="lg:ml-72 min-h-screen">
        <header className="sticky top-0 z-30 flex justify-between items-center px-6 lg:px-12 h-20 bg-[#131313]/80 backdrop-blur-xl border-b border-[#4d4635]/10">
          <h1 className="text-xl italic text-[#f2ca50] tracking-tight hidden lg:block">Sovereign Ledger</h1>
          <div className="flex items-center gap-4">
            <button className="relative text-[#d0c5af]/60 hover:text-[#f2ca50]"><Bell size={20} /><span className="absolute -top-1 -right-1 w-2 h-2 bg-[#c3f400] rounded-full" /></button>
            {wallet ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-4 py-2 bg-[#1c1b1b] border border-[#f2ca50]/30 rounded">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="font-mono text-xs">{wallet.slice(0,6)}...{wallet.slice(-4)}</span>
                </div>
                <button onClick={disconnect} className="p-2 text-[#d0c5af]/60 hover:text-[#f2ca50]"><LogOut size={16} /></button>
              </div>
            ) : (
              <button onClick={connectWallet} className="px-6 py-2 bg-gradient-to-br from-[#f2ca50] to-[#d4af37] text-[#3c2f00] font-bold text-[10px] uppercase tracking-widest rounded transition-all hover:scale-[1.02]">
                Connect Wallet
              </button>
            )}
          </div>
        </header>

        <div className="p-6 lg:p-12 max-w-7xl mx-auto space-y-12">
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#f2ca50] mb-4">Sovereign Treasury</p>
              <h2 className="text-6xl lg:text-8xl font-bold tracking-tighter">
                4,821,092.<span className="text-[#f2ca50]/40 italic">24</span>
                <span className="text-xl text-[#d0c5af]/50 uppercase ml-2">HKY</span>
              </h2>
              <div className="flex gap-12 mt-8 pt-8 border-t border-[#4d4635]/10">
                <div><p className="text-[10px] uppercase tracking-widest text-[#d0c5af]/60">Total Distributed</p><p className="text-3xl font-bold mt-1">1.2M <span className="text-sm text-[#f2ca50]">↑ 12%</span></p></div>
                <div><p className="text-[10px] uppercase tracking-widest text-[#d0c5af]/60">Active Identities</p><p className="text-3xl font-bold mt-1">412 <span className="text-sm text-[#d0c5af]/60">Global</span></p></div>
              </div>
            </div>
            <div className="bg-[#1c1b1b] p-8 rounded border border-[#4d4635]/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#f2ca50]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <Lock size={24} className="text-[#f2ca50] mb-4" />
                <p className="text-[10px] uppercase tracking-widest text-[#d0c5af]/60 mb-2">Vault Integrity</p>
                <h3 className="text-2xl italic mb-4">99.99% Guaranteed</h3>
                <div className="h-1 bg-[#2a2a2a] rounded-full overflow-hidden">
                  <motion.div className="h-full bg-[#f2ca50] shadow-[0_0_10px_rgba(242,202,80,0.5)]" initial={{ width: 0 }} animate={{ width: '99%' }} transition={{ duration: 1.5 }} />
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-[#1c1b1b] p-8 rounded border border-[#4d4635]/10 space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3"><ShieldCheck size={24} className="text-[#f2ca50]" /><h3 className="text-2xl italic">ZK-Identity Module</h3></div>
                <span className="text-[10px] uppercase tracking-widest text-[#d0c5af]/60 bg-[#2a2a2a] px-3 py-1 rounded">Node: #HK-921</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-[#0e0e0e] rounded border-l-2 border-[#f2ca50]">
                  <div className="flex justify-between mb-4"><span className="text-[10px] uppercase tracking-widest text-[#f2ca50]">Verified Identities</span><Lock size={12} className="text-[#f2ca50]" /></div>
                  <p className="text-4xl font-bold">384</p>
                  <div className="flex gap-1 mt-4 h-1">{[40,40,100,40].map((w, i) => <div key={i} className="flex-1 bg-[#f2ca50]/40" />)}</div>
                </div>
                <div className="p-6 bg-[#2a2a2a] rounded">
                  <div className="flex justify-between mb-4"><span className="text-[10px] uppercase tracking-widest text-[#d0c5af]/60">Pending Proofs</span><History size={12} className="text-[#d0c5af]/60" /></div>
                  <p className="text-4xl font-bold text-[#d0c5af]/50">28</p>
                  <div className="flex items-center gap-2 mt-4"><div className="w-2 h-2 rounded-full bg-[#c3f400] animate-pulse" /><span className="text-[10px] uppercase tracking-widest text-[#d0c5af]/60">Awaiting Hash</span></div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 space-y-4">
              {[{ icon: Send, label: 'Initiate Payout', category: 'Treasury', primary: true }, { icon: FileText, label: 'Audit Ledger', category: 'Compliance' }, { icon: UserPlus, label: 'Add Employee', category: 'Onboarding' }].map(({ icon: Icon, label, category, primary }) => (
                <button key={label} className={`w-full group p-6 rounded flex justify-between items-center transition-all hover:translate-x-2 ${primary ? 'bg-[#2a2a2a] border-l-2 border-[#f2ca50]' : 'bg-[#2a2a2a]'}`}>
                  <div className="text-left"><span className={`text-[10px] uppercase tracking-widest block mb-1 ${primary ? 'text-[#f2ca50]' : 'text-[#d0c5af]/60'}`}>{category}</span><span className="text-lg italic">{label}</span></div>
                  <Icon size={20} className="text-[#d0c5af]/60 group-hover:text-[#f2ca50] transition-colors" />
                </button>
              ))}
            </div>
          </section>

          <section className="bg-[#1c1b1b] p-8 rounded border border-[#4d4635]/10">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl italic">Recent Ledger Activity</h3>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-[#2a2a2a] flex items-center gap-2 hover:bg-[#353534] transition-colors text-[10px] uppercase tracking-widest"><Filter size={14} /> Filters</button>
                <button className="px-4 py-2 bg-[#2a2a2a] flex items-center gap-2 hover:bg-[#353534] transition-colors text-[10px] uppercase tracking-widest"><Download size={14} /> Export</button>
              </div>
            </div>
            <table className="w-full">
              <thead><tr className="text-left border-b border-[#4d4635]/10 text-[10px] uppercase tracking-widest text-[#d0c5af]/60"><th className="pb-6">Employee</th><th className="pb-6">Transaction</th><th className="pb-6 text-right">Amount</th><th className="pb-6 text-center">Status</th></tr></thead>
              <tbody className="divide-y divide-[#4d4635]/5">
                {[{ name: 'Alexander Thorne', role: 'Engineering Lead', tx: '0x882...F2A0', amount: '12,400', status: 'Verified' }, { name: 'Elena Vance', role: 'ZK-Architect', tx: '0x412...9E1B', amount: '18,250', status: 'Encrypted' }, { name: 'Marcus Chen', role: 'Protocol Strategist', tx: '0x933...C104', amount: '9,120', status: 'Paid' }].map((row, i) => (
                  <tr key={i} className="hover:bg-[#2a2a2a]/30 transition-colors">
                    <td className="py-6"><div className="flex items-center gap-4"><div className="w-10 h-10 bg-[#2a2a2a] rounded flex items-center justify-center text-lg font-bold">{row.name[0]}</div><div><div className="font-bold italic">{row.name}</div><div className="text-[10px] uppercase tracking-widest text-[#d0c5af]/60">{row.role}</div></div></div></td>
                    <td className="py-6 font-mono text-xs text-[#d0c5af]/60">{row.tx}</td>
                    <td className="py-6 text-right"><div className="font-bold">{row.amount}</div><div className="text-[10px] uppercase tracking-widest text-[#d0c5af]/60">HKY</div></td>
                    <td className="py-6 text-center"><span className={`inline-flex px-3 py-1 rounded text-[10px] uppercase tracking-widest ${row.status === 'Verified' ? 'bg-[#f2ca50]/10 text-[#f2ca50] border border-[#f2ca50]/20' : row.status === 'Paid' ? 'bg-[#c3f400]/10 text-[#c3f400] border border-[#c3f400]/20' : 'bg-[#2a2a2a] text-[#d0c5af]/60 border border-[#4d4635]/30'}`}>{row.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </main>
    </div>
  );
}
