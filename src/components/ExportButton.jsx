import React from 'react';
import { Download, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

export function ExportButton({ onClick, isExporting, disabled, count }) {
    return (
        <motion.button
            whileHover={!disabled && !isExporting ? { scale: 1.02 } : {}}
            whileTap={!disabled && !isExporting ? { scale: 0.98 } : {}}
            onClick={onClick}
            disabled={disabled || isExporting}
            className={cn(
                "relative overflow-hidden group px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300",
                disabled
                    ? "bg-white/5 text-white/20 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
            )}
        >
            <div className="relative z-10 flex items-center gap-3">
                {isExporting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <Download className="w-5 h-5" />
                )}
                <span>
                    {isExporting ? 'Generating Zip...' : `Export ${count} Pairs`}
                </span>
            </div>

            {!disabled && !isExporting && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            )}
        </motion.button>
    );
}
