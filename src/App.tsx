import { useState, useEffect } from 'react';
import { IdeaInput } from './components/IdeaInput';
import { QuadrantDashboard } from './components/QuadrantDashboard';
import { ChallengeModal } from './components/ChallengeModal';
import { useIdeaStore, Category } from './store/ideaStore';
import { BrainCircuit } from 'lucide-react';
import { addIdea as addIdeaToDb, subscribeToIdeas } from './lib/db';

function App() {
    const setIdeas = useIdeaStore((state) => state.setIdeas);

    const [modalOpen, setModalOpen] = useState(false);
    const [pendingIdea, setPendingIdea] = useState<{ text: string; challenge: string; category: Category; type: 'idea' | 'question' } | null>(null);

    useEffect(() => {
        const unsubscribe = subscribeToIdeas((ideas) => {
            setIdeas(ideas);
        });
        return () => unsubscribe();
    }, [setIdeas]);

    const handleChallenge = (text: string, challenge: string, category: Category, type: 'idea' | 'question') => {
        setPendingIdea({ text, challenge, category, type });
        setModalOpen(true);
    };

    const handleConfirmIdea = async (finalText: string) => {
        if (pendingIdea) {
            await addIdeaToDb({
                text: finalText,
                category: pendingIdea.category,
                timestamp: Date.now(),
                refined: finalText !== pendingIdea.text,
                challengeResponse: pendingIdea.challenge,
                type: pendingIdea.type,
                notes: []
            });
        }
        setModalOpen(false);
        setPendingIdea(null);
    };

    return (
        <div className="min-h-screen bg-brand-dark text-slate-100 selection:bg-brand-primary/30">
            <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-primary/10 rounded-lg">
                            <BrainCircuit className="w-6 h-6 text-brand-primary" />
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            Idea Trapper Keeper
                        </h1>
                    </div>
                    <div className="text-sm text-slate-500 font-medium">
                        Flat-Fee RIA Edition
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Capture & Refine Your Strategy
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Voice-enabled idea organization aligned with your "Flat Fee/High Tech" UVP.
                        Speak your mind, face the challenge, and build your firm.
                    </p>
                </div>

                <IdeaInput onChallenge={handleChallenge} />

                <div className="mt-16">
                    <QuadrantDashboard />
                </div>
            </main>

            {pendingIdea && (
                <ChallengeModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    idea={pendingIdea.text}
                    challengeQuestion={pendingIdea.challenge}
                    onConfirm={handleConfirmIdea}
                />
            )}
        </div>
    );
}

export default App;
