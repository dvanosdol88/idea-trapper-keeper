import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Clock, MessageSquare, CheckSquare } from 'lucide-react';
import { Idea, useIdeaStore } from '../store/ideaStore';
import { cn } from '../lib/utils';
import { addNoteToIdea } from '../lib/db';
import { createLinearIssue, isLinearConfigured } from '../lib/linearService';

interface IdeaDetailsModalProps {
    idea: Idea;
    isOpen: boolean;
    onClose: () => void;
}

export function IdeaDetailsModal({ idea: initialIdea, isOpen, onClose }: IdeaDetailsModalProps) {
    const [noteText, setNoteText] = useState('');
    const [isExporting, setIsExporting] = useState(false);
    const addNote = useIdeaStore((state) => state.addNote);

    // Get the latest version of the idea from the store to ensure reactivity
    const idea = useIdeaStore((state) => state.ideas.find((i) => i.id === initialIdea.id)) || initialIdea;

    const handleAddNote = async () => {
        if (!noteText.trim()) return;

        // Optimistic update
        addNote(idea.id, noteText);

        // Persist to DB
        try {
            await addNoteToIdea(idea.id, noteText);
        } catch (error) {
            console.error("Failed to persist note:", error);
            // Optionally revert optimistic update here
        }

        setNoteText('');
    };

    const handleExportToLinear = async () => {
        if (!isLinearConfigured()) {
            alert("Please configure your Linear API key in the .env file.");
            return;
        }

        setIsExporting(true);
        try {
            const description = `
**Original Idea:**
${idea.text}

**Gap Analysis Challenge:**
${idea.challengeResponse || "N/A"}

**Notes:**
${idea.notes?.map(n => `- ${n.text} (${new Date(n.timestamp).toLocaleString()})`).join('\n') || "None"}
            `;

            const issue = await createLinearIssue(idea.text, description);
            alert(`Successfully created Linear issue: ${issue.identifier}`);
        } catch (error) {
            console.error(error);
            alert("Failed to create Linear issue. Check console for details.");
        } finally {
            setIsExporting(false);
        }
    };

    // Sort notes by timestamp ascending (oldest first)
    const sortedNotes = [...(idea.notes || [])].sort((a, b) => a.timestamp - b.timestamp);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAddNote();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-950/50">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                                        idea.type === 'question' ? "bg-amber-500/20 text-amber-500" : "bg-brand-primary/20 text-brand-primary"
                                    )}>
                                        {idea.type === 'question' ? '?' : '!'}
                                    </div>
                                    <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                                        {new Date(idea.timestamp).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="text-xl font-semibold text-slate-100 leading-snug">{idea.text}</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleExportToLinear}
                                    disabled={isExporting}
                                    className="text-slate-400 hover:text-brand-primary transition-colors disabled:opacity-50"
                                    title="Export to Linear"
                                >
                                    <CheckSquare className="w-6 h-6" />
                                </button>
                                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Timeline Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Initial Idea Entry */}
                            <div className="relative pl-8 border-l-2 border-slate-800">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-800 border-2 border-slate-600"></div>
                                <div className="mb-1 text-xs text-slate-500 flex items-center gap-2">
                                    <Clock className="w-3 h-3" />
                                    Created
                                </div>
                                <p className="text-slate-400 text-sm">Idea captured.</p>
                                {idea.challengeResponse && (
                                    <div className="mt-2 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                        <p className="text-xs text-brand-accent mb-1">Gap Analysis Challenge:</p>
                                        <p className="text-slate-300 text-sm italic">"{idea.challengeResponse}"</p>
                                    </div>
                                )}
                            </div>

                            {/* Notes Timeline */}
                            {sortedNotes.map((note) => (
                                <div key={note.id} className="relative pl-8 border-l-2 border-brand-primary/30">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-brand-primary border-2 border-brand-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                    <div className="mb-1 text-xs text-brand-primary flex items-center gap-2">
                                        <MessageSquare className="w-3 h-3" />
                                        {new Date(note.timestamp).toLocaleString()}
                                    </div>
                                    <div className="bg-slate-800 p-3 rounded-lg text-slate-200 text-sm shadow-sm whitespace-pre-wrap">
                                        {note.text}
                                    </div>
                                </div>
                            ))}

                            {sortedNotes.length === 0 && (
                                <div className="text-center py-8 text-slate-600 text-sm italic">
                                    No notes yet. Start the discussion below.
                                </div>
                            )}
                        </div>

                        {/* Footer Input */}
                        <div className="p-4 bg-slate-950 border-t border-slate-800">
                            <div className="flex gap-2 items-end">
                                <textarea
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Add a note, update, or answer... (Shift+Enter for new line)"
                                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-brand-primary focus:border-transparent min-h-[80px] resize-none"
                                />
                                <button
                                    onClick={handleAddNote}
                                    disabled={!noteText.trim()}
                                    className="p-3 bg-brand-primary hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-[1px]"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
