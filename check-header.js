import fs from 'fs';
try {
    const buf = fs.readFileSync('src-tauri/icons/icon.png');
    console.log('Header:', buf.subarray(0, 8).toString('hex'));
} catch (e) {
    console.error(e);
}
