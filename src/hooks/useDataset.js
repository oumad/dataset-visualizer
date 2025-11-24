import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function useDataset() {
    const [dataset, setDataset] = useState([]);

    // Cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            dataset.forEach(item => {
                URL.revokeObjectURL(item.target.preview);
                item.controls.forEach(c => URL.revokeObjectURL(c.preview));
            });
        };
    }, []);

    const addTargets = useCallback((files) => {
        const newItems = files.map(file => ({
            id: uuidv4(),
            target: {
                file,
                name: file.name,
                preview: URL.createObjectURL(file)
            },
            controls: []
        }));

        setDataset(prev => [...prev, ...newItems]);
    }, []);

    const removeTarget = useCallback((id) => {
        setDataset(prev => {
            const item = prev.find(i => i.id === id);
            if (item) {
                URL.revokeObjectURL(item.target.preview);
                item.controls.forEach(c => URL.revokeObjectURL(c.preview));
            }
            return prev.filter(i => i.id !== id);
        });
    }, []);

    const addControl = useCallback((targetId, files) => {
        setDataset(prev => prev.map(item => {
            if (item.id !== targetId) return item;

            const remainingSlots = 3 - item.controls.length;
            const filesToAdd = files.slice(0, remainingSlots);

            const newControls = filesToAdd.map(file => ({
                id: uuidv4(),
                file,
                name: file.name,
                preview: URL.createObjectURL(file)
            }));

            return {
                ...item,
                controls: [...item.controls, ...newControls]
            };
        }));
    }, []);

    const removeControl = useCallback((targetId, controlId) => {
        setDataset(prev => prev.map(item => {
            if (item.id !== targetId) return item;

            const controlToRemove = item.controls.find(c => c.id === controlId);
            if (controlToRemove) {
                URL.revokeObjectURL(controlToRemove.preview);
            }

            return {
                ...item,
                controls: item.controls.filter(c => c.id !== controlId)
            };
        }));
    }, []);

    const analyzeBulkUpload = useCallback((files) => {
        const matches = [];
        const unmatched = [];

        // Helper to check if a target is already full (considering pending matches)
        const getPendingCount = (targetId) => matches.filter(m => m.targetId === targetId).length;

        files.forEach(file => {
            const fileNameNoExt = file.name.substring(0, file.name.lastIndexOf('.'));

            // Find target with matching name
            const target = dataset.find(item => {
                const targetNameNoExt = item.target.name.substring(0, item.target.name.lastIndexOf('.'));
                return targetNameNoExt === fileNameNoExt;
            });

            if (target) {
                // Check if there is space (current controls + pending matches)
                const currentCount = target.controls.length;
                const pendingCount = getPendingCount(target.id);

                if (currentCount + pendingCount < 3) {
                    matches.push({
                        targetId: target.id,
                        targetName: target.target.name,
                        file,
                        controlName: file.name
                    });
                } else {
                    unmatched.push(file.name);
                }
            } else {
                unmatched.push(file.name);
            }
        });

        return { matches, unmatched, total: files.length };
    }, [dataset]);

    const applyBulkMatches = useCallback((matches) => {
        setDataset(prev => {
            const newDataset = prev.map(item => ({
                ...item,
                controls: [...item.controls]
            }));

            matches.forEach(match => {
                const targetIndex = newDataset.findIndex(i => i.id === match.targetId);
                if (targetIndex !== -1) {
                    newDataset[targetIndex].controls.push({
                        id: uuidv4(),
                        file: match.file,
                        name: match.controlName,
                        preview: URL.createObjectURL(match.file)
                    });
                }
            });

            return newDataset;
        });
    }, []);

    const replaceTarget = useCallback((id, file) => {
        setDataset(prev => {
            const itemIndex = prev.findIndex(i => i.id === id);
            if (itemIndex === -1) return prev;

            const newItem = { ...prev[itemIndex] };

            URL.revokeObjectURL(newItem.target.preview);

            newItem.target = {
                file,
                name: file.name,
                preview: URL.createObjectURL(file)
            };

            const newDataset = [...prev];
            newDataset[itemIndex] = newItem;
            return newDataset;
        });
    }, []);

    return {
        dataset,
        addTargets,
        removeTarget,
        addControl,
        removeControl,
        removeControl,
        analyzeBulkUpload,
        applyBulkMatches,
        replaceTarget
    };
}
