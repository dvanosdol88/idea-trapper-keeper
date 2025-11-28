import { useState } from 'react';
import { motion } from 'framer-motion';
import { useIdeaStore, Category, Idea } from '../store/ideaStore';
import { cn } from '../lib/utils';
import { LayoutGrid, Target, Megaphone, Lightbulb, MessageSquare } from 'lucide-react';
import { IdeaDetailsModal } from './IdeaDetailsModal';

const QUADRANTS: { id: Category; title: string; icon: any; color: string; description: string }[] = [
    {
        id: 'A',
        title: 'Client Experience',
        icon: LayoutGrid,
        color: 'text-emerald-400',
        description: 'The "How" - Service & Delivery'
    },
    {
        id: 'B',
        title: 'The UVP',
        icon: Target,
        color: 'text-brand-accent',
        description: 'The "Why" - Flat Fee & High Tech'
    },
    {
        id: 'C',
        title: 'Marketing',
        icon: Megaphone,
        color: 'text-purple-400',
        description: 'The "Hook" - Growth & Outreach'
    },
    {
        id: 'D',
        title: 'Miscellaneous',
        icon: Lightbulb,
        color: 'text-amber-400',
        description: 'Future Models & Expansion'
    },
];

export function QuadrantDashboard() {
    const ideas = useIdeaStore((state) => state.ideas);
    const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl mx-auto p-4">
                {QUADRANTS.map((quadrant) => {
                    const quadrantIdeas = ideas.filter((i) => i.category === quadrant.id);
                    const Icon = quadrant.icon;

                    return (
                        <div
                            key={quadrant.id}
                            className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm hover:border-slate-700 transition-colors"
                        >
                            <div className="flex items-center gap-3 mb-4 border-b border-slate-800 pb-4">
                                <div className={cn("p-2 rounded-lg bg-slate-950", quadrant.color)}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-100">{quadrant.title}</h2>
                                    <p className="text-sm text-slate-500">{quadrant.description}</p>
                                </div>
                                <span className="ml-auto text-xs font-mono text-slate-600 bg-slate-950 px-2 py-1 rounded">
                                    {quadrantIdeas.length}
                                </span>
                            </div>

                            <div className="space-y-3 min-h-[200px]">
                                {quadrantIdeas.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-800/50 rounded-xl">
                                        <p className="text-sm">No ideas yet</p>
                                    </div>
                                ) : (
                                    quadrantIdeas.map((idea) => (
                                        <motion.div
                                            key={idea.id}
                                            layoutId={idea.id}
                                            onClick={() => setSelectedIdea(idea)}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="group relative bg-slate-800 p-4 rounded-xl border border-slate-700/50 hover:border-brand-primary/50 transition-all cursor-pointer hover:shadow-lg hover:shadow-brand-primary/10"
                                        >
                                            <div className="flex gap-3">
                                                <div className={cn(
                                                    "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                                                    idea.type === 'question' ? "bg-amber-500/20 text-amber-500" : "bg-brand-primary/20 text-brand-primary"
                                                )}>
                                                    {idea.type === 'question' ? '?' : '!'}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-slate-200 line-clamp-2">{idea.text}</p>
                                                    <div className="flex justify-between items-center mt-3">
                                                        <span className="text-xs text-slate-500">
                                                            {new Date(idea.timestamp).toLocaleTimeString()}
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            {idea.notes && idea.notes.length > 0 && (
                                                                <span className="flex items-center gap-1 text-xs text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full">
                                                                    <MessageSquare className="w-3 h-3" />
                                                                    {idea.notes.length}
                                                                </span>
                                                            )}
                                                            {idea.refined && (
                                                                <span className="text-xs text-brand-accent bg-brand-accent/10 px-2 py-0.5 rounded-full">
                                                                    Refined
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {selectedIdea && (
                <IdeaDetailsModal
                    idea={selectedIdea}
                    isOpen={!!selectedIdea}
                    onClose={() => setSelectedIdea(null)}
                />
            )}
        </>
    );
}
