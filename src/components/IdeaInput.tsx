import { useState, useEffect } from 'react';
import { Mic, Send, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { analyzeIdea } from '../lib/analyzer';

interface IdeaInputProps {
    onChallenge: (idea: string, challenge: string, category: any, type: 'idea' | 'question') => void;
}

export function IdeaInput({ onChallenge }: IdeaInputProps) {
    const [text, setText] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

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
            handleSubmit(transcript);
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

        setIsAnalyzing(true);

        // Simulate analysis delay for effect
        setTimeout(() => {
            const analysis = analyzeIdea(input);
            setIsAnalyzing(false);
            setText('');

            // Trigger the challenge flow
            onChallenge(input, analysis.challengeQuestion || "How does this add value?", analysis.suggestedCategory, analysis.type);
        }, 800);
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
                        disabled={isAnalyzing}
                    />

                    <button
                        onClick={() => handleSubmit(text)}
                        disabled={!text.trim() || isAnalyzing}
                        className="p-3 bg-brand-primary hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isAnalyzing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                    </button>
                </div>
            </div>
        </div>
    );
}
