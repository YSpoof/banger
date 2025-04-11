import { type SearchProvider, searchProviders } from './searchProviders';

// Storage utility
const storageUtil = {
  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get<T>(key: string) {
    const value = localStorage.getItem(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  },
};

// State
let customProviders: SearchProvider[] = [];
let defaultBang: SearchProvider = getDefaultBang();

// DOM Elements
const setupUrlEl = document.getElementById('setup-url') as HTMLElement;
const demoVideoEl = document.getElementById('demo-video') as HTMLVideoElement;
const providersListEl = document.getElementById(
  'providers-list'
) as HTMLUListElement;
const showModalBtn = document.getElementById(
  'show-modal-btn'
) as HTMLButtonElement;
const modal = document.getElementById(
  'custom-provider-modal'
) as HTMLDialogElement;
const providerNameInput = document.getElementById(
  'providerName'
) as HTMLInputElement;
const providerBangInput = document.getElementById(
  'providerBang'
) as HTMLInputElement;
const providerUrlInput = document.getElementById(
  'providerUrl'
) as HTMLInputElement;
const testProviderBtn = document.getElementById(
  'test-provider-btn'
) as HTMLButtonElement;
const addProviderBtn = document.getElementById(
  'add-provider-btn'
) as HTMLButtonElement;
const closeModalBtn = document.getElementById(
  'close-modal-btn'
) as HTMLButtonElement;
const loadingEl = document.getElementById('loading') as HTMLDivElement;
const mainEl = document.getElementById('main') as HTMLElement;

// Initialize app
function init() {
  loadCustomProviders();
  doRedirect();
  renderProvidersList();
  setupEventListeners();
  removeLoadingScreen();
}

// Event Listeners
function setupEventListeners() {
  setupUrlEl.addEventListener('click', copySetupUrl);
  demoVideoEl.addEventListener('click', (event) => {
    (event.target as HTMLVideoElement).play();
  });
  showModalBtn.addEventListener('click', showModal);
  testProviderBtn.addEventListener('click', testCustomProvider);
  addProviderBtn.addEventListener('click', addCustomProvider);
  closeModalBtn.addEventListener('click', closeModal);
}

// Methods
function copySetupUrl(event: Event) {
  event.preventDefault();
  let target = event.target as HTMLElement;
  navigator.clipboard.writeText(target?.innerText);
  alert('URL copiada para a área de transferência!');
}

function getBangUrlRedirect(): string | null {
  const url = new URL(window.location.href);
  const query = url.searchParams.get('q')?.trim() ?? '';
  if (!query) {
    return null;
  }

  const match = query.match(/!(\S+)/i);
  const bang = match?.[1]?.toLowerCase();

  if (bang === 'cfg') {
    caches.delete('banger');
    return null;
  }

  const combinedProviders = [...searchProviders, ...customProviders];
  const realBang =
    combinedProviders.find((provider) => provider.bang === bang) ?? defaultBang;
  const cleanQuery = query.replace(/!\S+\s*/i, '').trim();

  // If there's no search query after the bang, redirect to the provider's homepage
  if (!cleanQuery) {
    const baseUrl = realBang.url.slice(0, realBang.url.indexOf('/', 8));
    return baseUrl;
  }

  const redirectUrl = realBang.url.replace('{{ placeholder }}', cleanQuery);
  return redirectUrl || null;
}

function getDefaultBang(): SearchProvider {
  const defaultProvider: SearchProvider = {
    name: 'Google',
    bang: 'gg',
    url: 'https://www.google.com/search?q={{ placeholder }}',
  };

  const fromLS = storageUtil.get<SearchProvider>('defaultBang');
  if (fromLS) {
    return fromLS;
  } else {
    storageUtil.set('defaultBang', defaultProvider);
  }
  return defaultProvider;
}

function changeDefaultBang(provider: SearchProvider) {
  storageUtil.set('defaultBang', provider);
  defaultBang = provider;
  renderProvidersList();
}

function isDefaultBang(provider: SearchProvider): boolean {
  return provider.bang === defaultBang.bang;
}

function doRedirect(): void {
  const redirectUrl = getBangUrlRedirect();
  if (redirectUrl) {
    window.location.href = redirectUrl;
  }
}

function removeCustomProvider(provider: SearchProvider) {
  if (!confirm(`Deseja realmente remover o provedor ${provider.name}?`)) return;

  customProviders = customProviders.filter((p) => p.bang !== provider.bang);
  storageUtil.set('customProviders', customProviders);
  console.log(`Custom provider removed: ${provider.name}`);
  renderProvidersList();
}

function addCustomProvider() {
  const name = providerNameInput.value.trim();
  const bang = providerBangInput.value.toLowerCase().replace('!', '').trim();
  const url = providerUrlInput.value.trim();

  if (!validateUrl(url)) {
    alert('URL inválida. Por favor, verifique o formato da URL.');
    return;
  }

  if (checkIfBangExists(bang)) {
    alert('Essa Bang já está em uso. Por favor, escolha outra.');
    return;
  }

  if (name && bang && url) {
    const newProvider: SearchProvider = { name, bang, url };
    customProviders = [...customProviders, newProvider];
    storageUtil.set('customProviders', customProviders);
    console.log(`Custom provider added: ${newProvider.name}`);
    closeModal();
    renderProvidersList();
  } else {
    alert('Por favor, preencha todos os campos: nome, bang e URL.');
  }
}

function checkIfBangExists(bang: string): boolean {
  const combinedProviders = [...searchProviders, ...customProviders];
  return combinedProviders.some((provider) => provider.bang === bang);
}

function testCustomProvider() {
  const url = providerUrlInput.value.trim();

  if (!validateUrl(url)) {
    alert('URL inválida. Por favor, verifique o formato da URL.');
    return;
  }

  window.open(url.replace('{{ placeholder }}', 'Banger LZArt'), '_blank');
}

function showModal() {
  modal.showModal();
}

function closeModal() {
  modal.close();
  // Reset form values
  providerNameInput.value = '';
  providerBangInput.value = '';
  providerUrlInput.value = '';
}

function isCustomProvider(provider: SearchProvider): boolean {
  return !searchProviders.some((p) => p.bang === provider.bang);
}

function loadCustomProviders() {
  const loaded = storageUtil.get<SearchProvider[]>('customProviders') || [];
  customProviders = loaded;
  loaded.forEach((provider: SearchProvider) => {
    console.log(`Custom provider loaded: ${provider.name}`);
  });
}

function validateUrl(url: string): boolean {
  try {
    if (!url.includes('{{ placeholder }}')) return false;
    new URL(url.replace('{{ placeholder }}', 'test'));
    return true;
  } catch (error) {
    return false;
  }
}

// Rendering functions
function renderProvidersList() {
  const combinedProviders = [...searchProviders, ...customProviders];
  providersListEl.innerHTML = '';

  if (combinedProviders.length === 0) {
    providersListEl.innerHTML =
      '<li style="padding: 0.5rem">Nenhum provedor de busca encontrado.</li>';
    return;
  }

  combinedProviders.forEach((provider) => {
    const li = document.createElement('li');
    li.style.padding = '0.5rem';
    li.style.marginBottom = '0.25rem';
    li.style.cursor = 'pointer';
    li.style.display = 'flex';
    li.style.alignItems = 'center';
    li.style.backgroundColor = '#f5f5f5';
    li.style.borderRadius = '4px';

    li.innerHTML = `
      <code style="font-family: monospace">
        !<span style="color: #d14; font-weight: bold">${provider.bang}</span>:${
      provider.name
    }
      </code>
      <span style="margin-left: 0.5rem; font-size: 0.85rem; color: ${
        isDefaultBang(provider) ? '#2c9f35' : '#666'
      }">
        ${
          isDefaultBang(provider)
            ? '(padrão)'
            : '(clique para definir como padrão)'
        }
      </span>
    `;

    if (isCustomProvider(provider)) {
      const removeButton = document.createElement('button');
      removeButton.textContent = 'X';
      removeButton.style.marginLeft = 'auto';
      removeButton.style.border = 'none';
      removeButton.style.background = '#ff5252';
      removeButton.style.color = 'white';
      removeButton.style.width = '20px';
      removeButton.style.height = '20px';
      removeButton.style.borderRadius = '50%';
      removeButton.style.cursor = 'pointer';
      removeButton.style.fontSize = '12px';
      removeButton.style.lineHeight = '1';
      removeButton.title = `Remover ${provider.bang}`;

      removeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        removeCustomProvider(provider);
      });

      li.appendChild(removeButton);
    }

    li.addEventListener('click', () => changeDefaultBang(provider));
    providersListEl.appendChild(li);
  });
}

// Remove loading screen
function removeLoadingScreen() {
  if (loadingEl) {
    loadingEl.remove();
    mainEl.style.display = 'block';
  }
}

init();
