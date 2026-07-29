import fs from 'fs';
import path from 'path';

const passbookDir = 'c:\\Users\\rohit\\Documents\\New project\\Passbook';
const legacyHtmlFiles = [
  'dashboard-empty.html',
  'dashboard.html',
  'invite-accept.html',
  'onboarding.html',
  'public-page.html',
  'states.html'
];

legacyHtmlFiles.forEach((file) => {
  const filePath = path.join(passbookDir, file);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`Deleted legacy HTML file: ${file}`);
  }
});

console.log('✅ Only index.html remains as the single Vite mount shell!');
