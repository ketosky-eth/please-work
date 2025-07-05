import React, { useState } from 'react';
import { Lock, Shield, DollarSign, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { useRenouncedLPVault } from '../hooks/useRenouncedLPVault';

export default function RenouncePage() {
  const { isConnected, address, connect } = useWallet();
  const { createVault, depositLP, isLoading } = useRenouncedLPVault();
  
  const [lpTokenAddress, setLpTokenAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isCreatingVault, setIsCreatingVault] = useState(false);
  const [vaultCreated, setVaultCreated] = useState<{
    vaultAddress: string;
    lpToken: string;
    amount: string;
    timestamp: string;
  } | null>(null);

  const handleRenounce = async () => {
    if (!isConnected) {
      connect?.();
      return;
    }

    if (!lpTokenAddress || !amount) {
      alert('Please fill in all fields');
      return;
    }

    setIsCreatingVault(true);

    try {
      // Create vault and deposit LP tokens
      const vaultAddress = await createVault(lpTokenAddress);
      await depositLP(vaultAddress, amount);

      setVaultCreated({
        vaultAddress,
        lpToken: lpTokenAddress,
        amount,
        timestamp: new Date().toISOString()
      });

      // Reset form
      setLpTokenAddress('');
      setAmount('');
      
    } catch (error) {
      console.error('Renounce error:', error);
      alert('Failed to renounce LP tokens. Please try again.');
    } finally {
      setIsCreatingVault(false);
    }
  };

  if (vaultCreated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900/10 to-gray-900 pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Message */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              LP Tokens Renounced Successfully! 🎉
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Your LP tokens are now permanently locked and earning rewards
            </p>
          </div>

          {/* Vault Details */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Vault Details</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Vault Address
                  </label>
                  <div className="flex items-center space-x-2">
                    <code className="text-green-400 font-mono text-sm bg-gray-900/50 px-3 py-2 rounded">
                      {vaultCreated.vaultAddress}
                    </code>
                    <button
                      onClick={() => navigator.clipboard.writeText(vaultCreated.vaultAddress)}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    LP Token
                  </label>
                  <code className="text-white font-mono text-sm bg-gray-900/50 px-3 py-2 rounded block">
                    {vaultCreated.lpToken}
                  </code>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Amount Locked
                  </label>
                  <div className="text-2xl font-bold text-white">
                    {vaultCreated.amount} LP
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Renounced At
                  </label>
                  <div className="text-white">
                    {new Date(vaultCreated.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">What's Next?</h3>
            <div className="space-y-3 text-blue-300">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <div>
                  <strong>Monitor Rewards:</strong> Check your vault regularly for accrued rewards from LP fees
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <div>
                  <strong>Claim Rewards:</strong> Manually claim anytime or auto-claim when rewards exceed $250
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <div>
                  <strong>Earn Continuously:</strong> Your LP tokens continue earning fees while permanently locked
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/vault'}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition-all"
            >
              View My Vaults
            </button>
            <button 
              onClick={() => setVaultCreated(null)}
              className="border border-gray-600 text-white hover:bg-gray-800 px-8 py-3 rounded-lg font-semibold transition-all"
            >
              Renounce More LPs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900/10 to-gray-900 pt-8 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Renounce Your LPs. Keep Earning.
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Permanently lock your LP tokens while continuing to earn trading fees and rewards
          </p>
        </div>

        {/* Wallet Connection Warning */}
        {!isConnected && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-3 text-yellow-400 mb-2">
              <AlertTriangle className="w-6 h-6" />
              <span className="font-semibold">Wallet Connection Required</span>
            </div>
            <p className="text-yellow-300 mb-4">
              Connect your wallet to renounce LP tokens and create your vault.
            </p>
            <button
              onClick={connect}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Connect Wallet Now
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Renounce Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
                <Shield className="w-6 h-6 text-green-500" />
                <span>Renounce LP Tokens</span>
              </h2>

              <div className="space-y-6">
                {/* LP Token Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    LP Token Address *
                  </label>
                  <input
                    type="text"
                    value={lpTokenAddress}
                    onChange={(e) => setLpTokenAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono"
                  />
                  <p className="text-gray-400 text-sm mt-1">
                    Enter the contract address of your LP token
                  </p>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Amount to Renounce *
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0"
                    min="0"
                    step="0.000001"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <p className="text-gray-400 text-sm mt-1">
                    Amount of LP tokens to permanently lock
                  </p>
                </div>

                {/* Warning */}
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-red-400 mb-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-medium">Permanent Action</span>
                  </div>
                  <p className="text-red-300 text-sm">
                    Once renounced, your LP tokens cannot be withdrawn. You will continue to earn rewards, 
                    but the tokens are permanently locked in the vault. <em>(VYTO will not be able to reverse this action.)</em>
                  </p>
                </div>

                {/* Benefits */}
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-green-400 mb-2">
                    <DollarSign className="w-5 h-5" />
                    <span className="font-medium">Earning Benefits</span>
                  </div>
                  <ul className="text-green-300 text-sm space-y-1">
                    <li>• Continue earning LP trading fees</li>
                    <li>• Auto-claim when rewards exceed $250</li>
                    <li>• Manual claim available anytime</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Vault Preview */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Vault Preview</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">LP Token</span>
                  <span className="text-white text-sm font-mono">
                    {lpTokenAddress ? `${lpTokenAddress.slice(0, 6)}...${lpTokenAddress.slice(-4)}` : 'Not set'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Amount</span>
                  <span className="text-white text-sm font-medium">
                    {amount || '0'} LP
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Protocol Fee</span>
                  <span className="text-green-400 text-sm font-medium">0.3%</span>
                </div>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">How It Works</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <div className="text-sm text-gray-300">
                    <strong className="text-white">Lock LPs:</strong> Transfer your LP tokens to a permanent vault
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <div className="text-sm text-gray-300">
                    <strong className="text-white">Earn Rewards:</strong> Continue receiving trading fees and rewards
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <div className="text-sm text-gray-300">
                    <strong className="text-white">Claim Anytime:</strong> Withdraw your earned rewards whenever you want
                  </div>
                </div>
              </div>
            </div>

            {/* Renounce Button */}
            <button
              onClick={handleRenounce}
              disabled={!lpTokenAddress || !amount || isCreatingVault || !isConnected}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition-all transform hover:scale-105 disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isCreatingVault ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Renouncing...</span>
                </>
              ) : !isConnected ? (
                <>
                  <span>Connect Wallet to Renounce</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Renounce LP Tokens</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-700">
          <div className="flex flex-col lg:flex-row justify-between items-center py-4">
            {/* Left: Logo & Copyright */}
            <div className="flex items-center space-x-3 mb-4 lg:mb-0">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img 
                  src="/Main Logo.jpg" 
                  alt="VYTO Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-gray-400 text-sm">
                © VYTO Protocol - Powered by the Ronin Network
              </span>
            </div>

            {/* Middle: Legal Links */}
            <div className="flex items-center space-x-6 mb-4 lg:mb-0">
              <button className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </button>
              <button className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </button>
              <button className="text-gray-400 hover:text-white text-sm transition-colors">
                Contact
              </button>
            </div>
            
            {/* Right: Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Follow us:</span>
              <a
                href="https://twitter.com/vyto_xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://discord.gg/AQdEfUaV8x"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400 hover:text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}