import fs from 'fs';
import path from 'path';

const passbookDir = 'c:\\Users\\rohit\\Documents\\New project\\Passbook';

['Level 1', 'Level 2'].forEach((folder) => {
  const targetPath = path.join(passbookDir, folder);
  if (fs.existsSync(targetPath)) {
    fs.rmSync(targetPath, { recursive: true, force: true });
    console.log(`Removed legacy folder: ${folder}`);
  }
});

console.log('✅ Legacy level subfolders removed cleanly!');
