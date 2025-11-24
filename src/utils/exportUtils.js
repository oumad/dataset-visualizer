import JSZip from 'jszip';

export async function generateDatasetZip(dataset, datasetName = "dataset") {
    const zip = new JSZip();

    // Create folders
    const targetFolder = zip.folder(`${datasetName}_target`);
    const control1Folder = zip.folder(`${datasetName}_control1`);
    const control2Folder = zip.folder(`${datasetName}_control2`);
    const control3Folder = zip.folder(`${datasetName}_control3`);

    // Helper to pad numbers (01, 02, etc.)
    const pad = (num) => String(num).padStart(2, '0');

    // Helper to safely read file
    const readFileSafely = async (file) => {
        try {
            return await file.arrayBuffer();
        } catch (error) {
            console.error(`Error reading file ${file.name}:`, error);
            return null;
        }
    };

    // Process all items
    await Promise.all(dataset.map(async (item, index) => {
        const fileName = `${pad(index + 1)}`;
        const ext = item.target.file.name.split('.').pop();
        const fullFileName = `${fileName}.${ext}`;

        // Add target image
        const targetData = await readFileSafely(item.target.file);
        if (targetData) {
            targetFolder.file(fullFileName, targetData);
        } else {
            targetFolder.file(`${fileName}_ERROR.txt`, `Failed to read target file: ${item.target.file.name}`);
        }

        // Add control images
        const controlFolders = [control1Folder, control2Folder, control3Folder];

        await Promise.all(item.controls.map(async (control, cIndex) => {
            if (cIndex < 3) {
                const cExt = control.file.name.split('.').pop();
                const controlData = await readFileSafely(control.file);

                if (controlData) {
                    controlFolders[cIndex].file(`${fileName}.${cExt}`, controlData);
                } else {
                    controlFolders[cIndex].file(`${fileName}_ERROR.txt`, `Failed to read control file: ${control.file.name}`);
                }
            }
        }));
    }));

    return await zip.generateAsync({ type: "blob" });
}
