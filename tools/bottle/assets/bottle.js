const presetFlavours = [
  {
    name: "Storyboard",
    tone: "Cinematic",
    gradient: ["#38bdf8", "#c084fc"],
    prompt: "Storyboard-worthy still shot that showcases the core plot beat with dramatic lighting",
  },
  {
    name: "Product Focus",
    tone: "Clean",
    gradient: ["#34d399", "#0ea5e9"],
    prompt: "High fidelity packshot on neutral background with subtle volumetric lighting",
  },
  {
    name: "Moodboard",
    tone: "Atmospheric",
    gradient: ["#f472b6", "#fb7185"],
    prompt: "Lush reference sheet capturing vibe, palette, and texture cues for art direction",
  },
];

const tonePalette = {
  Cinematic: "#f97316",
  Clean: "#22d3ee",
  Atmospheric: "#a855f7",
  Playful: "#facc15",
  Experimental: "#38bdf8",
};

function createSavedBottleMarkup({ name, tone, guidance, highlights }) {
  return `
    <article class="saved-bottle">
      <strong>${name}</strong>
      <div class="tone-indicator"><span style="background:${tonePalette[tone] || '#38bdf8'}"></span>${tone}</div>
      <p>${guidance}</p>
      <p><em>${highlights}</em></p>
    </article>
  `;
}

function updatePreview({ name, tone, guidance, highlights }) {
  const title = document.querySelector('[data-preview-title]');
  const toneLabel = document.querySelector('[data-preview-tone]');
  const guidanceText = document.querySelector('[data-preview-guidance]');
  const highlightList = document.querySelector('[data-preview-highlights]');

  if (!title || !toneLabel || !guidanceText || !highlightList) return;

  title.textContent = name || 'Bottle blueprint';
  toneLabel.innerHTML = `<span style="background:${tonePalette[tone] || '#38bdf8'}"></span>${tone || 'Select a tone'}`;
  guidanceText.textContent = guidance || 'Describe what you would like Bottle to focus on and we will stitch the narrative beats together.';
  highlightList.textContent = highlights || 'Add supporting cues, moods, or references to steer the generation.';
}

function hydrateFlavours(container) {
  const fragment = document.createDocumentFragment();

  presetFlavours.forEach(({ name, tone, gradient, prompt }) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'button secondary';
    card.style.background = `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`;
    card.style.color = '#0f172a';
    card.dataset.prompt = prompt;
    card.dataset.tone = tone;
    card.textContent = name;
    card.addEventListener('click', () => {
      const promptField = document.querySelector('#bottle-guidance');
      const toneField = document.querySelector('#bottle-tone');
      if (promptField) promptField.value = prompt;
      if (toneField) toneField.value = tone;
      updatePreview({
        name: `${name} Bottle`,
        tone,
        guidance: prompt,
        highlights: document.querySelector('#bottle-highlights')?.value || '',
      });
    });
    fragment.appendChild(card);
  });

  container.innerHTML = '';
  container.appendChild(fragment);
}

function setupForm() {
  const form = document.querySelector('[data-bottle-form]');
  const savedContainer = document.querySelector('[data-saved-bottles]');
  const heroButton = document.querySelector('[data-open-creator]');

  if (!form || !savedContainer) return;

  const state = {
    saved: [],
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name').toString().trim() || 'Untitled Bottle';
    const tone = formData.get('tone').toString();
    const guidance = formData.get('guidance').toString().trim();
    const highlights = formData.get('highlights').toString().trim();

    updatePreview({ name, tone, guidance, highlights });

    state.saved.unshift({ name, tone, guidance, highlights });
    state.saved = state.saved.slice(0, 4);

    savedContainer.innerHTML = state.saved.map(createSavedBottleMarkup).join('');
    form.reset();
    form.querySelector('#bottle-name').focus();
  });

  heroButton?.addEventListener('click', () => {
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    form.querySelector('#bottle-name')?.focus({ preventScroll: true });
  });
}

function mountSparkles() {
  const sparkleTargets = document.querySelectorAll('[data-sparkle]');
  sparkleTargets.forEach((target) => {
    const first = document.createElement('span');
    first.className = 'sparkle one';
    const second = document.createElement('span');
    second.className = 'sparkle two';
    target.append(first, second);
  });
}

function initBottlePage() {
  hydrateFlavours(document.querySelector('[data-flavour-buttons]'));
  setupForm();
  mountSparkles();
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', initBottlePage)
  : initBottlePage();
