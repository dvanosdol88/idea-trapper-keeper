import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

interface ChallengeModalProps {
    isOpen: boolean;
    onClose: () => void;
    idea: string;
    challengeQuestion: string;
    onConfirm: (refinedIdea: string) => void;
}

export function ChallengeModal({ isOpen, onClose, idea, challengeQuestion, onConfirm }: ChallengeModalProps) {
    const [refinement, setRefinement] = useState('');

    const handleConfirm = () => {
        // Combine original idea with refinement if provided
        const finalIdea = refinement ? `${idea} (${refinement})` : idea;
        onConfirm(finalIdea);
        setRefinement('');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3 text-brand-accent">
                                    <AlertCircle className="w-6 h-6" />
                                    <h3 className="text-xl font-semibold text-white">Gap Analysis Challenge</h3>
                                </div>
                                <button onClick={onClose} className="text-slate-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mb-6">
                                <p className="text-slate-300 mb-2">Your Idea:</p>
                                <div className="p-3 bg-slate-800 rounded-lg text-slate-100 italic border-l-4 border-brand-primary">
                                    "{idea}"
                                </div>
                            </div>

                            <div className="mb-6">
                                <p className="text-brand-accent font-medium mb-2">Challenge:</p>
                                <p className="text-white text-lg">{challengeQuestion}</p>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm text-slate-400 mb-2">Refine your idea (Optional):</label>
                                <textarea
                                    value={refinement}
                                    onChange={(e) => setRefinement(e.target.value)}
                                    placeholder="E.g., Yes, I will use a multi-touch email sequence..."
                                    className="w-full h-24 bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-100 focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none"
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    Discard
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className="flex items-center gap-2 px-6 py-2 bg-brand-primary hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    Accept & Add
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
