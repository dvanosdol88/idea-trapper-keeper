import { create } from 'zustand';

export type Category = 'A' | 'B' | 'C' | 'D';

export interface Idea {
    id: string;
    text: string;
    category: Category;
    timestamp: number;
    refined?: boolean;
    challengeResponse?: string;
    type: 'idea' | 'question';
    notes: { id: string; text: string; timestamp: number }[];
}

interface IdeaStore {
    ideas: Idea[];
    addIdea: (idea: Idea) => void;
    updateIdea: (id: string, updates: Partial<Idea>) => void;
    addNote: (ideaId: string, noteText: string) => void;
    removeIdea: (id: string) => void;
    setIdeas: (ideas: Idea[]) => void;
}

const SEED_DATA: Idea[] = [
    {
        id: 'seed-1',
        text: "Client Onboarding- how will clients get us their initial financial data?",
        category: 'A',
        timestamp: Date.now(),
        type: 'question',
        refined: false,
        notes: []
    }
];

export const useIdeaStore = create<IdeaStore>((set) => ({
    ideas: SEED_DATA,
    addIdea: (idea) => set((state) => ({ ideas: [...state.ideas, idea] })),
    updateIdea: (id, updates) =>
        set((state) => ({
            ideas: state.ideas.map((idea) =>
                idea.id === id ? { ...idea, ...updates } : idea
            ),
        })),
    addNote: (ideaId, noteText) =>
        set((state) => ({
            ideas: state.ideas.map((idea) =>
                idea.id === ideaId
                    ? {
                        ...idea,
                        notes: [
                            ...idea.notes,
                            { id: crypto.randomUUID(), text: noteText, timestamp: Date.now() },
                        ],
                    }
                    : idea
            ),
        })),
    removeIdea: (id) =>
        set((state) => ({ ideas: state.ideas.filter((i) => i.id !== id) })),
    setIdeas: (ideas) => set({ ideas }),
}));
