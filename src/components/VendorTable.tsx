import { VendorData } from '../lib/vendorService';
import { cn } from '../lib/utils';
import { Trash2 } from 'lucide-react';

interface VendorTableProps {
    vendors: VendorData[];
    onDelete: (id: string) => void;
    onEdit: (vendor: VendorData) => void;
}

export function VendorTable({ vendors, onDelete, onEdit }: VendorTableProps) {
    if (vendors.length === 0) {
        return (
            <div className="text-center py-12 bg-slate-900/50 border border-slate-800 rounded-2xl">
                <p className="text-slate-500 italic">No vendors found. Add some data to get started.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm">
            <table className="w-full text-left text-sm text-slate-400">
                <thead className="bg-slate-950 text-slate-200 uppercase font-medium text-xs tracking-wider">
                    <tr>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Categories</th>
                        <th className="px-6 py-4">Pricing</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Notes</th>
                        <th className="px-6 py-4 w-24"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {vendors.map((vendor) => (
                        <tr key={vendor.id} className="hover:bg-slate-800/50 transition-colors group">
                            <td className="px-6 py-4 font-medium text-slate-200">{vendor.name || 'Unknown Vendor'}</td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                    {vendor.type || 'Uncategorized'}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-2">
                                    {vendor.categories && Object.keys(vendor.categories).map((cat) => (
                                        <span key={cat} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-300 border border-slate-700">
                                            {cat}
                                        </span>
                                    ))}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-slate-400">-</td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col gap-1">
                                    {vendor.categories && Object.entries(vendor.categories).map(([key, value]) => (
                                        <div key={key} className="flex items-center gap-2">
                                            <div className={cn(
                                                "w-2 h-2 rounded-full",
                                                value?.status === 'green' ? "bg-emerald-500" :
                                                    value?.status === 'yellow' ? "bg-amber-500" :
                                                        "bg-red-500"
                                            )} />
                                            <span className="text-xs capitalize">{key}</span>
                                        </div>
                                    ))}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col gap-1">
                                    {vendor.categories && Object.entries(vendor.categories).map(([key, value]) => (
                                        <div key={key} className="text-xs">
                                            <span className="text-slate-500 mr-1">{key}:</span>
                                            <span>{value?.note || ''}</span>
                                        </div>
                                    ))}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => onEdit(vendor)}
                                        className="p-2 text-slate-500 hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
                                        title="Edit Vendor"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                    </button>
                                    <button
                                        onClick={() => vendor.id && onDelete(vendor.id)}
                                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                        title="Delete Vendor"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
