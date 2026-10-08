import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Shield, Activity, Cpu, Lock, CheckCircle, ChevronRight, Edit3 } from 'lucide-react';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-brand-600 p-1.5 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">VeriFlow</span>
          </div>
          <div>
            {user ? (
              <Link
                to="/dashboard"
                className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-medium bg-brand-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-brand-700 transition-all hover:shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 -mr-48 mt-12 w-96 h-96 bg-brand-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 left-0 -ml-48 mt-32 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight animate-slide-up">
            Every Keystroke <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600">
              Tells a Story
            </span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-10 animate-fade-in">
            The world's most advanced verified writing platform. Prove your authorship with cryptographic behavioral tracking, real-time integrity scoring, and built-in AI transparency.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-brand-700 hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Go to Dashboard
                <ChevronRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-brand-700 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  Get Started Free
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-700 border border-slate-200 text-lg font-semibold rounded-xl shadow-sm hover:bg-slate-50 transition-colors"
                >
                  Learn More
                </a>
              </>
            )}
          </div>
          
          {/* Editor Mockup */}
          <div className="mt-20 mx-auto max-w-5xl rounded-2xl shadow-2xl border border-slate-200/60 bg-white overflow-hidden ring-1 ring-slate-900/5 transform translate-y-4 animate-slide-up">
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <div className="ml-4 text-xs font-medium text-slate-500 uppercase tracking-wider">VeriFlow Editor</div>
            </div>
            <div className="p-8 text-left bg-white font-sans text-slate-800 text-lg leading-relaxed flex">
              <div className="flex-1 border-r border-slate-100 pr-8">
                <h2 className="text-3xl font-bold mb-4">The Future of AI Collaboration</h2>
                <p className="mb-4 text-slate-600">As artificial intelligence becomes more integrated into our daily workflows, distinguishing between human thought and machine generation has become crucial.</p>
                <p className="mb-4 text-slate-600"><span className="bg-brand-100 text-brand-900 px-1 rounded">VeriFlow doesn't ban AI; it embraces it transparently.</span> By tracking how content is produced rather than just analyzing the final output, we create a verified chain of custody for your ideas.</p>
                <div className="flex items-center gap-2 text-sm text-slate-400 mt-8 font-mono">
                  <span className="animate-pulse inline-block w-1.5 h-5 bg-brand-500"></span> Writing...
                </div>
              </div>
              <div className="w-64 pl-8 hidden md:block">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="text-sm font-semibold text-slate-700 mb-1">Integrity Score</div>
                  <div className="flex items-end gap-2 mb-4">
                    <span className="text-4xl font-bold text-green-500">98</span>
                    <span className="text-slate-500 mb-1">%</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">Human</span>
                        <span className="font-medium">95%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-[95%]"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500">Pasted</span>
                        <span className="font-medium">2%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 w-[2%]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats Section */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold text-brand-600 uppercase tracking-widest mb-8">Built for Academic Integrity</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200">
            <div className="py-4">
              <div className="text-4xl font-extrabold text-slate-900 mb-2">100K+</div>
              <div className="text-slate-500">Documents Verified</div>
            </div>
            <div className="py-4">
              <div className="text-4xl font-extrabold text-slate-900 mb-2">99.7%</div>
              <div className="text-slate-500">Accuracy Rate</div>
            </div>
            <div className="py-4">
              <div className="text-4xl font-extrabold text-slate-900 mb-2">500+</div>
              <div className="text-slate-500">Institutions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Unprecedented Verification</h2>
            <p className="text-lg text-slate-600">We analyze the journey, not just the destination. Our advanced heuristics verify authorship beyond reasonable doubt.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6 text-brand-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Behavioral Tracking</h3>
              <p className="text-slate-600 leading-relaxed">
                Every input, paste, backspace, and pause is silently logged with millisecond precision to build a cryptographic profile of your unique writing behavior.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Integrity Scoring</h3>
              <p className="text-slate-600 leading-relaxed">
                Our advanced heuristic engine computes an authorship confidence score in real-time, catching copy-pasting and undeclared AI usage before submission.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">AI Transparency</h3>
              <p className="text-slate-600 leading-relaxed">
                Built-in AI sandbox with automatic citation. Use AI openly for brainstorming and structuring, not secretly for writing. VeriFlow handles the attribution.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Lock className="w-6 h-6 text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Cryptographic Audit</h3>
              <p className="text-slate-600 leading-relaxed">
                Produce tamper-proof submission records with complete behavioral timelines. Your process is securely sealed and can be reviewed by evaluators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How VeriFlow Works</h2>
            <p className="text-lg text-slate-600">Three simple steps to verified authorship.</p>
          </div>
          
          <div className="relative">
            <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-slate-100"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto bg-brand-50 border-4 border-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <Edit3 className="w-10 h-10 text-brand-600" />
                </div>
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white font-bold mb-4">1</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Create Document</h3>
                <p className="text-slate-600">Start a new project in your secure workspace. Your environment is instantly ready for verified writing.</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 mx-auto bg-brand-50 border-4 border-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <Activity className="w-10 h-10 text-brand-600" />
                </div>
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white font-bold mb-4">2</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Write Naturally</h3>
                <p className="text-slate-600">Focus on your ideas. VeriFlow silently monitors your process in the background without getting in your way.</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 mx-auto bg-brand-50 border-4 border-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <CheckCircle className="w-10 h-10 text-brand-600" />
                </div>
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white font-bold mb-4">3</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Submit with Proof</h3>
                <p className="text-slate-600">Submit your work and receive an instant integrity certificate detailing your unique creation process.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-brand-400" />
            <span className="text-xl font-bold tracking-tight text-white">VeriFlow</span>
          </div>
          <div className="text-sm">
            &copy; {new Date().getFullYear()} VeriFlow Platforms Inc. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
