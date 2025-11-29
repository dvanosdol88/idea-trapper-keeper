import { useState, useEffect } from 'react';
import { IdeaInput } from './IdeaInput';
import { QuadrantDashboard } from './QuadrantDashboard';
import { ChallengeModal } from './ChallengeModal';
import { useIdeaStore, Category } from '../store/ideaStore';
import { addIdea as addIdeaToDb, subscribeToIdeas } from '../lib/db';

export function IdeaVault() {
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
        <>
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

            {pendingIdea && (
                <ChallengeModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    idea={pendingIdea.text}
                    challengeQuestion={pendingIdea.challenge}
                    onConfirm={handleConfirmIdea}
                />
            )}
        </>
    );
}
