import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { VendorData } from '../lib/vendorService';
import { TagInput } from './TagInput';

interface EditVendorModalProps {
    vendor: VendorData | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedVendor: VendorData) => Promise<void>;
}

export function EditVendorModal({ vendor, isOpen, onClose, onSave }: EditVendorModalProps) {
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [categories, setCategories] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (vendor) {
            setName(vendor.name || '');
            setType(vendor.type || '');
            setCategories(vendor.categories ? Object.keys(vendor.categories) : []);
        }
    }, [vendor]);

    if (!isOpen || !vendor) return null;

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Reconstruct categories object
            // Preserve existing category data if it exists, otherwise create new default
            const updatedCategories: VendorData['categories'] = {};

            categories.forEach(cat => {
                if (vendor.categories && vendor.categories[cat]) {
                    updatedCategories[cat] = vendor.categories[cat];
                } else {
                    updatedCategories[cat] = {
                        status: 'green', // Default status
                        note: ''
                    };
                }
            });

            const updatedVendor: VendorData = {
                ...vendor,
                name,
                type,
                categories: updatedCategories
            };

            await onSave(updatedVendor);
            onClose();
        } catch (error) {
            console.error("Failed to save vendor:", error);
            alert("Failed to save changes. Check console.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-slate-100">Edit Vendor</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-200 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Vendor Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
                            placeholder="e.g. Salesforce"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Type</label>
                        <input
                            type="text"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
                            placeholder="e.g. CRM"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Categories</label>
                        <TagInput
                            tags={categories}
                            onChange={setCategories}
                            placeholder="Add category..."
                        />
                        <p className="text-xs text-slate-500">Press Enter to add a category.</p>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-800 bg-slate-900/50 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}
