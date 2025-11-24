import React from 'react';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';

export function Layout({ children, headerActions }) {
    return (
        <div className="min-h-screen text-white selection:bg-purple-500/30 flex flex-col">
            {/* Background Elements */}
            <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
            </div>

            <header className="sticky top-0 z-50 border-b border-white/5 bg-black/20 backdrop-blur-xl">
                <div className="w-full px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
                            <Layers className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                            Dataset Visualizer
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        {headerActions}
                    </div>
                </div>
            </header>

            <main className="w-full px-6 py-8 flex-1">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {children}
                </motion.div>
            </main>

            <footer className="border-t border-white/5 py-6 text-center">
                <div className="text-sm text-white/40 font-medium">
                    v1.0.0
                </div>
            </footer>
        </div>
    );
}
