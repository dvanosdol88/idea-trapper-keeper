import { useState, useEffect } from 'react';
import { subscribeToVendors, VendorData } from '../lib/vendorService';
import { Plus, AlertCircle, Search } from 'lucide-react';
import { VendorTable } from './VendorTable';
import { EditVendorModal } from './EditVendorModal';
import { collection, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export function VendorMatrix() {
    const [jsonInput, setJsonInput] = useState('');
    const [vendors, setVendors] = useState<VendorData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [editingVendor, setEditingVendor] = useState<VendorData | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribeToVendors(
            (data) => {
                setVendors(data);
            },
            (err) => {
                setError(`Connection Error: ${err.message}. Check console for details.`);
            }
        );
        return () => unsubscribe();
    }, []);

    const handleAddVendor = async () => {
        try {
            const parsedData = JSON.parse(jsonInput);

            // Check if it's an array (Bulk Add) or Object (Single Add)
            if (Array.isArray(parsedData)) {
                const promises = parsedData.map(vendor =>
                    addDoc(collection(db, "vendors"), {
                        ...vendor,
                        createdAt: new Date()
                    })
                );
                await Promise.all(promises); // Wait for all to finish
                alert(`✅ Success! Added ${parsedData.length} vendors.`);
            } else {
                // Single Add
                await addDoc(collection(db, "vendors"), {
                    ...parsedData,
                    createdAt: new Date()
                });
                alert("✅ Success! Added 1 vendor.");
            }

            setJsonInput('');
        } catch (err: any) {
            console.error("Error:", err);
            alert("❌ Error: " + err.message);
        }
    };

    const handleDeleteVendor = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this vendor?")) {
            try {
                await deleteDoc(doc(db, "vendors", id));
            } catch (err: any) {
                console.error("Error deleting vendor:", err);
                alert("❌ Error deleting vendor: " + err.message);
            }
        }
    };

    const handleEditVendor = (vendor: VendorData) => {
        setEditingVendor(vendor);
        setIsEditModalOpen(true);
    };

    const handleSaveVendor = async (updatedVendor: VendorData) => {
        if (!updatedVendor.id) return;

        try {
            const vendorRef = doc(db, "vendors", updatedVendor.id);
            // Remove id from data to be saved
            const { id, ...dataToSave } = updatedVendor;
            await updateDoc(vendorRef, dataToSave);
        } catch (err: any) {
            console.error("Error updating vendor:", err);
            throw err; // Re-throw to be caught by modal
        }
    };

    const filteredVendors = vendors.filter((vendor) => {
        if (!vendor) return false;

        const terms = searchTerm.toLowerCase().split(',').map(t => t.trim()).filter(t => t.length > 0);

        if (terms.length === 0) return true; // Show all if no valid search terms

        // Check if ANY of the terms match ANY of the fields
        return terms.some(term => {
            const inName = vendor.name?.toLowerCase().includes(term) || false;
            const inType = vendor.type?.toLowerCase().includes(term) || false;

            const categories = vendor.categories || {};
            const inCategories = Object.keys(categories).some(cat => cat.toLowerCase().includes(term));
            const inNotes = Object.values(categories).some(val => val?.note?.toLowerCase().includes(term));
            const inStatus = Object.values(categories).some(val => val?.status?.toLowerCase().includes(term));

            return inName || inType || inCategories || inNotes || inStatus;
        });
    });

    return (
        <div className="space-y-8">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-slate-100 mb-4">Data Ingest</h2>
                <div className="space-y-4">
                    <textarea
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        placeholder='Paste JSON here... e.g., { "name": "Vendor Name", "type": "CRM", ... }'
                        className="w-full h-40 bg-slate-950 border border-slate-700 rounded-lg p-4 text-slate-300 font-mono text-sm focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none"
                    />

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {error && (
                                <div className="flex items-center gap-2 text-red-400 text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleAddVendor}
                            disabled={!jsonInput.trim()}
                            className="flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Plus className="w-4 h-4" />
                            Add Vendor
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-100">Vendor Database</h2>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search vendors..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                        />
                    </div>
                </div>
                <VendorTable
                    vendors={filteredVendors}
                    onDelete={handleDeleteVendor}
                    onEdit={handleEditVendor}
                />
            </div>

            <EditVendorModal
                vendor={editingVendor}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveVendor}
            />
        </div>
    );
}
