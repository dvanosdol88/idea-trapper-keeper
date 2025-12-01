import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { VendorTable } from './VendorTable';
import { EditVendorModal } from './EditVendorModal';
import { subscribeToVendors, addVendor, VendorData } from '../lib/vendorService';

export function VendorMatrix() {
    const [vendors, setVendors] = useState<VendorData[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingVendor, setEditingVendor] = useState<VendorData | null>(null);

    useEffect(() => {
        const unsubscribe = subscribeToVendors(setVendors);
        return () => unsubscribe();
    }, []);

    const handleAddVendor = () => {
        setEditingVendor({
            name: '',
            type: '',
            categories: {}
        });
        setIsEditModalOpen(true);
    };

    const handleEditVendor = (vendor: VendorData) => {
        setEditingVendor(vendor);
        setIsEditModalOpen(true);
    };

    const handleSaveVendor = async (vendor: VendorData) => {
        if (vendor.id) {
            // TODO: Implement update logic
            console.log("Update vendor", vendor);
        } else {
            await addVendor(vendor);
        }
        setIsEditModalOpen(false);
    };

    const handleDeleteVendor = async (id: string) => {
        // TODO: Implement delete logic
        console.log("Delete vendor", id);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Vendor Matrix</h2>
                <button
                    onClick={handleAddVendor}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Vendor
                </button>
            </div>

            <VendorTable
                vendors={vendors}
                onDelete={handleDeleteVendor}
                onEdit={handleEditVendor}
            />

            <EditVendorModal
                vendor={editingVendor}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveVendor}
            />
        </div>
    );
}
