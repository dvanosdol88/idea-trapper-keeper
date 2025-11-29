import { useState } from 'react';
import { BrainCircuit, Lightbulb, Calendar, Table2 } from 'lucide-react';
import { IdeaVault } from './components/IdeaVault';
import { TimelineBoard } from './components/TimelineBoard';
import { VendorMatrix } from './components/VendorMatrix';
import { cn } from './lib/utils';

type Tab = 'ideas' | 'timeline' | 'vendors';

function App() {
    const [activeTab, setActiveTab] = useState<Tab>('ideas');

    return (
        <div className="min-h-screen bg-brand-dark text-slate-100 selection:bg-brand-primary/30">
            <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-primary/10 rounded-lg">
                            <BrainCircuit className="w-6 h-6 text-brand-primary" />
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            RIA Command Center
                        </h1>
                    </div>

                    {/* Tab Navigation */}
                    <nav className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-lg border border-slate-800">
                        <button
                            onClick={() => setActiveTab('ideas')}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                                activeTab === 'ideas'
                                    ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                            )}
                        >
                            <Lightbulb className="w-4 h-4" />
                            Ideas
                        </button>
                        <button
                            onClick={() => setActiveTab('timeline')}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                                activeTab === 'timeline'
                                    ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                            )}
                        >
                            <Calendar className="w-4 h-4" />
                            Timeline
                        </button>
                        <button
                            onClick={() => setActiveTab('vendors')}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                                activeTab === 'vendors'
                                    ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                            )}
                        >
                            <Table2 className="w-4 h-4" />
                            Vendor Matrix
                        </button>
                    </nav>

                    <div className="text-sm text-slate-500 font-medium">
                        Flat-Fee RIA Edition
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-12">
                {activeTab === 'ideas' && <IdeaVault />}
                {activeTab === 'timeline' && <TimelineBoard />}
                {activeTab === 'vendors' && <VendorMatrix />}
            </main>
        </div>
    );
}

export default App;
