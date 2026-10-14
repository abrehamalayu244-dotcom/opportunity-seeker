import { saveProfile, loadProfile } from './storage.js';

// =========================================================
// STATE
// =========================================================
const state = {
  fullName: '',
  email: '',
  country: '',
  educationLevel: '',
  fieldOfStudy: '',
  institution: '',
  graduationYear: '',
  status: 'Enrolled',
  skills: [],
  interests: [],
  goals: [],
  preferredTypes: [],
  preferredLocations: [],
  workMode: [],
  experienceLevel: '',
  hoursPerWeek: 10
};

// =========================================================
// DOM
// =========================================================
const form          = document.getElementById('profile-form');
const saveStatus    = document.getElementById('saveStatus');
const cancelBtn     = document.getElementById('cancelBtn');
const hoursInput    = document.getElementById('hoursPerWeek');
const hoursSlider   = document.getElementById('hoursSlider');

// =========================================================
// TAG INPUTS (Skills / Interests / Goals)
// =========================================================
function renderTags(containerId, values, key) {
  const container = document.getElementById(containerId);
  container.innerHTML = values.map(v => `
    <span class="tag">
      ${escapeHtml(v)}
      <button type="button" class="tag-x" data-remove="${escapeHtml(v)}">×</button>
    </span>
  `).join('');

  container.querySelectorAll('.tag-x').forEach(btn => {
    btn.addEventListener('click', () => {
      const value = btn.dataset.remove;
      state[key] = state[key].filter(v => v !== value);
      renderTags(containerId, state[key], key);
      scheduleAutoSave();
    });
  });
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

function setupTagInput(wrapperSelector, key, containerId) {
  const wrapper = document.querySelector(wrapperSelector);
  const input = wrapper.querySelector('.tag-field');

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const value = input.value.trim();
      if (!value) return;
      if (!state[key].includes(value)) {
        state[key].push(value);
        renderTags(containerId, state[key], key);
        scheduleAutoSave();
      }
      input.value = '';
    }
    // Backspace removes last tag when input is empty
    if (e.key === 'Backspace' && input.value === '' && state[key].length) {
      state[key].pop();
      renderTags(containerId, state[key], key);
      scheduleAutoSave();
    }
  });

  // Also commit on blur
  input.addEventListener('blur', () => {
    const value = input.value.trim();
    if (!value) return;
    if (!state[key].includes(value)) {
      state[key].push(value);
      renderTags(containerId, state[key], key);
      scheduleAutoSave();
    }
    input.value = '';
  });
}

setupTagInput('[data-tag-input="skills"]',    'skills',    'skillsList');
setupTagInput('[data-tag-input="interests"]', 'interests', 'interestsList');
setupTagInput('[data-tag-input="goals"]',     'goals',     'goalsList');

// =========================================================
// PILL TOGGLES (Preferences)
// =========================================================
document.querySelectorAll('.pill-group').forEach(group => {
  const key = group.dataset.pillGroup;

  group.querySelectorAll('.pill-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const value = btn.dataset.value;
      const isActive = btn.classList.contains('active');

      if (isActive) {
        btn.classList.remove('active');
        state[key] = state[key].filter(v => v !== value);
      } else {
        btn.classList.add('active');
        if (!state[key].includes(value)) state[key].push(value);
      }

      scheduleAutoSave();
    });
  });
});

// =========================================================
// SIMPLE FIELDS (inputs / selects / radios)
// =========================================================
function bindField(id, key) {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('input', () => {
    state[key] = el.value;
    scheduleAutoSave();
  });
}

bindField('fullName',        'fullName');
bindField('email',           'email');
bindField('country',         'country');
bindField('educationLevel',  'educationLevel');
bindField('fieldOfStudy',    'fieldOfStudy');
bindField('institution',     'institution');
bindField('graduationYear',  'graduationYear');
bindField('experienceLevel', 'experienceLevel');

// Status radios
document.querySelectorAll('input[name="status"]').forEach(radio => {
  radio.addEventListener('change', () => {
    state.status = radio.value;
    scheduleAutoSave();
  });
});

// =========================================================
// HOURS (number + slider sync)
// =========================================================
hoursInput.addEventListener('input', () => {
  let val = Number(hoursInput.value);
  if (isNaN(val)) val = 0;
  val = Math.max(0, Math.min(40, val));
  hoursSlider.value = val;
  state.hoursPerWeek = val;
  scheduleAutoSave();
});

hoursSlider.addEventListener('input', () => {
  hoursInput.value = hoursSlider.value;
  state.hoursPerWeek = Number(hoursSlider.value);
  scheduleAutoSave();
});

// =========================================================
// AUTO-SAVE (debounced)
// =========================================================
let autoSaveTimer = null;

function scheduleAutoSave() {
  clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(() => {
    saveProfile(state);
    showSavedIndicator();
  }, 800);
}

function showSavedIndicator() {
  saveStatus.textContent = '✓ Auto-saved just now';
  saveStatus.classList.add('is-saved');
  setTimeout(() => {
    saveStatus.textContent = '';
    saveStatus.classList.remove('is-saved');
  }, 2500);
}

// =========================================================
// FORM SUBMIT (manual save)
// =========================================================
form.addEventListener('submit', (e) => {
  e.preventDefault();
  saveProfile(state);
  showSavedIndicator();
  // Optional: redirect to For You
  // window.location.href = 'for-you.html';
});

// =========================================================
// CANCEL
// =========================================================
cancelBtn.addEventListener('click', () => {
  if (confirm('Discard changes and go back?')) {
    window.location.href = '../index.html';
  }
});

// =========================================================
// LOAD EXISTING PROFILE
// =========================================================
function hydrateForm(profile) {
  if (!profile) return;

  Object.keys(profile).forEach(key => {
    if (key in state) state[key] = profile[key];
  });

  // Simple fields
  document.getElementById('fullName').value        = state.fullName;
  document.getElementById('email').value           = state.email;
  document.getElementById('country').value         = state.country;
  document.getElementById('educationLevel').value  = state.educationLevel;
  document.getElementById('fieldOfStudy').value    = state.fieldOfStudy;
  document.getElementById('institution').value     = state.institution;
  document.getElementById('graduationYear').value  = state.graduationYear;
  document.getElementById('experienceLevel').value = state.experienceLevel;

  // Hours
  hoursInput.value  = state.hoursPerWeek;
  hoursSlider.value = state.hoursPerWeek;

  // Status radio
  const statusRadio = document.querySelector(`input[name="status"][value="${state.status}"]`);
  if (statusRadio) statusRadio.checked = true;

  // Tags
  renderTags('skillsList',    state.skills,    'skills');
  renderTags('interestsList', state.interests, 'interests');
  renderTags('goalsList',     state.goals,     'goals');

  // Pills
  document.querySelectorAll('.pill-group').forEach(group => {
    const key = group.dataset.pillGroup;
    group.querySelectorAll('.pill-toggle').forEach(btn => {
      if (state[key].includes(btn.dataset.value)) {
        btn.classList.add('active');
      }
    });
  });
}

hydrateForm(loadProfile());