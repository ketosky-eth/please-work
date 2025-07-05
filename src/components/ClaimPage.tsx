import React, { useState } from 'react';
import { DollarSign, Target, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { useRenouncedLPVault } from '../hooks/useRenouncedLPVault';

interface Vault {
  address: string;
  lpToken: string;
  totalLocked: string;
  accruedRewards: { [token: string]: string };
  canAutoClaim: { [token: string]: boolean };
}

export default function ClaimPage() {
  const { isConnected, address, connect } = useWallet();
  const { getUserVaults, manualClaim, autoClaim, isLoading } = useRenouncedLPVault();
  
  const [selectedVault, setSelectedVault] = useState<string>('');
  const [selectedRewardToken, setSelectedRewardToken] = useState<string>('');
  const [claimAmount, setClaimAmount] = useState<string>('');
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState<{
    vault: string;
    token: string;
    amount: string;
    netAmount: string;
    protocolFee: string;
  } | null>(null);

  // Mock data for demonstration
  const userVaults: Vault[] = [];

  const handleClaim = async (isAuto: boolean = false) => {
    if (!selectedVault || !selectedRewardToken || !claimAmount) {
      alert('Please fill in all fields');
      return;
    }

    setIsClaiming(true);

    try {
      if (isAuto) {
        await autoClaim(selectedVault, selectedRewardToken, claimAmount);
      } else {
        await manualClaim(selectedVault, selectedRewardToken, claimAmount);
      }

      // Calculate amounts (0.3% protocol fee)
      const grossAmount = parseFloat(claimAmount);
      const protocolFee = grossAmount * 0.003;
      const netAmount = grossAmount - protocolFee;

      setClaimSuccess({
        vault: selectedVault,
        token: selectedRewardToken,
        amount: claimAmount,
        netAmount: netAmount.toFixed(6),
        protocolFee: protocolFee.toFixed(6)
      });

      // Reset form
      setSelectedVault('');
      setSelectedRewardToken('');
      setClaimAmount('');
      
    } catch (error) {
      console.error('Claim error:', error);
      alert('Failed to claim rewards. Please try again.');
    } finally {
      setIsClaiming(false);
    }
  };

  const calculateEstimatedAmounts = () => {
    if (!claimAmount) return { gross: '0', fee: '0', net: '0' };
    
    const gross = parseFloat(claimAmount);
    const fee = gross * 0.003; // 0.3%
    const net = gross - fee;
    
    return {
      gross: gross.toFixed(6),
      fee: fee.toFixed(6),
      net: net.toFixed(6)
    };
  };

  const estimated = calculateEstimatedAmounts();

  if (claimSuccess) {
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
              Rewards Claimed Successfully! 💰
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Your rewards have been processed and sent to your wallet
            </p>
          </div>

          {/* Claim Details */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Claim Summary</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Vault Address
                  </label>
                  <code className="text-white font-mono text-sm bg-gray-900/50 px-3 py-2 rounded block">
                    {claimSuccess.vault}
                  </code>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Reward Token
                  </label>
                  <code className="text-white font-mono text-sm bg-gray-900/50 px-3 py-2 rounded block">
                    {claimSuccess.token}
                  </code>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Gross Amount
                  </label>
                  <div className="text-2xl font-bold text-white">
                    {claimSuccess.amount}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Protocol Fee (0.3%)
                    </label>
                    <div className="text-lg font-semibold text-red-400">
                      -{claimSuccess.protocolFee}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Net Received
                    </label>
                    <div className="text-lg font-semibold text-green-400">
                      {claimSuccess.netAmount}
                    </div>
                  </div>
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
              onClick={() => setClaimSuccess(null)}
              className="border border-gray-600 text-white hover:bg-gray-800 px-8 py-3 rounded-lg font-semibold transition-all"
            >
              Claim More Rewards
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
              <DollarSign className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Claim Rewards
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Claim your earned rewards from renounced LP vaults
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
              Connect your wallet to view and claim rewards from your vaults.
            </p>
            <button
              onClick={connect}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Connect Wallet Now
            </button>
          </div>
        )}

        {/* Empty State */}
        {isConnected && userVaults.length === 0 && (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">No Vaults Found</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              You don't have any renounced LP vaults yet. Create your first vault to start earning rewards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.href = '/renounce'}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition-all"
              >
                Renounce LP Tokens
              </button>
              <button 
                onClick={() => window.location.href = '/vault'}
                className="border border-gray-600 text-white hover:bg-gray-800 px-8 py-3 rounded-lg font-semibold transition-all"
              >
                View Vaults
              </button>
            </div>
          </div>
        )}

        {/* Claim Form */}
        {isConnected && userVaults.length > 0 && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Claim Rewards</h2>

                <div className="space-y-6">
                  {/* Vault Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Select Vault *
                    </label>
                    <select
                      value={selectedVault}
                      onChange={(e) => setSelectedVault(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Choose a vault...</option>
                      {userVaults.map((vault) => (
                        <option key={vault.address} value={vault.address}>
                          {vault.address} - {vault.totalLocked} LP
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Reward Token Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Reward Token *
                    </label>
                    <input
                      type="text"
                      value={selectedRewardToken}
                      onChange={(e) => setSelectedRewardToken(e.target.value)}
                      placeholder="0x... (reward token address)"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono"
                    />
                  </div>

                  {/* Claim Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Claim Amount *
                    </label>
                    <input
                      type="number"
                      value={claimAmount}
                      onChange={(e) => setClaimAmount(e.target.value)}
                      placeholder="0.0"
                      min="0"
                      step="0.000001"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  {/* Estimated Amounts */}
                  {claimAmount && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <h4 className="text-blue-400 font-medium mb-3">Estimated Amounts</h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-gray-400">Gross Amount</div>
                          <div className="text-white font-semibold">{estimated.gross}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Protocol Fee (0.3%)</div>
                          <div className="text-red-400 font-semibold">-{estimated.fee}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Net Received</div>
                          <div className="text-green-400 font-semibold">{estimated.net}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Claim Buttons */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleClaim(false)}
                      disabled={!selectedVault || !selectedRewardToken || !claimAmount || isClaiming}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-all"
                    >
                      {isClaiming ? 'Claiming...' : 'Manual Claim'}
                    </button>
                    
                    <button
                      onClick={() => handleClaim(true)}
                      disabled={!selectedVault || !selectedRewardToken || !claimAmount || isClaiming}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-all"
                    >
                      {isClaiming ? 'Claiming...' : 'Auto Claim ($250+)'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Claim Info */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Claim Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Protocol Fee:</span>
                    <span className="text-white">0.3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Your Share:</span>
                    <span className="text-green-400">99.7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Auto-Claim Threshold:</span>
                    <span className="text-white">$250</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Manual Claim:</span>
                    <span className="text-white">No minimum</span>
                  </div>
                </div>
              </div>

              {/* How Claiming Works */}
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">How Claiming Works</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">1</span>
                    </div>
                    <div className="text-sm text-gray-300">
                      <strong className="text-white">Manual Claim:</strong> Claim any amount anytime
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">2</span>
                    </div>
                    <div className="text-sm text-gray-300">
                      <strong className="text-white">Auto Claim:</strong> Only when amount ≥ $250
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">3</span>
                    </div>
                    <div className="text-sm text-gray-300">
                      <strong className="text-white">Fee Deduction:</strong> 0.3% goes to protocol, 99.7% to you
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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
                © VYTO Protocol 2025 - All Rights Reserved
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