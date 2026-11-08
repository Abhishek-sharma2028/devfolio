const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section-snap');
const reveals = document.querySelectorAll('.reveal');
const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('.mobile-menu');
const themeToggle = document.querySelector('.theme-toggle');
const cinema = document.querySelector('.project-cinema');
const cinemaTrack = document.querySelector('.cinema-track');
const cinemaProgress = document.querySelector('.cinema-progress i b');
const cinemaNumber = document.querySelector('.progress-number');
const personDemo = document.querySelector('.person-demo');
const exploreSection = document.querySelector('#explore');
const typePicker = document.querySelector('.type-picker');
const typeCards = document.querySelectorAll('.type-card');
const builderModal = document.querySelector('.builder-modal');
const builderForm = document.querySelector('#builder-form');
const peopleRoster = document.querySelector('.roster-grid');
const profileModal = document.querySelector('#profile-modal');
const profileModalPhoto = document.querySelector('#profile-modal-photo');
const profileModalTitle = document.querySelector('#profile-modal-title');
const profileModalPronouns = document.querySelector('#profile-modal-pronouns');
const profileModalRole = document.querySelector('#profile-modal-role');
const profileModalBio = document.querySelector('#profile-modal-bio');
const profileModalAbout = document.querySelector('#profile-modal-about');
const profileModalSkills = document.querySelector('#profile-modal-skills');
const profileModalLevel = document.querySelector('#profile-modal-level');
const profileModalYears = document.querySelector('#profile-modal-years');
const profileModalRating = document.querySelector('#profile-modal-rating');
const profileModalProjects = document.querySelector('#profile-modal-projects');
const profileModalStatus = document.querySelector('#profile-modal-status');
const profileModalAchievements = document.querySelector('#profile-modal-achievements');
const profileModalExperience = document.querySelector('#profile-modal-experience');
const profileModalLinks = document.querySelector('#profile-modal-links');
const profileModalShowreel = document.querySelector('#profile-modal-showreel');
const projectModal = document.querySelector('#project-modal');
const projectModalHero = document.querySelector('#project-modal-hero');
const projectModalTitle = document.querySelector('#project-modal-title');
const projectModalLabel = document.querySelector('#project-modal-label');
const projectModalRating = document.querySelector('#project-modal-rating');
const projectModalLikes = document.querySelector('#project-modal-likes');
const projectModalSummary = document.querySelector('#project-modal-summary');
const projectModalRole = document.querySelector('#project-modal-role');
const projectModalStack = document.querySelector('#project-modal-stack');
const projectModalYear = document.querySelector('#project-modal-year');
const projectModalImpact = document.querySelector('#project-modal-impact');
const projectModalStory = document.querySelector('#project-modal-story');
const projectModalHighlights = document.querySelector('#project-modal-highlights');
const projectModalLink = document.querySelector('#project-modal-link');
const loginModal = document.querySelector('#login');
const loginForm = document.querySelector('#login-form');
const loginStatus = document.querySelector('.login-status');
const connectDemo = document.querySelector('#connect-demo');
const googleSignIn = document.querySelector('#google-signin');
const googleButtonContainer = document.querySelector('#google-button-container');
const portfolioModal = document.querySelector('#portfolio-modal');
const portfolioStages = document.querySelectorAll('[data-portfolio-stage]');
const portfolioStageArt = document.querySelector('#portfolio-stage-art');
const portfolioTitle = document.querySelector('#portfolio-title');
const portfolioIntro = document.querySelector('#portfolio-intro');
const portfolioRole = document.querySelector('#portfolio-role');
const portfolioLocation = document.querySelector('#portfolio-location');
const portfolioTimeline = document.querySelector('#portfolio-timeline');
const portfolioWorkReel = document.querySelector('#portfolio-work-reel');
const portfolioVideoPreview = document.querySelector('#portfolio-video-preview');
const portfolioAchievements = document.querySelector('#portfolio-achievements');
const portfolioContactLinks = document.querySelector('#portfolio-contact-links');
const portfolioStepLabel = document.querySelector('#portfolio-step-label');
const portfolioStepProgress = document.querySelector('#portfolio-step-progress');
const portfolioPrev = document.querySelector('#portfolio-prev');
const portfolioNext = document.querySelector('#portfolio-next');
const portfolioDots = document.querySelector('#portfolio-dots');
const portfolioScrollHint = document.querySelector('#portfolio-scroll-hint');
const themeSelect = builderForm?.querySelector('[name="theme"]');
const themeSwatches = document.querySelectorAll('[data-theme-choice]');
let activePortfolioCard = null;
let portfolioStep = 0;
let portfolioNavMode = 'button';
let portfolioTouchStartY = null;
let portfolioWheelLocked = false;
const PROFILE_STORAGE_KEY = 'devfolio-profiles-v1';
const ACCOUNT_STORAGE_KEY = 'devfolio-account-v1';
const GOOGLE_CLIENT_ID = document.body.dataset.googleClientId || '';

const projectData = {
  'campus-connect': { label: 'CASE STUDY / 01', title: 'Campus Connect', rating: '4.9', likes: '312 appreciations', summary: 'A social map for finding your people on campus, designed around the first hello and built for the long haul.', role: 'Product design + full-stack', stack: 'React · Django · Mapbox', year: '2024', impact: '2.4k student sign-ups', story: 'Students were joining clubs, hackathons, and study groups across disconnected channels. Campus Connect turns that fragmented experience into a warm, searchable map where shared interests become an invitation.', highlights: ['Interest-based discovery and map experience', 'Realtime project calls and team matching', 'Accessible onboarding tested with 18 students'], image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=90', link: 'https://github.com/' },
  pulse: { label: 'CASE STUDY / 02', title: 'Pulse', rating: '4.8', likes: '486 appreciations', summary: 'A calmer way to focus, with ambient sessions and tiny rituals that make deep work easier to return to.', role: 'Product design + frontend', stack: 'Next.js · Node.js · Web Audio', year: '2024', impact: '38% longer focus sessions', story: 'Pulse started as a personal experiment after noticing how many productivity tools made focus feel like a performance. The product uses atmosphere, gentle feedback, and small rituals to make meaningful work feel inviting.', highlights: ['Ambient focus rooms with adaptive sound', 'Session analytics without guilt-driven streaks', 'Motion system designed around breathing rhythm'], image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=90', link: 'https://github.com/' },
  'open-notes': { label: 'CASE STUDY / 03', title: 'Open Notes', rating: '4.7', likes: '274 appreciations', summary: 'A search-first notebook that turns scattered class notes into a living, shared knowledge base.', role: 'Research + AI engineering', stack: 'Python · NLP · PostgreSQL', year: '2023', impact: '12k notes indexed', story: 'Open Notes makes studying collaborative instead of solitary. Semantic search connects concepts across classes, while lightweight sharing helps students teach one another without rebuilding the same notes.', highlights: ['Semantic search across messy student notes', 'Citation-aware AI summaries', 'Permission model for classes and study groups'], image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1600&q=90', link: 'https://github.com/' },
  'soft-systems': { label: 'CASE STUDY / 04', title: 'Soft Systems', rating: '4.6', likes: '193 appreciations', summary: 'A visual AI experiment exploring how mood, color, and composition can become searchable creative inputs.', role: 'Creative coding + research', stack: 'Python · OpenCV · Figma', year: '2024', impact: '1.8k moodboards made', story: 'Soft Systems turns the emotional qualities of an image into a playful search language. It was built as an exploration of how machine learning can support taste without flattening it.', highlights: ['Mood embeddings for visual references', 'Generative palette and composition tools', 'Exportable moodboard system for teams'], image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=90', link: 'https://github.com/' },
  'good-things': { label: 'CASE STUDY / 05', title: 'Good Things Take Time', rating: '4.9', likes: '402 appreciations', summary: 'An editorial identity system for slow, thoughtful products and the people who make them.', role: 'Art direction + brand design', stack: 'Figma · After Effects · Type', year: '2023', impact: 'Featured in 6 publications', story: 'This identity argues that slowness is not a weakness. The system combines expressive typography, tactile motion, and a flexible visual language that makes patience feel exciting.', highlights: ['Responsive typographic identity', 'Motion principles for product launches', 'Editorial toolkit for a distributed team'], image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1600&q=90', link: 'https://github.com/' }
};

if (personDemo && exploreSection) exploreSection.parentNode.insertBefore(personDemo, exploreSection);
if (typePicker && personDemo) personDemo.parentNode.insertBefore(typePicker, personDemo);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });
reveals.forEach((element) => revealObserver.observe(element));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-40% 0px -50% 0px' });
sections.forEach((section) => sectionObserver.observe(section));

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

menuButton.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.filter-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.filter-tab').forEach((item) => item.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    document.querySelectorAll('.project-card').forEach((card) => {
      card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
    });
  });
});

const projectSortButton = document.querySelector('.filter-sort');
projectSortButton?.addEventListener('click', () => {
  const grid = document.querySelector('.project-grid');
  if (!grid) return;
  const cards = [...grid.querySelectorAll('.project-card')];
  const descending = projectSortButton.dataset.sort !== 'recent';
  cards.reverse().forEach((card) => grid.appendChild(card));
  projectSortButton.dataset.sort = descending ? 'recent' : 'loved';
  projectSortButton.innerHTML = `${descending ? 'Most recent' : 'Most loved'} <span>⌄</span>`;
});

document.querySelectorAll('.heart-button').forEach((button) => {
  button.addEventListener('click', (event) => {
    event.stopPropagation();
    button.classList.toggle('liked');
    button.textContent = button.classList.contains('liked') ? '♥' : '♡';
  });
  document.querySelector('.collab-like')?.addEventListener('click', (event) => {
    event.stopPropagation();
    const button = event.currentTarget;
    button.classList.toggle('liked');
    button.textContent = button.classList.contains('liked') ? '♥' : '♡';
    showToast(button.classList.contains('liked') ? 'Collaboration saved' : 'Collaboration removed');
  });
  document.querySelector('.activity-range')?.addEventListener('click', (event) => {
    const options = ['Last 7 days⌄', 'Last 30 days⌄', 'Last 90 days⌄'];
    const current = options.indexOf(event.currentTarget.textContent);
    event.currentTarget.textContent = options[(current + 1) % options.length];
  });
});

function updateCinema() {
  if (!cinema || window.innerWidth <= 850) return;
  const bounds = cinema.getBoundingClientRect();
  const travel = cinema.offsetHeight - window.innerHeight;
  const progress = Math.min(1, Math.max(0, -bounds.top / travel));
  const scene = Math.min(2, Math.floor(progress * 3));
  cinemaTrack.style.transform = `translateX(-${scene * 33.3333}%)`;
  cinemaProgress.style.width = `${Math.max(33, progress * 100)}%`;
  cinemaNumber.textContent = String(scene + 1).padStart(2, '0');
}
function closePortfolio() {
  if (!portfolioModal) return;
  portfolioModal.classList.remove('open');
  portfolioModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}
function applyPortfolioStyle(card) {
  const theme = card?.dataset.profileTheme || 'aurora';
  const motion = card?.dataset.profileMotion || 'cinematic';
  const navModes = {
    aurora: 'button',
    editorial: 'scroll',
    midnight: 'button',
    sherbet: 'scroll',
    monochrome: 'button',
    cyber: 'video',
    clay: 'video',
    paper: 'scroll'
  };
  portfolioNavMode = navModes[theme] || 'button';
  document.body.dataset.portfolioTheme = theme;
  document.body.dataset.portfolioMotion = motion;
  portfolioModal.dataset.navigation = portfolioNavMode;
  portfolioModal.dataset.theme = theme;
  if (themeSelect) themeSelect.value = theme;
  themeSwatches.forEach((swatch) => swatch.classList.toggle('active', swatch.dataset.themeChoice === theme));
}
function encodePortfolio(data) {
  const json = JSON.stringify(data);
  return btoa(unescape(encodeURIComponent(json))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function decodePortfolio(value) {
  try {
    const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((value.length + 3) % 4);
    return JSON.parse(decodeURIComponent(escape(atob(padded))));
  } catch {
    return null;
  }
}
function serializeProfile(card) {
  const profile = {};
  Object.keys(card.dataset).filter((key) => key.startsWith('profile')).forEach((key) => {
    profile[key] = card.dataset[key];
  });
  const photo = card.querySelector('.person-card-photo');
  profile.photoBackground = photo ? getComputedStyle(photo).backgroundImage : '';
  profile.initials = photo?.textContent.trim() || '';
  return profile;
}
function createSharedProfileCard(profile) {
  const card = document.createElement('article');
  card.className = 'person-card person-card-link shared-profile-card';
  Object.entries(profile).filter(([key]) => key.startsWith('profile')).forEach(([key, value]) => {
    card.dataset[key] = value;
  });
  const photo = document.createElement('div');
  photo.className = 'person-card-photo';
  photo.textContent = profile.initials || '';
  if (profile.photoBackground) photo.style.backgroundImage = profile.photoBackground;
  card.appendChild(photo);
  const info = document.createElement('div');
  info.className = 'person-card-info';
  const skills = String(profile.profileSkills || '').split(',').map((item) => item.trim()).filter(Boolean).slice(0, 3);
  info.innerHTML = `<span>${String(profile.profileRole || 'CREATIVE BUILDER').toUpperCase().replace(/[<>]/g, '')}</span><h3>${String(profile.profileName || 'Your portfolio').replace(/[<>]/g, '')}</h3><p>${String(profile.profileBio || '').replace(/[<>]/g, '')}</p><div>${skills.map((skill) => `<b>${skill.replace(/[<>]/g, '')}</b>`).join('')}</div><small class="view-profile">Open portfolio ↗</small>`;
  card.appendChild(info);
  return card;
}
function addProfileCardActions(card) {
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.addEventListener('click', () => openPortfolio(card));
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openPortfolio(card);
    }
  });
  if (!card.classList.contains('newly-added')) return;
  const actions = document.createElement('div');
  actions.className = 'profile-card-actions';
  const linkButton = document.createElement('button');
  linkButton.type = 'button';
  linkButton.textContent = 'Copy recruiter link';
  linkButton.addEventListener('click', (event) => {
    event.stopPropagation();
    copyPortfolioLink(card);
  });
  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'profile-delete-button';
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', (event) => {
    event.stopPropagation();
    deletePortfolio(card);
  });
  actions.append(linkButton, deleteButton);
  card.appendChild(actions);
}
function saveProfiles() {
  const seen = new Set();
  const profiles = [...document.querySelectorAll('.newly-added.person-card-link')].map(serializeProfile).filter((profile) => {
    const key = `${profile.profileName}|${profile.profileEmail}|${profile.profileRole}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profiles));
}
function deletePortfolio(card) {
  const name = card.dataset.profileName || 'this';
  if (!window.confirm(`Delete ${name}'s portfolio from this browser?`)) return;
  if (activePortfolioCard === card) closePortfolio();
  card.remove();
  saveProfiles();
  showToast(`${name} portfolio deleted`);
}
function restoreProfiles() {
  let profiles = [];
  try {
    profiles = JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY) || '[]');
  } catch {
    profiles = [];
  }
  const seen = new Set();
  profiles.filter((profile) => profile?.profileName).forEach((profile) => {
    const key = `${profile.profileName}|${profile.profileEmail}|${profile.profileRole}`;
    if (seen.has(key)) return;
    seen.add(key);
    const card = createSharedProfileCard(profile);
    card.classList.add('newly-added');
    peopleRoster?.insertBefore(card, peopleRoster.querySelector('.add-person-card'));
    addProfileCardActions(card);
  });
  if (profiles.length) saveProfiles();
}
async function copyPortfolioLink(card) {
  const url = publicPortfolioUrl(card);
  try {
    await navigator.clipboard.writeText(url);
    showToast('Recruiter link copied');
  } catch {
    window.prompt('Copy this recruiter portfolio link', url);
  }
}
function publicPortfolioUrl(card) {
  return `${window.location.origin}${window.location.pathname}#portfolio=${encodePortfolio(serializeProfile(card))}`;
}
function getVideoEmbedUrl(value) {
  if (!value) return '';
  try {
    const url = new URL(value);
    if (url.hostname.includes('youtube.com')) {
      const id = url.searchParams.get('v');
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&modestbranding=1` : '';
    }
    if (url.hostname === 'youtu.be') {
      const id = url.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&modestbranding=1` : '';
    }
    if (url.hostname.includes('vimeo.com')) {
      const id = url.pathname.split('/').filter(Boolean).pop();
      return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}?autoplay=1&muted=1&background=1` : '';
    }
  } catch {
    return '';
  }
  return '';
}
function renderVideoPreview(data) {
  if (!portfolioVideoPreview) return;
  portfolioVideoPreview.innerHTML = '';
  const embedUrl = getVideoEmbedUrl(data.profileVideo || data.profileProjectVideo);
  if (embedUrl) {
    const iframe = document.createElement('iframe');
    iframe.src = embedUrl;
    iframe.title = `${data.profileName || 'Portfolio'} video preview`;
    iframe.allow = 'autoplay; fullscreen';
    iframe.setAttribute('loading', 'lazy');
    portfolioVideoPreview.appendChild(iframe);
  } else {
    portfolioVideoPreview.style.backgroundImage = `linear-gradient(135deg,rgba(16,24,20,.05),rgba(16,20,18,.65)),url('${projectData.pulse.image}')`;
    const label = document.createElement('span');
    label.textContent = 'Add a YouTube or Vimeo URL to activate video preview';
    portfolioVideoPreview.appendChild(label);
  }
}
function setPortfolioStep(step) {
  portfolioStep = Math.max(0, Math.min(4, step));
  portfolioStages.forEach((stage) => stage.classList.toggle('active', Number(stage.dataset.portfolioStage) === portfolioStep));
  portfolioStepLabel.textContent = `${String(portfolioStep + 1).padStart(2, '0')} / 05`;
  portfolioStepProgress.style.width = `${((portfolioStep + 1) / 5) * 100}%`;
  portfolioDots?.querySelectorAll('button').forEach((dot, index) => dot.classList.toggle('active', index === portfolioStep));
  portfolioPrev.disabled = portfolioStep === 0;
  const nextLabels = {
    aurora: 'Reveal next <span>→</span>',
    midnight: 'Enter next <span>↗</span>',
    monochrome: 'Continue <span>+</span>',
    editorial: 'Scroll onward <span>↓</span>',
    sherbet: 'Keep going <span>✦</span>',
    cyber: 'Launch next <span>↗</span>',
    clay: 'Turn the page <span>→</span>',
    paper: 'Read on <span>↓</span>'
  };
  portfolioNext.innerHTML = portfolioStep === 4 ? 'Close portfolio <span>×</span>' : (nextLabels[portfolioModal.dataset.theme] || 'Next chapter <span>→</span>');
  portfolioNext.hidden = portfolioNavMode === 'scroll';
  portfolioPrev.hidden = portfolioNavMode === 'scroll';
  portfolioDots.hidden = portfolioNavMode === 'scroll';
  portfolioScrollHint.hidden = portfolioNavMode !== 'scroll';
}
function openPortfolio(card) {
  if (!portfolioModal) return;
  activePortfolioCard = card;
  applyPortfolioStyle(card);
  const data = card.dataset;
  const nameParts = (data.profileName || 'Your portfolio').split(' ');
  portfolioTitle.innerHTML = `${nameParts[0]}<br /><em>${nameParts.slice(1).join(' ') || 'story'}.</em>`;
  portfolioIntro.textContent = data.profileBio || 'I turn curious ideas into useful, expressive work.';
  portfolioRole.textContent = data.profileRole || 'Creative builder';
  portfolioLocation.textContent = data.profileAvailability || 'Available for work';
  portfolioStageArt.style.backgroundImage = getComputedStyle(card.querySelector('.person-card-photo')).backgroundImage;
  renderVideoPreview(data);
  const experience = (data.profileExperience || 'Started building in public — today').split('\n').map((item) => item.trim()).filter(Boolean);
  portfolioTimeline.innerHTML = experience.map((item, index) => `<div class="journey-item"><span>0${index + 1}</span><div><strong>${item}</strong><p>${index === 0 ? 'The first spark became a direction.' : 'A new chapter, a sharper point of view.'}</p></div></div>`).join('');
  const workKeys = ['pulse', 'campus-connect', 'open-notes'];
  portfolioWorkReel.innerHTML = workKeys.map((key, index) => {
    const project = projectData[key];
    return `<article class="portfolio-work-card" style="--work-image:url('${project.image}')"><span>0${index + 1}</span><div><small>${project.role}</small><h3>${project.title}</h3><button type="button" data-portfolio-project="${key}">View work ↗</button></div></article>`;
  }).join('');
  portfolioAchievements.innerHTML = (data.profileAchievements || 'Building in public and learning every week.').split('\n').map((item) => item.trim()).filter(Boolean).map((item) => `<li>${item}</li>`).join('');
  portfolioContactLinks.innerHTML = '';
  [['Email', data.profileEmail ? `mailto:${data.profileEmail}` : ''], ['Website', data.profileWebsite], ['Resume', data.profileResume], ['Watch intro', data.profileVideo]].forEach(([label, href]) => {
    if (!href) return;
    const link = document.createElement('a');
    link.href = href;
    link.target = href.startsWith('mailto:') ? '_self' : '_blank';
    link.rel = 'noreferrer';
    link.textContent = `${label} ↗`;
    portfolioContactLinks.appendChild(link);
  });
  const share = document.createElement('button');
  share.type = 'button';
  share.className = 'portfolio-share-link';
  share.textContent = 'Copy recruiter link ↗';
  share.addEventListener('click', () => copyPortfolioLink(card));
  portfolioContactLinks.appendChild(share);
  portfolioModal.classList.add('open');
  portfolioModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  setPortfolioStep(0);
}
function updatePersonParallax() {
  if (!personDemo || window.innerWidth <= 850) return;
  const bounds = personDemo.getBoundingClientRect();
  const progress = Math.min(1, Math.max(0, (window.innerHeight - bounds.top) / (window.innerHeight + personDemo.offsetHeight)));
  personDemo.style.setProperty('--person-shift', `${(progress - .5) * 70}px`);
}
window.addEventListener('scroll', updateCinema, { passive: true });
window.addEventListener('scroll', updatePersonParallax, { passive: true });
window.addEventListener('resize', updateCinema);
window.addEventListener('resize', updatePersonParallax);
updateCinema();
updatePersonParallax();

typeCards.forEach((card, index) => {
  card.addEventListener('click', () => {
    typeCards.forEach((item) => item.classList.remove('active'));
    card.classList.add('active');
    typePicker.classList.remove('type-cinema-theme', 'type-minimal-theme', 'type-playful-theme');
    if (card.dataset.type !== 'editorial') typePicker.classList.add(`type-${card.dataset.type}-theme`);
    const progress = typePicker.querySelector('.picker-footer i b');
    if (progress) progress.style.width = `${(index + 1) * 25}%`;
  });
});

function closeBuilder() {
  if (!builderModal) return;
  builderModal.classList.remove('open');
  builderModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}
function closeProfile() {
  if (!profileModal) return;
  profileModal.classList.remove('open');
  profileModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}
function closeProject() {
  if (!projectModal) return;
  projectModal.classList.remove('open');
  projectModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}
function closeLogin() {
  if (!loginModal) return;
  loginModal.classList.remove('open');
  loginModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}
function openLogin() {
  if (!loginModal) return;
  loginModal.classList.add('open');
  loginModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  loginModal.querySelector('input')?.focus();
  loadGoogleIdentityServices();
}
function showToast(message) {
  let toast = document.querySelector('.app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'app-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove('show'), 2200);
}
function decodeGoogleCredential(credential) {
    try {
      const payload = credential.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(decodeURIComponent(escape(atob(payload))));
    } catch {
      return null;
    }
}
function finishGoogleSignIn(response) {
    const profile = decodeGoogleCredential(response.credential);
    if (!profile?.email) {
      loginStatus.textContent = 'Google returned an invalid identity response.';
      loginStatus.classList.remove('success');
      return;
    }
    localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify({
      provider: 'google',
      email: profile.email,
      name: profile.name || '',
      picture: profile.picture || '',
      signedInAt: new Date().toISOString()
    }));
    loginStatus.textContent = `Signed in with Google as ${profile.name || profile.email}.`;
    loginStatus.classList.add('success');
    document.querySelector('.login-link').textContent = 'Account';
    showToast('Google account connected');
    setTimeout(() => {
      closeLogin();
      builderModal.classList.add('open');
      builderModal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      builderModal.querySelector('input')?.focus();
    }, 700);
}
function loadGoogleIdentityServices() {
    if (!GOOGLE_CLIENT_ID) {
      loginStatus.textContent = 'Add your Google OAuth Web client ID to enable Google sign-in.';
      loginStatus.classList.remove('success');
      return;
    }
    const initializeGoogle = () => {
      if (!window.google?.accounts?.id || !googleButtonContainer) {
        loginStatus.textContent = 'Google sign-in is unavailable in this browser.';
        return;
      }
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: finishGoogleSignIn,
        ux_mode: 'popup',
        auto_select: false,
        cancel_on_tap_outside: true
      });
      if (!googleButtonContainer.childElementCount) {
        window.google.accounts.id.renderButton(googleButtonContainer, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          width: Math.min(390, Math.max(240, googleButtonContainer.parentElement?.clientWidth || 320))
        });
      }
    };
    if (window.google?.accounts?.id) {
      initializeGoogle();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;
    script.onerror = () => {
      loginStatus.textContent = 'Google sign-in could not load. Check your connection and try again.';
      loginStatus.classList.remove('success');
    };
    document.head.appendChild(script);
}
function openProject(projectId) {
  const project = projectData[projectId];
  if (!project || !projectModal) return;
  projectModalLabel.textContent = project.label;
  projectModalTitle.textContent = project.title;
  projectModalRating.textContent = project.rating;
  projectModalLikes.textContent = project.likes;
  projectModalSummary.textContent = project.summary;
  projectModalRole.textContent = project.role;
  projectModalStack.textContent = project.stack;
  projectModalYear.textContent = project.year;
  projectModalImpact.textContent = project.impact;
  projectModalStory.textContent = project.story;
  projectModalHighlights.innerHTML = '';
  project.highlights.forEach((highlight) => {
    const item = document.createElement('li');
    item.textContent = highlight;
    projectModalHighlights.appendChild(item);
  });
  projectModalHero.style.backgroundImage = `linear-gradient(135deg,rgba(16,24,20,.1),rgba(16,20,18,.72)),url('${project.image}')`;
  projectModalLink.href = project.link;
  projectModal.classList.add('open');
  projectModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

document.querySelectorAll('.project-card-link, .scene-case-study').forEach((item) => {
  item.addEventListener('click', (event) => {
    event.stopPropagation();
    openProject(item.dataset.projectId);
  });
  item.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openProject(item.dataset.projectId);
    }
  });
});
document.querySelectorAll('[data-close-project]').forEach((trigger) => trigger.addEventListener('click', closeProject));
document.querySelectorAll('.open-login').forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    openLogin();
  });
});
document.querySelectorAll('[data-close-login]').forEach((trigger) => trigger.addEventListener('click', closeLogin));
document.querySelectorAll('[data-close-portfolio]').forEach((trigger) => trigger.addEventListener('click', closePortfolio));
portfolioPrev?.addEventListener('click', () => setPortfolioStep(portfolioStep - 1));
portfolioNext?.addEventListener('click', () => portfolioStep === 4 ? closePortfolio() : setPortfolioStep(portfolioStep + 1));
portfolioDots?.querySelectorAll('button').forEach((dot) => dot.addEventListener('click', () => setPortfolioStep(Number(dot.dataset.portfolioJump))));
portfolioWorkReel?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-portfolio-project]');
  if (!button) return;
  closePortfolio();
  openProject(button.dataset.portfolioProject);
});
function movePortfolioBy(delta) {
  if (!portfolioModal?.classList.contains('open')) return;
  setPortfolioStep(portfolioStep + delta);
}
portfolioModal?.addEventListener('wheel', (event) => {
  if (portfolioNavMode !== 'scroll' || portfolioWheelLocked) return;
  if (Math.abs(event.deltaY) < 18) return;
  event.preventDefault();
  portfolioWheelLocked = true;
  movePortfolioBy(event.deltaY > 0 ? 1 : -1);
  window.setTimeout(() => { portfolioWheelLocked = false; }, 700);
}, { passive: false });
portfolioModal?.addEventListener('touchstart', (event) => {
  if (portfolioNavMode !== 'scroll') return;
  portfolioTouchStartY = event.changedTouches[0].clientY;
}, { passive: true });
portfolioModal?.addEventListener('touchend', (event) => {
  if (portfolioNavMode !== 'scroll' || portfolioTouchStartY === null) return;
  const distance = portfolioTouchStartY - event.changedTouches[0].clientY;
  if (Math.abs(distance) > 45) movePortfolioBy(distance > 0 ? 1 : -1);
  portfolioTouchStartY = null;
}, { passive: true });
loginForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = String(new FormData(loginForm).get('email')).trim();
  localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify({ email, signedInAt: new Date().toISOString() }));
  loginStatus.textContent = `Signed in as ${email}. Your portfolio workspace is ready.`;
  loginStatus.classList.add('success');
  document.querySelector('.login-link').textContent = 'Account';
  setTimeout(closeLogin, 700);
  showToast('Welcome back to Devfolio');
});
connectDemo?.addEventListener('click', () => {
  const email = 'creator@devfolio.local';
  localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify({ email, signedInAt: new Date().toISOString() }));
  loginStatus.textContent = 'Local account connected. Opening your portfolio builder…';
  loginStatus.classList.add('success');
  closeLogin();
  builderModal.classList.add('open');
  builderModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  builderModal.querySelector('input')?.focus();
  showToast('Local account connected');
});
googleSignIn?.addEventListener('click', loadGoogleIdentityServices);

function openProfile(card) {
  profileModalTitle.textContent = card.dataset.profileName;
  profileModalPronouns.textContent = card.dataset.profilePronouns || '';
  profileModalPronouns.hidden = !card.dataset.profilePronouns;
  profileModalRole.textContent = card.dataset.profileRole;
  profileModalBio.textContent = card.dataset.profileBio;
  profileModalAbout.textContent = card.dataset.profileAbout || card.dataset.profileBio || '';
  profileModalSkills.innerHTML = card.dataset.profileSkills.split(',').map((skill) => `<span>${skill.trim()}</span>`).join('');
  profileModalLevel.textContent = card.dataset.profileSkillLevel || 'Building skills in public';
  profileModalYears.textContent = `${card.dataset.profileYears || '—'} years of making and learning`;
  profileModalRating.textContent = card.dataset.profileRating || '4.8';
  profileModalProjects.textContent = card.dataset.profileProjects || '12';
  profileModalStatus.textContent = card.dataset.profileAvailability || 'Available';
  profileModalExperience.innerHTML = '';
  (card.dataset.profileExperience || 'Open to meaningful work and collaborations.').split('\n').map((item) => item.trim()).filter(Boolean).slice(0, 6).forEach((line) => {
    const item = document.createElement('li');
    item.textContent = line;
    profileModalExperience.appendChild(item);
  });
  profileModalAchievements.innerHTML = '';
  (card.dataset.profileAchievements || 'Building in public and learning every week.').split('\n').map((item) => item.trim()).filter(Boolean).slice(0, 4).forEach((achievement) => {
    const item = document.createElement('li');
    item.textContent = achievement;
    profileModalAchievements.appendChild(item);
  });
  profileModalLinks.innerHTML = '';
  [
    ['Email', card.dataset.profileEmail ? `mailto:${card.dataset.profileEmail}` : ''],
    ['Website', card.dataset.profileWebsite],
    ['Resume / CV', card.dataset.profileResume]
  ].forEach(([label, href]) => {
    if (!href) return;
    const link = document.createElement('a');
    link.href = href;
    link.target = href.startsWith('mailto:') ? '_self' : '_blank';
    link.rel = 'noreferrer';
    link.textContent = `${label} ↗`;
    profileModalLinks.appendChild(link);
  });
  (card.dataset.profileSocials || '').split(',').map((item) => item.trim()).filter(Boolean).forEach((href, index) => {
    const link = document.createElement('a');
    link.href = href;
    link.target = '_blank';
    link.rel = 'noreferrer';
    link.textContent = `Social ${index + 1} ↗`;
    profileModalLinks.appendChild(link);
  });
  profileModalShowreel.innerHTML = '';
  [
    ['Watch intro video', card.dataset.profileVideo],
    ['Watch featured project', card.dataset.profileProjectVideo]
  ].forEach(([label, href]) => {
    if (!href) return;
    const link = document.createElement('a');
    link.href = href;
    link.target = '_blank';
    link.rel = 'noreferrer';
    link.textContent = `${label} ▶`;
    profileModalShowreel.appendChild(link);
  });
  const cardPhoto = card.querySelector('.person-card-photo');
  profileModalPhoto.textContent = cardPhoto.textContent.trim();
  profileModalPhoto.style.backgroundImage = getComputedStyle(cardPhoto).backgroundImage;
  profileModal.classList.add('open');
  profileModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

document.querySelectorAll('.person-card-link').forEach((card) => {
  addProfileCardActions(card);
});
document.querySelectorAll('[data-close-profile]').forEach((trigger) => trigger.addEventListener('click', closeProfile));

document.querySelectorAll('.open-builder').forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    builderModal.classList.add('open');
    builderModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    builderModal.querySelector('input')?.focus();
  });
});
document.querySelectorAll('[data-close-builder]').forEach((trigger) => trigger.addEventListener('click', closeBuilder));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeBuilder();
  if (event.key === 'Escape') closeProfile();
  if (event.key === 'Escape') closeProject();
  if (event.key === 'Escape') closeLogin();
  if (event.key === 'Escape') closePortfolio();
});

builderForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(builderForm);
  const name = String(data.get('name')).trim();
  const role = String(data.get('role')).trim();
  const bio = String(data.get('bio')).trim();
  const photo = String(data.get('photo')).trim();
  const skills = String(data.get('skills')).split(',').map((skill) => skill.trim()).filter(Boolean).slice(0, 8);
  const initials = name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  const card = document.createElement('article');
  card.className = 'person-card newly-added';
  card.classList.add('person-card-link');
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.dataset.profileName = name;
  card.dataset.profileRole = role;
  card.dataset.profileBio = bio;
  card.dataset.profileSkills = skills.join(', ');
  card.dataset.profilePronouns = String(data.get('pronouns') || '');
  card.dataset.profileAvailability = String(data.get('availability') || '');
  card.dataset.profileRating = String(data.get('rating') || '');
  card.dataset.profileProjects = String(data.get('projectCount') || '');
  card.dataset.profileAchievements = String(data.get('achievements') || '');
  card.dataset.profileAbout = String(data.get('about') || '');
  card.dataset.profileSkillLevel = String(data.get('skillLevel') || '');
  card.dataset.profileYears = String(data.get('years') || '');
  card.dataset.profileExperience = String(data.get('experience') || '');
  card.dataset.profileVideo = String(data.get('video') || '');
  card.dataset.profileProjectVideo = String(data.get('projectVideo') || '');
  card.dataset.profileEmail = String(data.get('email') || '');
  card.dataset.profileWebsite = String(data.get('website') || '');
  card.dataset.profileResume = String(data.get('resume') || '');
  card.dataset.profileSocials = String(data.get('socials') || '');
  card.dataset.profileTheme = String(data.get('theme') || 'aurora');
  card.dataset.profileMotion = String(data.get('motion') || 'cinematic');
  const photoStyle = photo ? `style="background-image:linear-gradient(#0002,#0004),url('${photo.replace(/'/g, '%27')}')"` : '';
  const safeRole = role.replace(/[<>]/g, '');
  card.innerHTML = `<div class="person-card-photo" ${photoStyle}>${photo ? '' : initials}</div><div class="person-card-info"><span>${safeRole.toUpperCase()}</span><h3>${name.replace(/[<>]/g, '')}</h3><p>${bio.replace(/[<>]/g, '')}</p><div>${skills.map((skill) => `<b>${skill.replace(/[<>]/g, '')}</b>`).join('')}</div><small class="view-profile">Open profile ↗</small></div>`;
  peopleRoster?.insertBefore(card, peopleRoster.querySelector('.add-person-card'));
  document.body.dataset.portfolioTheme = String(data.get('theme') || 'aurora');
  document.body.dataset.portfolioMotion = String(data.get('motion') || 'cinematic');
  addProfileCardActions(card);
  saveProfiles();
  builderForm.reset();
  const status = builderModal.querySelector('.builder-status');
  if (status) status.textContent = `${name} is ready. Your recruiter link is available in the portfolio film.`;
  setTimeout(() => {
    closeBuilder();
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    openPortfolio(card);
  }, 650);
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('warm-mode');
  themeToggle.querySelector('.sun-icon').textContent = document.body.classList.contains('warm-mode') ? '☾' : '☼';
});

themeSelect?.addEventListener('change', () => {
  document.body.dataset.portfolioTheme = themeSelect.value;
  themeSwatches.forEach((swatch) => swatch.classList.toggle('active', swatch.dataset.themeChoice === themeSelect.value));
});
themeSwatches.forEach((swatch) => {
  swatch.addEventListener('click', () => {
    if (themeSelect) themeSelect.value = swatch.dataset.themeChoice;
    document.body.dataset.portfolioTheme = swatch.dataset.themeChoice;
    themeSwatches.forEach((item) => item.classList.toggle('active', item === swatch));
  });

});

restoreProfiles();
try {
  const account = JSON.parse(localStorage.getItem(ACCOUNT_STORAGE_KEY) || 'null');
  if (account?.email) document.querySelector('.login-link').textContent = 'Account';
} catch {
  localStorage.removeItem(ACCOUNT_STORAGE_KEY);
}

const sharedPortfolio = new URLSearchParams(window.location.hash.slice(1)).get('portfolio');
if (sharedPortfolio) {
  const sharedProfile = decodePortfolio(sharedPortfolio);
  if (sharedProfile?.profileName) {
    window.setTimeout(() => openPortfolio(createSharedProfileCard(sharedProfile)), 180);
  }
}

let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
  const velocity = Math.max(-1, Math.min(1, (window.scrollY - lastScrollY) / 35));
  document.documentElement.style.setProperty('--scroll-velocity', velocity.toFixed(2));
  lastScrollY = window.scrollY;
}, { passive: true });
