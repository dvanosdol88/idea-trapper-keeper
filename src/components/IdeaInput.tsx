import { useState, useEffect } from 'react';
import { Mic, Send, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

interface IdeaInputProps {
    onChallenge?: (idea: string, challenge: string, category: any, type: 'idea' | 'question') => void;
}

export function IdeaInput({ }: IdeaInputProps) {
    const [text, setText] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Simple Web Speech API implementation
    useEffect(() => {
        if (!('webkitSpeechRecognition' in window)) return;

        // @ts-ignore
        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setText(transcript);
            setIsListening(false);
            // Optional: Auto-submit on voice end? For now just set text.
            // handleSubmit(transcript); 
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        if (isListening) {
            recognition.start();
        } else {
            recognition.stop();
        }

        return () => recognition.stop();
    }, [isListening]);

    const handleSubmit = async (input: string) => {
        if (!input.trim()) return;

        setIsSaving(true);

        try {
            await addDoc(collection(db, "ideas"), {
                text: input,
                category: "D", // Default to Miscellaneous
                timestamp: Date.now(),
                type: 'idea',
                refined: false,
                notes: []
            });

            setText('');
            alert('Idea Captured!');
        } catch (error) {
            console.error("Error adding document: ", error);
            alert('Error capturing idea. See console.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto mb-8">
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary to-brand-accent rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex items-center bg-brand-dark border border-slate-700 rounded-xl p-2 shadow-2xl">
                    <button
                        onClick={() => setIsListening(!isListening)}
                        className={cn(
                            "p-3 rounded-lg transition-all duration-300",
                            isListening ? "bg-red-500/20 text-red-500 animate-pulse" : "hover:bg-slate-800 text-slate-400 hover:text-brand-primary"
                        )}
                    >
                        <Mic className="w-6 h-6" />
                    </button>

                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit(text)}
                        placeholder={isListening ? "Listening..." : "Say or type: 'New Idea: ...'"}
                        className="flex-1 bg-transparent border-none focus:ring-0 text-lg text-slate-100 placeholder-slate-500 px-4"
                        disabled={isSaving}
                    />

                    <button
                        onClick={() => handleSubmit(text)}
                        disabled={!text.trim() || isSaving}
                        className="p-3 bg-brand-primary hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                    </button>
                </div>
            </div>
        </div>
    );
}
