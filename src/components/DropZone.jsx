import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

export function DropZone({ onDrop, className, label = "Drop images here", subLabel = "or click to select", maxFiles = 0, disabled = false, compact = false, children }) {
    const handleDrop = useCallback((acceptedFiles, fileRejections) => {
        if (disabled) return;

        // Handle rejections
        if (fileRejections && fileRejections.length > 0) {
            const errorMessages = fileRejections.map(({ file, errors }) => {
                return `${file.name}: ${errors.map(e => e.message).join(', ')}`;
            }).join('\n');
            alert(`Some files were rejected:\n${errorMessages}`);
        }

        if (maxFiles && acceptedFiles.length > maxFiles) {
            alert(`You can only add up to ${maxFiles} images.`);
            return;
        }

        if (acceptedFiles.length > 0) {
            onDrop(acceptedFiles);
        }
    }, [onDrop, maxFiles, disabled]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp']
        },
        maxFiles: maxFiles > 0 ? maxFiles : undefined,
        disabled
    });

    return (
        <motion.div
            whileHover={!disabled ? { scale: 1.01 } : {}}
            whileTap={!disabled ? { scale: 0.99 } : {}}
            {...getRootProps()}
            className={cn(
                "relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300",
                isDragActive ? "border-purple-500 bg-purple-500/10" : "border-white/10 hover:border-white/20 hover:bg-white/5",
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}
        >
            <input {...getInputProps()} />
            {children ? (
                typeof children === 'function' ? children({ isDragActive }) : children
            ) : (
                <div className={cn("flex flex-col items-center justify-center text-center w-full h-full", compact ? "p-4" : "p-8")}>
                    {!compact && (
                        <div className={cn(
                            "p-4 rounded-full mb-4 transition-colors duration-300",
                            isDragActive ? "bg-purple-500/20 text-purple-400" : "bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white/60"
                        )}>
                            {isDragActive ? <Upload className="w-8 h-8" /> : <ImageIcon className="w-8 h-8" />}
                        </div>
                    )}
                    {label && <h3 className={cn("font-medium text-white/90 mb-1", compact ? "text-sm" : "text-lg")}>{label}</h3>}
                    {subLabel && <div className="text-sm text-white/50">{subLabel}</div>}
                </div>
            )}
        </motion.div>
    );
}
