import React from 'react';
import { Wallet, BookOpen, Rocket, Users, Star, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const testimonials = [
    {
      name: 'Alex Chen',
      role: 'DeFi Creator',
      content: 'Launched my token in minutes. The platform is incredibly intuitive and powerful.',
      rating: 5
    },
    {
      name: 'Sarah Johnson',
      role: 'NFT Artist',
      content: 'Best minting experience I\'ve had. The multi-chain support is a game changer.',
      rating: 5
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Crypto Entrepreneur',
      content: 'From concept to launch in under an hour. DeFiForge made it possible.',
      rating: 5
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Connect Your Wallet',
      description: 'Connect your wallet and select your preferred blockchain network.'
    },
    {
      number: '02',
      title: 'Design Your Asset',
      description: 'Configure your token or NFT with our intuitive creation tools.'
    },
    {
      number: '03',
      title: 'Deploy & Launch',
      description: 'Deploy your contract and start trading or minting immediately.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Launch Your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 block">
                  Crypto Project
                </span>
                in Minutes
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                The most comprehensive platform for creating, minting, and launching tokens and NFTs 
                across multiple blockchain networks. No coding required.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center justify-center space-x-2">
                  <Wallet className="w-5 h-5" />
                  <span>Connect Wallet</span>
                </button>
                <button className="border border-gray-600 text-white hover:bg-gray-800 px-8 py-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Learn More</span>
                </button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>50K+ Users</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Rocket className="w-4 h-4" />
                  <span>10K+ Projects</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4" />
                  <span>4.9/5 Rating</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Quick Launch</h3>
                  <p className="text-gray-300">Start your project in 3 simple steps</p>
                </div>
                
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {step.number}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">{step.title}</h4>
                        <p className="text-gray-400 text-sm">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold transition-all">
                  Get Started Free
                </button>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose DeFiForge?</h2>
            <p className="text-xl text-gray-300">Built for creators, by creators</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 text-center hover:border-blue-500/50 transition-all">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Lightning Fast</h3>
              <p className="text-gray-300">Deploy your contracts in seconds, not hours. Our optimized infrastructure ensures rapid deployment.</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 text-center hover:border-blue-500/50 transition-all">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Community Driven</h3>
              <p className="text-gray-300">Join a thriving community of creators and developers building the future of DeFi together.</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 text-center hover:border-blue-500/50 transition-all">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Enterprise Grade</h3>
              <p className="text-gray-300">Battle-tested security and reliability trusted by thousands of projects and millions in volume.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">What Creators Say</h2>
            <p className="text-xl text-gray-300">Don't just take our word for it</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Build Your Empire?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join the revolution and start creating your digital assets today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center justify-center space-x-2">
              <Wallet className="w-5 h-5" />
              <span>Connect Wallet</span>
            </button>
            <button className="border border-gray-600 text-white hover:bg-gray-800 px-8 py-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>Documentation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}