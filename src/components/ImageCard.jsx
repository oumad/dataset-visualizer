import React, { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Image as ImageIcon, Maximize2 } from 'lucide-react';
import { DropZone } from './DropZone';
import { cn } from '../lib/utils';

export const ImageCard = forwardRef(({ id, index, target, controls, onRemove, onAddControl, onRemoveControl, onReplaceTarget, onInspect, imageFit = 'cover', showFilenames, showResolution }, ref) => {
    const [resolutions, setResolutions] = React.useState({ target: null, controls: {} });

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

    return (
        <motion.div
            ref={ref}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-panel rounded-2xl p-4 relative group"
        >
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => onInspect && onInspect(id)}
                    className="p-2 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
                    title="Inspect Details"
                >
                    <Maximize2 className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onRemove(id)}
                    className="p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    title="Remove Pair"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="grid gap-6 grid-cols-1">
                {/* Target Image Section */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-1 rounded-md bg-purple-500/20 text-purple-300 text-xs font-medium border border-purple-500/20">
                                TARGET {String(index + 1).padStart(2, '0')}
                            </span>
                        </div>
                    </div>

                    <div className="relative group/target aspect-[4/3] rounded-xl overflow-hidden bg-black/40 border border-white/10">
                        <DropZone
                            onDrop={(files) => {
                                if (files.length > 0) onReplaceTarget(id, files[0]);
                            }}
                            maxFiles={1}
                            className="w-full h-full border-none bg-transparent p-0"
                            label=""
                        >
                            {({ isDragActive }) => (
                                <>
                                    <img
                                        src={target.preview}
                                        alt="Target"
                                        onLoad={(e) => handleImageLoad('target', null, e)}
                                        className={cn("w-full h-full transition-all duration-300", imageFit === 'contain' ? "object-contain p-2" : "object-cover")}
                                    />

                                    {/* Info Overlay */}
                                    {(showFilenames || showResolution) && (
                                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 backdrop-blur-sm flex flex-col gap-0.5">
                                            {showFilenames && (
                                                <p className="text-xs text-center text-white/90 truncate px-1 font-medium">
                                                    {target.name}
                                                </p>
                                            )}
                                            {showResolution && resolutions.target && (
                                                <p className="text-[10px] text-center text-white/50 font-mono">
                                                    {resolutions.target}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Replacement Drop Zone Overlay */}
                                    <div className={cn(
                                        "absolute inset-0 transition-opacity duration-200 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20",
                                        isDragActive ? "opacity-100" : "opacity-0 group-hover/target:opacity-100"
                                    )}>
                                        <ImageIcon className="w-8 h-8 text-white/80 mb-2" />
                                        <p className="text-sm font-medium text-white">Replace Target</p>
                                        <p className="text-xs text-white/50">Drop new image</p>
                                    </div>
                                </>
                            )}
                        </DropZone>
                    </div>
                </div>

                {/* Control Images Section */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-1 rounded-md bg-blue-500/20 text-blue-300 text-xs font-medium border border-blue-500/20">
                                CONTROLS
                            </span>
                            <span className="text-sm text-white/40">{controls.length} / 3</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <AnimatePresence mode='popLayout'>
                            {controls.map((control, index) => (
                                <motion.div
                                    key={control.id || index}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="relative group/control aspect-square rounded-xl overflow-hidden bg-black/40 border border-white/10"
                                >
                                    <img
                                        src={control.preview}
                                        alt={`Control ${index + 1}`}
                                        onLoad={(e) => handleImageLoad('control', control.id, e)}
                                        className={cn("w-full h-full transition-all duration-300", imageFit === 'contain' ? "object-contain p-2" : "object-cover")}
                                    />
                                    <button
                                        onClick={() => onRemoveControl(id, control.id)}
                                        className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white/80 opacity-0 group-hover/control:opacity-100 transition-opacity hover:bg-red-500 hover:text-white z-10"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>

                                    {(showFilenames || showResolution) && (
                                        <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/60 backdrop-blur-sm flex flex-col gap-0.5">
                                            {showFilenames && (
                                                <p className="text-[10px] text-center text-white/90 truncate px-1 font-medium">
                                                    {control.name}
                                                </p>
                                            )}
                                            {showResolution && resolutions.controls[control.id] && (
                                                <p className="text-[9px] text-center text-white/50 font-mono">
                                                    {resolutions.controls[control.id]}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {controls.length < 3 && (
                            <DropZone
                                onDrop={(files) => onAddControl(id, files)}
                                maxFiles={3 - controls.length}
                                className="aspect-square border-dashed border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5"
                                label=""
                                compact={true}
                                subLabel={<Plus className="w-6 h-6 text-white/20" />}
                            />
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

ImageCard.displayName = "ImageCard";
