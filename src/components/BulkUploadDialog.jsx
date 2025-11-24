import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, AlertCircle, FileImage } from 'lucide-react';

export function BulkUploadDialog({ isOpen, onClose, onConfirm, analysis }) {
    if (!analysis) return null;

    const { matches, unmatched, total } = analysis;

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
                        className="relative w-full max-w-2xl bg-[#0f1115] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
                    >
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                            <h3 className="text-lg font-semibold text-white">Bulk Upload Review</h3>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Summary Stats */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                                    <div className="text-2xl font-bold text-white mb-1">{total}</div>
                                    <div className="text-xs text-white/40 uppercase tracking-wider">Total Files</div>
                                </div>
                                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
                                    <div className="text-2xl font-bold text-green-400 mb-1">{matches.length}</div>
                                    <div className="text-xs text-green-400/60 uppercase tracking-wider">Matches</div>
                                </div>
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
                                    <div className="text-2xl font-bold text-red-400 mb-1">{unmatched.length}</div>
                                    <div className="text-xs text-red-400/60 uppercase tracking-wider">Unmatched</div>
                                </div>
                            </div>

                            {/* Matches List */}
                            {matches.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="text-sm font-medium text-white/60 uppercase tracking-wider flex items-center gap-2">
                                        <Check className="w-4 h-4 text-green-400" />
                                        Matched Files
                                    </h4>
                                    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                                        <div className="max-h-[200px] overflow-y-auto">
                                            {matches.map((match, idx) => (
                                                <div key={idx} className="px-4 py-3 border-b border-white/5 last:border-0 flex items-center justify-between hover:bg-white/5 transition-colors">
                                                    <div className="flex items-center gap-3 overflow-hidden">
                                                        <FileImage className="w-4 h-4 text-white/40 flex-shrink-0" />
                                                        <span className="text-sm text-white/80 truncate">{match.controlName}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-white/40 flex-shrink-0">
                                                        <span>→</span>
                                                        <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/20">
                                                            {match.targetName}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Unmatched List */}
                            {unmatched.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="text-sm font-medium text-white/60 uppercase tracking-wider flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-red-400" />
                                        Unmatched Files
                                    </h4>
                                    <div className="bg-red-500/5 rounded-xl border border-red-500/10 overflow-hidden">
                                        <div className="max-h-[150px] overflow-y-auto">
                                            {unmatched.map((name, idx) => (
                                                <div key={idx} className="px-4 py-2 border-b border-red-500/10 last:border-0 flex items-center gap-3 text-red-300/80 text-sm hover:bg-red-500/5 transition-colors">
                                                    <X className="w-3 h-3 opacity-50" />
                                                    <span className="truncate">{name}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="px-4 py-2 bg-red-500/10 text-xs text-red-300/60 border-t border-red-500/10">
                                            These files will be ignored. Ensure filenames match target images.
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex items-center justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                disabled={matches.length === 0}
                                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Check className="w-4 h-4" />
                                Import {matches.length} Images
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
