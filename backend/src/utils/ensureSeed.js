import SiteSettings from '../models/SiteSettings.js';
import Doctor from '../models/Doctor.js';
import { runSeed } from '../seed/index.js';

/**
 * If the database has no settings/doctors, run seed once.
 * Useful for in-memory MongoDB and fresh installs.
 */
export async function ensureSeed() {
  const [settingsCount, doctorCount] = await Promise.all([
    SiteSettings.countDocuments(),
    Doctor.countDocuments(),
  ]);

  if (settingsCount > 0 || doctorCount > 0) return false;

  console.log('Empty database detected — running seed…');
  await runSeed({ connect: false });
  return true;
}

export default ensureSeed;
