/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  History, 
  Settings, 
  Fingerprint, 
  Bell, 
  Wallet, 
  Send, 
  FileText, 
  UserPlus, 
  ChevronRight, 
  Filter, 
  Download,
  ShieldAlert,
  Activity,
  Lock,
  LogOut
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { createPublicClient, custom, parseAbi } from 'viem';
import { http } from 'viem';
import { hashkey } from 'viem/chains';

// Contract addresses
const PAYROLL_ADDR = '0x7cEB857fcBE1C3Ff14356d5aB6F4f593D657B29f';
const USDC_ADDR = '0xEd00a5915fD351d504bcF79F1f14DB1a6513Ba71';

// Minimal ABI
const PAYROLL_ABI = parseAbi([
  'function totalEmployees() view returns (uint256)',
  'function totalDistributed() view returns (uint256)',
  'function getEmployee(uint256) view returns (address identity, uint256 salary, bool isActive)',
  'function payrollHistory(uint256) view returns (address, uint256, uint256, bool)',
]);

const USDC_ABI = parseAbi([
  'function balanceOf(address) view returns (uint256)',
  'function symbol() view returns (string)',
]);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const curtainVariants = {
  hidden: { clipPath: 'inset(100% 0 0 0)' },
  visible: { 
    clipPath: 'inset(0% 0 0 0)',
    transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1] }
  }
};

export default function App() {
  const [wallet, setWallet] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [stats, setStats] = useState({ employees: 412, distributed: 1200000, vault: '99.99' });
  const [loading, setLoading] = useState(false);

  const publicClient = createPublicClient({
    chain: hashkey,
    transport: http(),
  });

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask or a Web3 wallet');
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const chain = await window.ethereum.request({ method: 'eth_chainId' });
      setWallet(accounts[0]);
      setChainId(parseInt(chain, 16));
      
      // Read contract data
      try {
        const [emp, dist] = await Promise.all([
          publicClient.readContract({ address: PAYROLL_ADDR, abi: PAYROLL_ABI, functionName: 'totalEmployees' }),
          publicClient.readContract({ address: PAYROLL_ADDR, abi: PAYROLL_ABI, functionName: 'totalDistributed' }),
        ]);
        setStats({
          employees: Number(emp),
          distributed: Number(dist) / 1e6,
          vault: '99.99',
        });
      } catch (e) {
        console.log('Using demo data - contract read skipped');
      }
    } catch (e: any) {
      console.error('Connection failed:', e.message);
    }
  };

  const disconnect = () => {
    setWallet(null);
    setChainId(null);
  };

  // Listen for account/chain changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) disconnect();
        else setWallet(accounts[0]);
      });
      window.ethereum.on('chainChanged', (chain: string) => setChainId(parseInt(chain, 16)));
    }
  }, []);

  const shortAddr = (a: string) => a ? `${a.slice(0,6)}...${a.slice(-4)}` : '';

  return (
    <div className="min-h-screen bg-background text-on-surface font-body selection:bg-primary/30">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-72 flex flex-col py-8 bg-surface-container-low z-40 hidden lg:flex border-r border-outline-variant/10">
        <div className="px-8 mb-12">
          <h2 className="text-2xl font-headline font-bold text-primary tracking-widest">AURUM</h2>
          <p className="text-[10px] font-label text-on-surface-variant/60 uppercase tracking-[0.2em] mt-1">ZK-Identity Payroll</p>
        </div>
        
        <nav className="flex-1 flex flex-col gap-1">
          <SidebarLink icon={<LayoutDashboard size={20} />} label="Overview" />
          <SidebarLink icon={<Users size={20} />} label="Employees" active />
          <SidebarLink icon={<ShieldCheck size={20} />} label="ZK-Verification" />
          <SidebarLink icon={<History size={20} />} label="Payroll Logs" />
          <SidebarLink icon={<Settings size={20} />} label="Settings" />
        </nav>

        <div className="px-8 mt-auto flex flex-col gap-4">
          <button className="w-full py-4 bg-primary text-on-primary font-bold font-label text-[10px] uppercase tracking-widest rounded-sm hover:brightness-110 transition-all shadow-[0_0_20px_rgba(242,202,80,0.2)]">
            Initiate Payout
          </button>
          <div className="flex flex-col gap-2 pt-6 border-t border-outline-variant/10">
            <a href="#" className="flex items-center gap-3 text-[10px] font-label uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">
              <Activity size={14} /> Network Status
            </a>
            <a href="#" className="flex items-center gap-3 text-[10px] font-label uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">
              <ShieldAlert size={14} /> Support
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-72 min-h-screen bg-grid">
        {/* Header */}
        <header className="sticky top-0 w-full z-30 flex justify-between items-center px-8 lg:px-12 h-20 bg-background/60 backdrop-blur-xl border-b border-outline-variant/10">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-headline italic text-primary tracking-tighter hidden lg:block">Sovereign Ledger</h1>
            <nav className="hidden md:flex gap-8 font-label uppercase tracking-widest text-[10px]">
              <a href="#" className="text-on-surface-variant/60 hover:text-primary transition-colors">Treasury</a>
              <a href="#" className="text-primary border-b-2 border-primary pb-1">Ledger</a>
              <a href="#" className="text-on-surface-variant/60 hover:text-primary transition-colors">Compliance</a>
            </nav>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-surface-container-lowest border border-outline-variant/20 rounded-sm">
              <Fingerprint size={16} className="text-primary" />
              <span className="font-label text-[10px] tracking-widest text-on-surface-variant uppercase">ZK-Secure Node</span>
            </div>
            <div className="flex gap-4">
              <button className="text-on-surface-variant hover:text-primary transition-all relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-secondary-container rounded-full"></span>
              </button>
              <button className="text-on-surface-variant hover:text-primary transition-all">
                <Wallet size={20} />
              </button>
            </div>
            {wallet ? (
              <div className="hidden sm:flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest border border-primary/30 rounded-sm">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="font-mono text-xs text-on-surface">{shortAddr(wallet)}</span>
                </div>
                <button 
                  onClick={disconnect}
                  className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                  title="Disconnect"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button 
                onClick={connectWallet}
                className="hidden sm:block px-6 py-2 bg-gradient-to-br from-primary to-primary-container text-on-primary font-label font-bold text-[10px] uppercase tracking-widest rounded-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </header>

        <motion.div 
          className="px-8 lg:px-12 py-8 max-w-7xl mx-auto space-y-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Section */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
            <motion.div className="lg:col-span-2" variants={curtainVariants}>
              <span className="font-label text-[10px] uppercase tracking-[0.3em] text-primary mb-4 block">Sovereign Treasury</span>
              <h1 className="font-headline text-6xl lg:text-8xl font-bold tracking-tighter text-on-surface leading-none">
                4,821,092.<span className="text-primary/40 italic">24</span> <span className="text-xl lg:text-2xl font-label tracking-normal text-on-surface-variant/50 uppercase">HKY</span>
              </h1>
              <div className="mt-8 flex gap-12 border-t border-outline-variant/10 pt-8">
                <div className="flex flex-col gap-1">
                  <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Total Distributed</span>
                  <span className="font-headline text-3xl text-on-surface">1.2M <span className="text-sm font-label text-primary">↑ 12%</span></span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Active Identities</span>
                  <span className="font-headline text-3xl text-on-surface">412 <span className="text-sm font-label text-on-surface-variant">Global</span></span>
                </div>
              </div>
            </motion.div>
            
            <motion.div className="bg-surface-container-low p-8 rounded-sm relative overflow-hidden group border border-outline-variant/10" variants={itemVariants}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <Lock size={24} className="text-primary mb-4" />
                <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Vault Integrity</p>
                <h3 className="font-headline text-2xl text-on-surface mb-4 italic">99.99% Guaranteed</h3>
                <div className="h-1 bg-surface-container-highest w-full rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary shadow-[0_0_10px_rgba(242,202,80,0.5)]"
                    initial={{ width: 0 }}
                    animate={{ width: '99%' }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </div>
              </div>
            </motion.div>
          </section>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* ZK-Identity Module */}
            <motion.div className="lg:col-span-8 bg-surface-container-low p-8 rounded-sm space-y-8 relative overflow-hidden border border-outline-variant/10" variants={itemVariants}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={24} className="text-primary" />
                  <h2 className="font-headline text-2xl italic">ZK-Identity Module</h2>
                </div>
                <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant bg-surface-container-high px-3 py-1">Node: #HK-921</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="p-6 bg-surface-container-lowest rounded-sm border-l-2 border-primary">
                    <div className="flex justify-between items-start mb-4">
                      <span className="font-label text-[10px] uppercase tracking-widest text-primary">Verified Identities</span>
                      <Lock size={12} className="text-primary" />
                    </div>
                    <div className="text-4xl font-headline">384</div>
                    <div className="mt-4 flex gap-1 h-1">
                      <div className="flex-1 bg-primary/40"></div>
                      <div className="flex-1 bg-primary/40"></div>
                      <div className="flex-1 bg-primary"></div>
                      <div className="flex-1 bg-primary/40"></div>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-surface-container-high rounded-sm">
                    <div className="flex justify-between items-start mb-4">
                      <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Pending Proofs</span>
                      <History size={12} className="text-on-surface-variant" />
                    </div>
                    <div className="text-4xl font-headline text-on-surface/50">28</div>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></div>
                      <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Awaiting Hash Generation</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center items-center relative py-12">
                  <div className="w-48 h-48 rounded-full border border-primary/20 flex items-center justify-center relative">
                    <motion.div 
                      className="w-32 h-32 rounded-full border-2 border-primary/40 border-dashed"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ShieldCheck size={48} className="text-primary" />
                    </div>
                    <div className="absolute -right-4 top-1/4 p-2 bg-surface-container-highest backdrop-blur shadow-xl border border-outline-variant/30 text-[8px] font-mono leading-tight max-w-[100px]">
                      0x4A...2B91<br/>
                      ZK_PROOF_GEN<br/>
                      VALID: TRUE
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <div className="lg:col-span-4 space-y-4">
              <QuickActionButton icon={<Send size={20} />} label="Initiate Payout" category="Treasury" primary />
              <QuickActionButton icon={<FileText size={20} />} label="Audit Ledger" category="Compliance" />
              <QuickActionButton icon={<UserPlus size={20} />} label="Add Employee" category="Onboarding" />
              
              <div className="bg-gradient-to-br from-surface-container-high to-surface-container-low p-6 rounded-sm border-t border-primary/20">
                <img 
                  src="https://picsum.photos/seed/blockchain/400/200?blur=2" 
                  alt="Network Visualization" 
                  className="w-full h-32 object-cover mb-4 grayscale hover:grayscale-0 transition-all duration-700 opacity-40 hover:opacity-100 rounded-sm"
                  referrerPolicy="no-referrer"
                />
                <p className="text-[10px] font-label text-on-surface-variant/60 leading-relaxed uppercase tracking-widest">
                  HashKey Chain integration active. Current Gas: 12 Gwei
                </p>
              </div>
            </div>
          </div>

          {/* Activity Ledger */}
          <motion.section className="bg-surface-container-low p-8 lg:p-10 rounded-sm border border-outline-variant/10" variants={itemVariants}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
              <h2 className="font-headline text-3xl italic">Recent Ledger Activity</h2>
              <div className="flex gap-4">
                <button className="px-4 py-2 bg-surface-container-high flex items-center gap-2 hover:bg-surface-container-highest transition-colors">
                  <Filter size={14} className="text-on-surface-variant" />
                  <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Filters</span>
                </button>
                <button className="px-4 py-2 bg-surface-container-high flex items-center gap-2 hover:bg-surface-container-highest transition-colors">
                  <Download size={14} className="text-on-surface-variant" />
                  <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Export</span>
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-outline-variant/10">
                    <th className="pb-6 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Employee Identity</th>
                    <th className="pb-6 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Transaction ID</th>
                    <th className="pb-6 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant text-right">Amount</th>
                    <th className="pb-6 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  <ActivityRow 
                    name="Alexander Thorne" 
                    role="Engineering Lead" 
                    txId="0x882...F2A0" 
                    amount="12,400.00" 
                    status="Verified" 
                    img="https://picsum.photos/seed/alex/100/100"
                  />
                  <ActivityRow 
                    name="Elena Vance" 
                    role="ZK-Architect" 
                    txId="0x412...9E1B" 
                    amount="18,250.00" 
                    status="Encrypted" 
                    img="https://picsum.photos/seed/elena/100/100"
                  />
                  <ActivityRow 
                    name="Marcus Chen" 
                    role="Protocol Strategist" 
                    txId="0x933...C104" 
                    amount="9,120.00" 
                    status="Paid" 
                    img="https://picsum.photos/seed/marcus/100/100"
                  />
                </tbody>
              </table>
            </div>
          </motion.section>
        </motion.div>

        {/* Footer */}
        <footer className="py-12 px-8 lg:px-12 border-t border-outline-variant/10">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-on-surface-variant/40">
            <div className="flex flex-wrap justify-center gap-8 font-label text-[8px] uppercase tracking-[0.3em]">
              <span>System Health: Nominal</span>
              <span>Latency: 42ms</span>
              <span>Block: #48,291,102</span>
            </div>
            <div className="font-label text-[8px] uppercase tracking-[0.3em]">
              © 2024 AURUM FINANCIAL SYSTEMS
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

function SidebarLink({ icon, label, active = false }: { icon: ReactNode, label: string, active?: boolean }) {
  return (
    <a 
      href="#" 
      className={`flex items-center gap-4 px-8 py-4 transition-all group ${
        active 
          ? 'text-primary bg-surface-container-high border-r-2 border-primary shadow-[inset_0_0_10px_rgba(242,202,80,0.1)]' 
          : 'text-on-surface-variant/40 hover:bg-surface-container-high hover:text-on-surface'
      }`}
    >
      <span className="transition-transform group-hover:scale-110">{icon}</span>
      <span className="font-medium font-label text-sm tracking-wide">{label}</span>
    </a>
  );
}

function QuickActionButton({ icon, label, category, primary = false }: { icon: ReactNode, label: string, category: string, primary?: boolean }) {
  return (
    <button className={`w-full group p-6 rounded-sm flex justify-between items-center transition-all hover:translate-x-2 ${
      primary ? 'bg-surface-container-high border-l-2 border-primary' : 'bg-surface-container-high'
    }`}>
      <div className="text-left">
        <span className={`font-label text-[10px] uppercase tracking-widest block mb-1 ${primary ? 'text-primary' : 'text-on-surface-variant'}`}>
          {category}
        </span>
        <span className="font-headline text-lg italic">{label}</span>
      </div>
      <span className="text-on-surface-variant group-hover:text-primary transition-colors">{icon}</span>
    </button>
  );
}

function ActivityRow({ name, role, txId, amount, status, img }: { name: string, role: string, txId: string, amount: string, status: string, img: string }) {
  return (
    <tr className="group hover:bg-surface-container-high/30 transition-colors">
      <td className="py-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-surface-container-highest rounded-sm flex items-center justify-center overflow-hidden border border-outline-variant/20">
            <img src={img} alt={name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" referrerPolicy="no-referrer" />
          </div>
          <div>
            <div className="font-headline text-lg group-hover:text-primary transition-colors italic">{name}</div>
            <div className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">{role}</div>
          </div>
        </div>
      </td>
      <td className="py-6 font-mono text-xs text-on-surface-variant/80">{txId}</td>
      <td className="py-6 text-right">
        <div className="font-headline text-lg">{amount}</div>
        <div className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">HKY</div>
      </td>
      <td className="py-6 text-center">
        <span className={`inline-flex items-center px-3 py-1 rounded-sm font-label text-[10px] uppercase tracking-widest border ${
          status === 'Verified' ? 'bg-primary/10 text-primary border-primary/20' :
          status === 'Paid' ? 'bg-secondary-container/10 text-secondary-container border-secondary-container/20' :
          'bg-surface-container-highest text-on-surface-variant border-outline-variant/30'
        }`}>
          {status}
        </span>
      </td>
    </tr>
  );
}
