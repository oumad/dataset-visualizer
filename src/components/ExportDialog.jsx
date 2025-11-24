import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Package, Layers, Image as ImageIcon } from 'lucide-react';

export function ExportDialog({ isOpen, onClose, onConfirm, dataset }) {
    const [name, setName] = useState('dataset');

    if (!dataset) return null;

    const targetCount = dataset.length;
    const controlCount = dataset.reduce((acc, item) => acc + item.controls.length, 0);
    const totalImages = targetCount + controlCount;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onConfirm(name.trim());
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-[#0f1115] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <form onSubmit={handleSubmit}>
                            {/* Header */}
                            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                                <h3 className="text-lg font-semibold text-white">Export Dataset</h3>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6">
                                {/* Stats Summary */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center">
                                        <Package className="w-5 h-5 text-purple-400 mb-2" />
                                        <div className="text-lg font-bold text-white">{targetCount}</div>
                                        <div className="text-[10px] text-white/40 uppercase tracking-wider">Targets</div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center">
                                        <Layers className="w-5 h-5 text-blue-400 mb-2" />
                                        <div className="text-lg font-bold text-white">{controlCount}</div>
                                        <div className="text-[10px] text-white/40 uppercase tracking-wider">Controls</div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center">
                                        <ImageIcon className="w-5 h-5 text-green-400 mb-2" />
                                        <div className="text-lg font-bold text-white">{totalImages}</div>
                                        <div className="text-[10px] text-white/40 uppercase tracking-wider">Total</div>
                                    </div>
                                </div>

                                {/* Name Input */}
                                <div className="space-y-2">
                                    <label htmlFor="datasetName" className="text-sm font-medium text-white/80 block">
                                        Dataset Name
                                    </label>
                                    <input
                                        id="datasetName"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                                        placeholder="Enter name..."
                                        autoFocus
                                    />
                                    <p className="text-xs text-white/40">
                                        This will be the name of the downloaded ZIP file.
                                    </p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!name.trim()}
                                    className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    Export ZIP
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
