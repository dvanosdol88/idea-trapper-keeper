import { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';

interface TagInputProps {
    tags: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
    className?: string;
}

export function TagInput({ tags, onChange, placeholder = "Add a tag...", className }: TagInputProps) {
    const [input, setInput] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const trimmedInput = input.trim();

            if (trimmedInput && !tags.includes(trimmedInput)) {
                onChange([...tags, trimmedInput]);
                setInput('');
            }
        } else if (e.key === 'Backspace' && !input && tags.length > 0) {
            onChange(tags.slice(0, -1));
        }
    };

    const removeTag = (tagToRemove: string) => {
        onChange(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div
            className={cn(
                "flex flex-wrap items-center gap-2 p-2 bg-slate-950 border border-slate-800 rounded-lg focus-within:ring-2 focus-within:ring-brand-primary focus-within:border-transparent transition-all",
                className
            )}
            onClick={() => inputRef.current?.focus()}
        >
            {tags.map((tag) => (
                <span
                    key={tag}
                    className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-md border border-blue-500/30"
                >
                    {tag}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            removeTag(tag);
                        }}
                        className="hover:text-blue-300 focus:outline-none"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </span>
            ))}
            <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={tags.length === 0 ? placeholder : ''}
                className="flex-1 bg-transparent border-none outline-none text-sm text-slate-200 placeholder-slate-500 min-w-[120px]"
            />
        </div>
    );
}
