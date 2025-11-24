import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { DropZone } from './components/DropZone';
import { ImageCard } from './components/ImageCard';
import { ExportButton } from './components/ExportButton';
import { useDataset } from './hooks/useDataset';
import { generateDatasetZip } from './utils/exportUtils';
import { AnimatePresence, motion } from 'framer-motion';
import { saveAs } from 'file-saver';
import { ImageInspector } from './components/ImageInspector';
import { BulkUploadDialog } from './components/BulkUploadDialog';
import { ExportDialog } from './components/ExportDialog';
import { Maximize2, Minimize2, ChevronUp, ChevronDown, Plus } from 'lucide-react';

function App() {
    const { dataset, addTargets, removeTarget, addControl, removeControl, analyzeBulkUpload, applyBulkMatches, replaceTarget } = useDataset();
    const [isExporting, setIsExporting] = useState(false);
    const [imageFit, setImageFit] = useState('cover'); // 'cover' | 'contain'
    const [isHeaderExpanded, setIsHeaderExpanded] = useState(true);

    const [inspectingItem, setInspectingItem] = useState(null);
    const [bulkPreview, setBulkPreview] = useState(null);
    const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

    const [showFilenames, setShowFilenames] = useState(true);
    const [showResolution, setShowResolution] = useState(false);

    const handleExportClick = () => {
        if (dataset.length === 0) return;
        setIsExportDialogOpen(true);
    };

    const performExport = async (datasetName) => {
        setIsExporting(true);
        try {
            const content = await generateDatasetZip(dataset, datasetName);
            saveAs(content, `${datasetName}.zip`);
        } catch (error) {
            console.error("Export failed:", error);
            alert("Failed to export dataset. Please try again.");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Layout
            headerActions={
                <>
                    <button
                        onClick={() => setImageFit(prev => prev === 'cover' ? 'contain' : 'cover')}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 transition-colors"
                        title={imageFit === 'cover' ? "Switch to Full View" : "Switch to Fit View"}
                    >
                        {imageFit === 'cover' ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                        <span className="text-sm font-medium">{imageFit === 'cover' ? 'Fill' : 'Fit'}</span>
                    </button>

                    <div className="h-8 w-px bg-white/10 mx-2" />

                    <button
                        onClick={() => setShowFilenames(!showFilenames)}
                        className={`px-3 py-2 rounded-xl border transition-colors text-sm font-medium ${showFilenames ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-transparent text-white/40 hover:text-white/80'}`}
                        title="Toggle Filenames"
                    >
                        Names
                    </button>

                    <button
                        onClick={() => setShowResolution(!showResolution)}
                        className={`px-3 py-2 rounded-xl border transition-colors text-sm font-medium ${showResolution ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-transparent text-white/40 hover:text-white/80'}`}
                        title="Toggle Resolution"
                    >
                        Res
                    </button>

                    <div className="h-8 w-px bg-white/10 mx-2" />

                    <ExportButton
                        onClick={handleExportClick}
                        isExporting={isExporting}
                        disabled={dataset.length === 0}
                        count={dataset.length}
                    />
                </>
            }
        >
            <div className="space-y-8 pb-20">
                {/* Top Action Bar */}
                <div className="flex items-center justify-end">
                    <button
                        onClick={() => setIsHeaderExpanded(!isHeaderExpanded)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors text-sm font-medium"
                    >
                        {isHeaderExpanded ? (
                            <>
                                <ChevronUp className="w-4 h-4" />
                                <span>Hide Upload Area</span>
                            </>
                        ) : (
                            <>
                                <ChevronDown className="w-4 h-4" />
                                <span>Show Upload Area</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Main Drop Zones - Collapsible */}
                <AnimatePresence>
                    {isHeaderExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
                                <DropZone
                                    onDrop={addTargets}
                                    label="Drop Target Images"
                                    subLabel="Drag & drop multiple images to create new pairs"
                                    className="h-48 border-white/20 hover:border-purple-500/50 hover:bg-purple-500/5"
                                />
                                <DropZone
                                    onDrop={(files) => {
                                        const analysis = analyzeBulkUpload(files);
                                        setBulkPreview(analysis);
                                    }}
                                    label="Bulk Drop Control Images"
                                    subLabel="Auto-match controls to targets by filename"
                                    className="h-48 border-white/20 hover:border-blue-500/50 hover:bg-blue-500/5"
                                    disabled={dataset.length === 0}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Grid */}
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 min-[2200px]:grid-cols-5">
                    <AnimatePresence mode='popLayout'>
                        {dataset.map((item, index) => (
                            <ImageCard
                                key={item.id}
                                id={item.id}
                                index={index}
                                target={item.target}
                                controls={item.controls}
                                onRemove={removeTarget}
                                onAddControl={addControl}
                                onRemoveControl={removeControl}
                                onReplaceTarget={replaceTarget}
                                onInspect={() => setInspectingItem({ ...item, index })}
                                imageFit={imageFit}
                                showFilenames={showFilenames}
                                showResolution={showResolution}
                            />
                        ))}
                    </AnimatePresence>

                    {dataset.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-1 md:col-span-2 xl:col-span-3 2xl:col-span-4 min-[2200px]:col-span-5 text-center py-20 text-white/20"
                        >
                            No images added yet. Start by dropping some target images above.
                        </motion.div>
                    )}
                    {dataset.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            layout
                            className="glass-panel rounded-2xl p-4 relative group min-h-[400px] flex flex-col"
                        >
                            <DropZone
                                onDrop={addTargets}
                                label=""
                                subLabel=""
                                className="flex-1 border-dashed border-2 border-white/5 hover:border-purple-500/50 hover:bg-purple-500/5 rounded-xl transition-all group/drop"
                            >
                                <div className="flex flex-col items-center justify-center text-white/20 group-hover/drop:text-purple-400 transition-colors h-full">
                                    <div className="p-4 rounded-full bg-white/5 group-hover/drop:bg-purple-500/10 mb-4 transition-colors">
                                        <Plus className="w-8 h-8" />
                                    </div>
                                    <span className="text-lg font-medium">Add Targets</span>
                                </div>
                            </DropZone>
                        </motion.div>
                    )}
                </div>
            </div>

            <ImageInspector
                isOpen={!!inspectingItem}
                onClose={() => setInspectingItem(null)}
                item={inspectingItem}
                imageFit={imageFit}
                onToggleFit={() => setImageFit(prev => prev === 'cover' ? 'contain' : 'cover')}
                showFilenames={showFilenames}
                onToggleFilenames={() => setShowFilenames(!showFilenames)}
                showResolution={showResolution}
                onToggleResolution={() => setShowResolution(!showResolution)}
            />

            <BulkUploadDialog
                isOpen={!!bulkPreview}
                onClose={() => setBulkPreview(null)}
                analysis={bulkPreview}
                onConfirm={() => {
                    if (bulkPreview && bulkPreview.matches.length > 0) {
                        applyBulkMatches(bulkPreview.matches);
                    }
                }}
            />

            <ExportDialog
                isOpen={isExportDialogOpen}
                onClose={() => setIsExportDialogOpen(false)}
                onConfirm={performExport}
                dataset={dataset}
            />
        </Layout>
    );
}

export default App;
