import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '../lib/utils';

export function ImageInspector({ isOpen, onClose, item, imageFit = 'contain', onToggleFit, showFilenames, onToggleFilenames, showResolution, onToggleResolution }) {
    const [resolutions, setResolutions] = React.useState({ target: null, controls: {} });

    // Reset resolutions when item changes
    React.useEffect(() => {
        setResolutions({ target: null, controls: {} });
    }, [item]);

    const handleImageLoad = (type, id, e) => {
        const { naturalWidth, naturalHeight } = e.target;
        if (type === 'target') {
            setResolutions(prev => ({ ...prev, target: `${naturalWidth}x${naturalHeight}` }));
        } else {
            setResolutions(prev => ({
                ...prev,
                controls: { ...prev.controls, [id]: `${naturalWidth}x${naturalHeight}` }
            }));
        }
    };

    if (!item) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-[95vw] h-[90vh] bg-[#0f1115] border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
                            <div className="flex items-center gap-3">
                                <span className="px-2 py-1 rounded-md bg-purple-500/20 text-purple-300 text-xs font-medium border border-purple-500/20">
                                    TARGET {String(item.index + 1).padStart(2, '0')}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onToggleFilenames && onToggleFilenames()}
                                    className={`px-3 py-1.5 rounded-lg border transition-colors text-sm font-medium ${showFilenames ? 'bg-white/10 border-white/20 text-white' : 'bg-white/5 border-white/10 text-white/60 hover:text-white/80'}`}
                                >
                                    Names
                                </button>
                                <button
                                    onClick={() => onToggleResolution && onToggleResolution()}
                                    className={`px-3 py-1.5 rounded-lg border transition-colors text-sm font-medium ${showResolution ? 'bg-white/10 border-white/20 text-white' : 'bg-white/5 border-white/10 text-white/60 hover:text-white/80'}`}
                                >
                                    Res
                                </button>
                                <div className="h-6 w-px bg-white/10 mx-1" />
                                <button
                                    onClick={() => onToggleFit && onToggleFit()}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 transition-colors text-sm"
                                >
                                    {imageFit === 'cover' ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                                    <span>{imageFit === 'cover' ? 'Fill' : 'Fit'}</span>
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto lg:overflow-hidden p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr,1fr] gap-8 h-full">
                                {/* Target Section */}
                                <div className="space-y-4 flex flex-col h-full">
                                    <div className="flex items-center justify-between flex-shrink-0">
                                        <h4 className="text-sm font-medium text-white/60 uppercase tracking-wider">Target Image</h4>
                                    </div>
                                    <div className="flex-1 min-h-[400px] lg:min-h-0 bg-black/40 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center relative group">
                                        <img
                                            src={item.target.preview}
                                            alt="Target"
                                            onLoad={(e) => handleImageLoad('target', null, e)}
                                            className={cn(
                                                "w-full h-full transition-all duration-300",
                                                imageFit === 'contain' ? "object-contain" : "object-cover"
                                            )}
                                        />
                                        {(showFilenames || showResolution) && (
                                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/60 backdrop-blur-sm flex flex-col gap-1">
                                                {showFilenames && (
                                                    <p className="text-sm text-center text-white/90 truncate px-1 font-medium">
                                                        {item.target.name}
                                                    </p>
                                                )}
                                                {showResolution && resolutions.target && (
                                                    <p className="text-xs text-center text-white/50 font-mono">
                                                        {resolutions.target}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Controls Section */}
                                <div className="space-y-4 flex flex-col h-full overflow-hidden">
                                    <div className="flex items-center justify-between flex-shrink-0">
                                        <h4 className="text-sm font-medium text-white/60 uppercase tracking-wider">
                                            Control Images ({item.controls.length})
                                        </h4>
                                    </div>

                                    {item.controls.length > 0 ? (
                                        <div className="flex flex-col flex-1 min-h-0 gap-4 overflow-y-auto pr-2">
                                            {item.controls.map((control, idx) => (
                                                <div key={control.id || idx} className="flex-1 min-h-[150px] relative group flex-shrink-0" title={control.name}>
                                                    <div className="absolute inset-0 bg-black/40 rounded-xl border border-white/10 overflow-hidden">
                                                        <img
                                                            src={control.preview}
                                                            alt={`Control ${idx + 1}`}
                                                            onLoad={(e) => handleImageLoad('control', control.id, e)}
                                                            className={cn(
                                                                "w-full h-full transition-all duration-300",
                                                                imageFit === 'contain' ? "object-contain p-4" : "object-cover"
                                                            )}
                                                        />
                                                        {(showFilenames || showResolution) && (
                                                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 backdrop-blur-sm flex flex-col gap-0.5">
                                                                {showFilenames && (
                                                                    <p className="text-xs text-center text-white/90 truncate px-1 font-medium">
                                                                        {control.name}
                                                                    </p>
                                                                )}
                                                                {showResolution && resolutions.controls[control.id] && (
                                                                    <p className="text-[10px] text-center text-white/50 font-mono">
                                                                        {resolutions.controls[control.id]}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex-1 flex flex-col items-center justify-center text-white/20 border border-dashed border-white/10 rounded-xl bg-white/5">
                                            <ImageIcon className="w-12 h-12 mb-4 opacity-50" />
                                            <p>No control images added</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
