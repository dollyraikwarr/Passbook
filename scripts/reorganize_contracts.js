import fs from 'fs';
import path from 'path';

const passbookDir = 'c:\\Users\\rohit\\Documents\\New project\\Passbook';
const oldContractDir = path.join(passbookDir, 'contract');
const newContractsDir = path.join(passbookDir, 'contracts', 'treasury');

if (fs.existsSync(oldContractDir)) {
  if (!fs.existsSync(newContractsDir)) {
    fs.mkdirSync(newContractsDir, { recursive: true });
  }
  
  // Copy files
  fs.cpSync(oldContractDir, newContractsDir, { recursive: true });
  fs.rmSync(oldContractDir, { recursive: true, force: true });
  console.log('Reorganized contract/ -> contracts/treasury/');
}

// Create top level Cargo.toml in contracts if needed
const rootCargo = path.join(passbookDir, 'Cargo.toml');
if (!fs.existsSync(rootCargo)) {
  fs.writeFileSync(rootCargo, `[workspace]\nmembers = [\n  "contracts/treasury",\n]\nresolver = "2"\n`, 'utf8');
  console.log('Created root workspace Cargo.toml');
}

console.log('✅ Contracts folder restructured successfully!');
