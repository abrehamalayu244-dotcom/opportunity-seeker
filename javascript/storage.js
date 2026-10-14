// Browser persistence for the V1 profile, saved opportunities, and theme.
const PROFILE_KEY = 'opportunity_seeker_profile';
const SAVED_KEY = 'opportunity_seeker_saved_v1';
const THEME_KEY = 'opportunity_seeker_theme';

function readJson(key, fallback) {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; }
  catch (error) { console.warn(`Could not read ${key}`, error); return fallback; }
}
function writeJson(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch (error) { console.warn(`Could not write ${key}`, error); return false; }
}
export function saveProfile(profile) { return writeJson(PROFILE_KEY, profile); }
export function loadProfile() { return readJson(PROFILE_KEY, null); }
export function clearProfile() { try { localStorage.removeItem(PROFILE_KEY); } catch {} }
export function hasProfile() { return loadProfile() !== null; }
export function getSavedOpportunityIds() { const ids = readJson(SAVED_KEY, []); return Array.isArray(ids) ? ids : []; }
export function isOpportunitySaved(id) { return getSavedOpportunityIds().includes(Number(id)); }
export function toggleSavedOpportunity(id) {
  const ids = getSavedOpportunityIds(); const numberId = Number(id);
  const next = ids.includes(numberId) ? ids.filter(value => value !== numberId) : [...ids, numberId];
  writeJson(SAVED_KEY, next); return next.includes(numberId);
}
export function removeSavedOpportunity(id) { writeJson(SAVED_KEY, getSavedOpportunityIds().filter(value => value !== Number(id))); }
export function getTheme() { return readJson(THEME_KEY, 'dark') === 'light' ? 'light' : 'dark'; }
export function setTheme(theme) { try { localStorage.setItem(THEME_KEY, theme === 'light' ? 'light' : 'dark'); } catch {} }
