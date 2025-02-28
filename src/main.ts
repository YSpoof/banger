import { type SearchProvider, searchProviders } from './searchProviders';
import { template } from './template';

// State
const state = {
  customProviders: [] as SearchProvider[],
  defaultBang: {} as SearchProvider,
};

// DOM element cache - Lazy loading with getters
const elements = {
  get setupUrl() {
    return document.getElementById('setup-url') as HTMLElement;
  },
  get demoVideo() {
    return document.getElementById('demo-video') as HTMLVideoElement;
  },
  get providersList() {
    return document.getElementById('providers-list') as HTMLUListElement;
  },
  get showModalBtn() {
    return document.getElementById('show-modal-btn') as HTMLButtonElement;
  },
  get modal() {
    return document.getElementById(
      'custom-provider-modal'
    ) as HTMLDialogElement;
  },
  get providerName() {
    return document.getElementById('providerName') as HTMLInputElement;
  },
  get providerBang() {
    return document.getElementById('providerBang') as HTMLInputElement;
  },
  get providerUrl() {
    return document.getElementById('providerUrl') as HTMLInputElement;
  },
  get testProviderBtn() {
    return document.getElementById('test-provider-btn') as HTMLButtonElement;
  },
  get addProviderBtn() {
    return document.getElementById('add-provider-btn') as HTMLButtonElement;
  },
  get closeModalBtn() {
    return document.getElementById('close-modal-btn') as HTMLButtonElement;
  },
  get main() {
    return document.getElementById('main') as HTMLElement;
  },
};

// Initialize app
function init() {
  loadCustomProviders();
  state.defaultBang = getDefaultBang();
  doRedirect();
}

// Load UI
function loadUi() {
  drawAppTemplate();
  renderProvidersList();
  setupEventListeners();
}

// Event Listeners - With event delegation
function setupEventListeners() {
  // Prevent creating multiple event listeners for the same elements
  elements.setupUrl.addEventListener('click', copySetupUrl);

  // Use passive event listeners for better performance
  elements.demoVideo.addEventListener(
    'click',
    (event) => {
      (event.target as HTMLVideoElement).play();
    },
    { passive: true }
  );

  elements.showModalBtn.addEventListener('click', showModal, { passive: true });
  elements.testProviderBtn.addEventListener('click', testCustomProvider, {
    passive: true,
  });
  elements.addProviderBtn.addEventListener('click', addCustomProvider, {
    passive: true,
  });
  elements.closeModalBtn.addEventListener('click', closeModal, {
    passive: true,
  });
}

// Methods
function copySetupUrl(event: Event) {
  event.preventDefault();
  let target = event.target as HTMLElement;
  navigator.clipboard.writeText(target?.innerText);
  showNotification('URL copiada para a área de transferência!');
}

function getBangUrlRedirect(): string | null {
  const url = new URL(window.location.href);
  const query = url.searchParams.get('q')?.trim();

  if (!query) {
    loadUi();
    return null;
  }

  // Pattern matching
  const bangMatch = /!(\S+)/i.exec(query);
  const bang = bangMatch?.[1]?.toLowerCase();

  if (bang === 'cfg') {
    caches.delete('banger');
    loadUi();
    return null;
  }

  // Map for O(1) lookups instead of O(n)
  const providerMap = new Map(
    [...searchProviders, ...state.customProviders].map((provider) => [
      provider.bang,
      provider,
    ])
  );

  const realBang = providerMap.get(bang || '') || state.defaultBang;
  const cleanQuery = query.replace(/!\S+\s*/i, '').trim();

  // If there's no search query after the bang, redirect to the provider's homepage
  if (!cleanQuery) {
    const urlEndIndex = realBang.url.indexOf('/', 8);
    return urlEndIndex > -1 ? realBang.url.slice(0, urlEndIndex) : realBang.url;
  }

  return realBang.url.replace(
    '{{ placeholder }}',
    encodeURIComponent(cleanQuery)
  );
}

function getDefaultBang(): SearchProvider {
  const defaultProvider: SearchProvider = {
    name: 'Google',
    bang: 'gg',
    url: 'https://www.google.com/search?q={{ placeholder }}',
  };

  try {
    const fromLS = localStorage.getItem('defaultBang');
    if (fromLS) {
      return JSON.parse(fromLS) as SearchProvider;
    }
  } catch (e) {
    console.error('Failed to load default bang from localStorage:', e);
  }

  localStorage.setItem('defaultBang', JSON.stringify(defaultProvider));
  return defaultProvider;
}

function changeDefaultBang(provider: SearchProvider) {
  try {
    localStorage.setItem('defaultBang', JSON.stringify(provider));
    state.defaultBang = provider;
    renderProvidersList();
  } catch (e) {
    console.error('Failed to set default bang:', e);
  }
}

function doRedirect(): void {
  const redirectUrl = getBangUrlRedirect();
  if (redirectUrl) {
    window.location.replace(redirectUrl);
  }
}

function removeCustomProvider(provider: SearchProvider) {
  if (!confirm(`Deseja realmente remover o provedor ${provider.name}?`)) return;

  state.customProviders = state.customProviders.filter(
    (p) => p.bang !== provider.bang
  );
  saveCustomProviders();
  console.log(`Custom provider removed: ${provider.name}`);
  renderProvidersList();
}

function addCustomProvider() {
  const name = elements.providerName.value.trim();
  const bang = elements.providerBang.value
    .toLowerCase()
    .replace('!', '')
    .trim();
  const url = elements.providerUrl.value.trim();

  if (!validateUrl(url)) {
    showNotification(
      'URL inválida. Por favor, verifique o formato da URL.',
      true
    );
    return;
  }

  if (checkIfBangExists(bang)) {
    showNotification(
      'Essa Bang já está em uso. Por favor, escolha outra.',
      true
    );
    return;
  }

  if (name && bang && url) {
    const newProvider: SearchProvider = { name, bang, url };
    state.customProviders = [...state.customProviders, newProvider];
    saveCustomProviders();
    console.log(`Custom provider added: ${newProvider.name}`);
    closeModal();
    renderProvidersList();
  } else {
    showNotification(
      'Por favor, preencha todos os campos: nome, bang e URL.',
      true
    );
  }
}

// Set for faster lookups
let bangCache: Set<string> | null = null;
function checkIfBangExists(bang: string): boolean {
  if (!bangCache) {
    bangCache = new Set([
      ...searchProviders.map((p) => p.bang),
      ...state.customProviders.map((p) => p.bang),
    ]);
  }
  return bangCache.has(bang);
}

function testCustomProvider() {
  const url = elements.providerUrl.value.trim();

  if (!validateUrl(url)) {
    showNotification(
      'URL inválida. Por favor, verifique o formato da URL.',
      true
    );
    return;
  }

  window.open(url.replace('{{ placeholder }}', 'Banger LZArt'), '_blank');
}

function showModal() {
  elements.modal.showModal();
}

function closeModal() {
  elements.modal.close();
  // Reset form values
  elements.providerName.value = '';
  elements.providerBang.value = '';
  elements.providerUrl.value = '';
}

function loadCustomProviders() {
  try {
    const loaded = localStorage.getItem('customProviders');
    state.customProviders = loaded ? JSON.parse(loaded) : [];
  } catch (e) {
    console.error('Failed to load custom providers:', e);
    state.customProviders = [];
  }
}

// Memoization
function saveCustomProviders(): void {
  try {
    localStorage.setItem(
      'customProviders',
      JSON.stringify(state.customProviders)
    );
  } catch (e) {
    console.error('Failed to save custom providers:', e);
  }
}

function validateUrl(url: string): boolean {
  if (!url.includes('{{ placeholder }}')) return false;

  try {
    new URL(url.replace('{{ placeholder }}', 'test'));
    return true;
  } catch (error) {
    return false;
  }
}

// Alerts with less intrusive notifications
function showNotification(message: string, isError = false): void {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed; bottom: 20px; right: 20px; padding: 10px 20px;
    background-color: ${isError ? '#ff5252' : '#4caf50'}; color: white;
    border-radius: 4px; z-index: 1000; box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  `;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.5s';
    setTimeout(() => document.body.removeChild(notification), 500);
  }, 3000);
}

// Rendering functions
function renderProvidersList() {
  // Clear the cache whenever the provider list changes
  bangCache = null;

  const combinedProviders = [...searchProviders, ...state.customProviders];
  elements.providersList.innerHTML = '';

  if (combinedProviders.length === 0) {
    elements.providersList.innerHTML =
      '<li style="padding: 0.5rem">Nenhum provedor de busca encontrado.</li>';
    return;
  }

  // DocumentFragment for batch DOM updates
  const fragment = document.createDocumentFragment();

  // Precompute isDefault status to avoid repeated function calls
  const defaultBangId = state.defaultBang.bang;

  combinedProviders.forEach((provider) => {
    const li = document.createElement('li');
    const isDefault = provider.bang === defaultBangId;
    const isCustom = !searchProviders.some((p) => p.bang === provider.bang);

    li.style.cssText =
      'padding: 0.5rem; margin-bottom: 0.25rem; cursor: pointer; display: flex; align-items: center; background-color: #f5f5f5; border-radius: 4px;';

    li.innerHTML = `
      <code style="font-family: monospace">
        !<span style="color: #d14; font-weight: bold">${provider.bang}</span>:${
      provider.name
    }
      </code>
      <span style="margin-left: 0.5rem; font-size: 0.85rem; color: ${
        isDefault ? '#2c9f35' : '#666'
      }">
        ${isDefault ? '(padrão)' : '(clique para definir como padrão)'}
      </span>
    `;

    if (isCustom) {
      const removeButton = document.createElement('button');
      removeButton.textContent = 'X';
      removeButton.style.cssText =
        'margin-left: auto; border: none; background: #ff5252; color: white; width: 20px; height: 20px; border-radius: 50%; cursor: pointer; font-size: 12px; line-height: 1;';
      removeButton.title = `Remover ${provider.bang}`;

      removeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        removeCustomProvider(provider);
      });

      li.appendChild(removeButton);
    }

    li.addEventListener('click', () => changeDefaultBang(provider));
    fragment.appendChild(li);
  });

  elements.providersList.appendChild(fragment);
}

// Draw main app
function drawAppTemplate() {
  elements.main.innerHTML = template;
}

init();
