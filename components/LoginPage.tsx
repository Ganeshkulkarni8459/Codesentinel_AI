import React, { useState } from 'react';
import { User } from '../types';
import { Shield, Fingerprint, Cpu } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setTimeout(() => {
      onLogin({
        name: email.split('@')[0],
        role: 'Lead Architect',
        isAuthenticated: true
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl overflow-hidden relative group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-600 via-emerald-500 to-green-600"></div>
        
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500 blur-2xl opacity-20 rounded-full group-hover:opacity-30 transition-opacity"></div>
              <Shield size={64} className="relative text-green-500" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white tracking-tight mb-2">CodeSentinel AI</h1>
            <p className="text-gray-400 text-sm font-mono">Autonomous Marathon Agent v3.0</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Operator ID (Google SSO)</label>
              <div className="relative">
                <Fingerprint className="absolute left-3 top-3 text-gray-500" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-[#0d1117] border border-[#30363d] text-white pl-10 pr-4 py-2.5 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all font-mono text-sm"
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#238636] hover:bg-[#2ea043] text-white py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <Cpu className="animate-spin" size={18} />
                  <span className="font-mono">INITIALIZING HANDSHAKE...</span>
                </>
              ) : (
                <>
                  <span>Authenticate & Begin Session</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#30363d] flex justify-between text-[10px] text-gray-500 font-mono">
            <span>SECURE CONNECTION</span>
            <span>ENCRYPTED: AES-256</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;