(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))d(o);new MutationObserver(o=>{for(const t of o)if(t.type==="childList")for(const l of t.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&d(l)}).observe(document,{childList:!0,subtree:!0});function n(o){const t={};return o.integrity&&(t.integrity=o.integrity),o.referrerPolicy&&(t.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?t.credentials="include":o.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function d(o){if(o.ep)return;o.ep=!0;const t=n(o);fetch(o.href,t)}})();const g=[{bang:"gg",name:"Google",url:"https://google.com/search?q={{ placeholder }}"},{bang:"dd",name:"DuckDuckGo",url:"https://duckduckgo.com/?q={{ placeholder }}"},{bang:"yt",name:"Youtube",url:"https://youtube.com/results?search_query={{ placeholder }}"},{bang:"ytm",name:"YouTube Music",url:"https://music.youtube.com/search?q={{ placeholder }}"},{bang:"gh",name:"Github",url:"https://github.com/search?q={{ placeholder }}"},{bang:"npm",name:"NPMJS",url:"https://npmjs.com/search?q={{ placeholder }}"},{bang:"mdn",name:"MDN Web Docs",url:"https://developer.mozilla.org/en-US/search?q={{ placeholder }}"},{bang:"so",name:"Stack Overflow",url:"https://stackoverflow.com/search?q={{ placeholder }}"},{bang:"wk",name:"Wikipedia",url:"https://pt.wikipedia.org/w/index.php?search={{ placeholder }}"},{bang:"rd",name:"Reddit",url:"https://reddit.com/search?q={{ placeholder }}"},{bang:"fb",name:"Facebook",url:"https://www.facebook.com/s.php?q={{ placeholder }}"},{bang:"tt",name:"Twitter",url:"https://twitter.com/search?q={{ placeholder }}"},{bang:"ct",name:"Comando Torrents",url:"https://comandotorrents.to/?s={{ placeholder }}"},{bang:"pt",name:"Pirate Torrents",url:"https://thepiratetorrents.org/?s={{ placeholder }}"},{bang:"igg",name:"IGG Games",url:"https://igg-games.com/?s={{ placeholder }}"},{bang:"pcg",name:"PCGames Torrents",url:"https://pcgamestorrents.com/?s={{ placeholder }}"}],x=`<div
      style="
        font-family: system-ui, -apple-system, sans-serif;
        max-width: 800px;
        margin: 0 auto;
        padding: 1rem;
        line-height: 1.5;
      "
    >
      <div>
        <h1 style="margin-bottom: 0.5rem">Banger</h1>
        <p>Essa ferramenta permite usar 'bangs' em qualquer navegador.</p>
        <p>
          Tutoriais para:
          <a
            target="_blank"
            href="https://support.google.com/chrome/answer/95426?hl=pt-BR&co=GENIE.Platform%3DDesktop&oco=1"
            style="color: #0066cc; text-decoration: none"
          >
            Chrome
          </a>
          ou
          <a
            target="_blank"
            href="https://support.mozilla.org/pt-PT/kb/adicionar-ou-remover-motores-de-pesquisa-firefox#w_adicionar-um-motor-de-pesquisa-a-partir-da-barra-da-pesquisa"
            style="color: #0066cc; text-decoration: none"
          >
            Firefox
          </a>
          .
        </p>
        <div
          style="
            background-color: #f5f5f5;
            padding: 1rem;
            border-radius: 4px;
            margin: 1rem 0;
          "
        >
          <p>
            Configure no seu navegador como motor de busca padrão a seguinte
            url:
          </p>
          <code
            id="setup-url"
            style="
              display: block;
              padding: 0.5rem;
              background: #e0e0e0;
              cursor: pointer;
              border-radius: 2px;
              font-family: monospace;
            "
            >https://banger.lzart.com.br?q=%s</code
          >
        </div>
        <p>Para usar, basta digitar na barra de busca ! e o 'bang' desejado.</p>
        <p>
          Exemplo:
          <code style="font-family: monospace"
            >!<span style="color: #d14; font-weight: bold">yt</span>
            Angular</code
          >
          irá pesquisar <code style="font-family: monospace">Angular</code> no
          <code style="font-family: monospace">YouTube</code>.
        </p>
        <p>Caso não seja passado nenhuma bang, será usado o motor padrão.</p>
        <p>Vídeo demonstrativo (clique para rodar)</p>
        <video
          id="demo-video"
          src="/demo.mp4"
          style="max-width: 100%; border-radius: 4px; cursor: pointer"
        ></video>
        <p>Essa é a velocidade real do Banger, o vídeo não está acelerado</p>
        <ul id="providers-list" style="list-style-type: none; padding: 0"></ul>
        <p
          style="background-color: #f0f0f0; padding: 0.5rem; border-radius: 4px"
        >
          Configure o banger usando
          <code style="font-family: monospace"
            >!<span style="color: #d14; font-weight: bold">cfg</span></code
          >
        </p>
      </div>
      <div style="margin-top: 1rem">
        <p>
          <button
            id="show-modal-btn"
            style="
              background-color: #0066cc;
              color: white;
              border: none;
              padding: 0.5rem 1rem;
              border-radius: 4px;
              cursor: pointer;
              width: 100%;
            "
          >
            Clique aqui para adicionar um provedor personalizado.
          </button>
        </p>
      </div>
      <dialog
        id="custom-provider-modal"
        style="
          border: none;
          border-radius: 8px;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          max-width: 500px;
          width: 100%;
        "
      >
        <h3 style="margin-top: 0; margin-bottom: 1rem">
          Adicionar provedor personalizado
        </h3>
        <div style="margin-bottom: 1rem">
          <label
            for="providerName"
            style="display: block; margin-bottom: 0.25rem; font-weight: bold"
            >Nome</label
          >
          <input
            type="text"
            name="providerName"
            id="providerName"
            placeholder="Exemplo: Meu Provider"
            style="
              width: 100%;
              padding: 0.5rem;
              border: 1px solid #ccc;
              border-radius: 4px;
            "
          />
        </div>
        <div style="margin-bottom: 1rem">
          <label
            for="providerBang"
            style="display: block; margin-bottom: 0.25rem; font-weight: bold"
            >Bang</label
          >
          <input
            type="text"
            name="providerBang"
            id="providerBang"
            placeholder="Exemplo: my"
            style="
              width: 100%;
              padding: 0.5rem;
              border: 1px solid #ccc;
              border-radius: 4px;
            "
          />
        </div>
        <div style="margin-bottom: 1.5rem">
          <label
            for="providerUrl"
            style="display: block; margin-bottom: 0.25rem; font-weight: bold"
          >
            URL ("{{ placeholder }}" é onde a pesquisa será inserida)
          </label>
          <input
            type="text"
            name="providerUrl"
            id="providerUrl"
            placeholder="https://mysearch.com?q={{ placeholder }}"
            style="
              width: 100%;
              padding: 0.5rem;
              border: 1px solid #ccc;
              border-radius: 4px;
            "
          />
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 0.5rem">
          <button
            id="test-provider-btn"
            style="
              padding: 0.5rem 1rem;
              background-color: #f0f0f0;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            "
          >
            Testar
          </button>
          <button
            id="add-provider-btn"
            style="
              padding: 0.5rem 1rem;
              background-color: #2c9f35;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            "
          >
            Adicionar
          </button>
          <button
            id="close-modal-btn"
            style="
              padding: 0.5rem 1rem;
              background-color: #f0f0f0;
              border: none;
              border-radius: 4px;
              cursor: pointer;
            "
          >
            Fechar
          </button>
        </div>
      </dialog>
      <footer
        style="
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid #eee;
          font-size: 0.85rem;
          color: #666;
        "
      >
        <p>
          Desenvolvido por
          <a
            href="https://lzart.com.br"
            target="_blank"
            style="color: #0066cc; text-decoration: none"
          >
            LZArt
          </a>
        </p>
        <p>
          Veja o
          <a
            href="/disclaimer.html"
            style="color: #0066cc; text-decoration: none"
            >disclaimer</a
          >.
        </p>
      </footer>
    </main>

    `,i={customProviders:[],defaultBang:{}},a={get setupUrl(){return document.getElementById("setup-url")},get demoVideo(){return document.getElementById("demo-video")},get providersList(){return document.getElementById("providers-list")},get showModalBtn(){return document.getElementById("show-modal-btn")},get modal(){return document.getElementById("custom-provider-modal")},get providerName(){return document.getElementById("providerName")},get providerBang(){return document.getElementById("providerBang")},get providerUrl(){return document.getElementById("providerUrl")},get testProviderBtn(){return document.getElementById("test-provider-btn")},get addProviderBtn(){return document.getElementById("add-provider-btn")},get closeModalBtn(){return document.getElementById("close-modal-btn")},get main(){return document.getElementById("main")}};function w(){S(),i.defaultBang=E(),q()}function b(){M(),f(),B()}function B(){a.setupUrl.addEventListener("click",P),a.demoVideo.addEventListener("click",e=>{e.target.play()},{passive:!0}),a.showModalBtn.addEventListener("click",T,{passive:!0}),a.testProviderBtn.addEventListener("click",N,{passive:!0}),a.addProviderBtn.addEventListener("click",U,{passive:!0}),a.closeModalBtn.addEventListener("click",h,{passive:!0})}function P(e){e.preventDefault();let r=e.target;navigator.clipboard.writeText(r==null?void 0:r.innerText),p("URL copiada para a área de transferência!")}function L(){var s,u;const r=(s=new URL(window.location.href).searchParams.get("q"))==null?void 0:s.trim();if(!r)return b(),null;const n=/!(\S+)/i.exec(r),d=(u=n==null?void 0:n[1])==null?void 0:u.toLowerCase();if(d==="cfg")return caches.delete("banger"),b(),null;const t=new Map([...g,...i.customProviders].map(c=>[c.bang,c])).get(d||"")||i.defaultBang,l=r.replace(/!\S+\s*/i,"").trim();if(!l){const c=t.url.indexOf("/",8);return c>-1?t.url.slice(0,c):t.url}return t.url.replace("{{ placeholder }}",encodeURIComponent(l))}function E(){const e={name:"Google",bang:"gg",url:"https://www.google.com/search?q={{ placeholder }}"};try{const r=localStorage.getItem("defaultBang");if(r)return JSON.parse(r)}catch(r){console.error("Failed to load default bang from localStorage:",r)}return localStorage.setItem("defaultBang",JSON.stringify(e)),e}function k(e){try{localStorage.setItem("defaultBang",JSON.stringify(e)),i.defaultBang=e,f()}catch(r){console.error("Failed to set default bang:",r)}}function q(){const e=L();e&&window.location.replace(e)}function C(e){confirm(`Deseja realmente remover o provedor ${e.name}?`)&&(i.customProviders=i.customProviders.filter(r=>r.bang!==e.bang),v(),console.log(`Custom provider removed: ${e.name}`),f())}function U(){const e=a.providerName.value.trim(),r=a.providerBang.value.toLowerCase().replace("!","").trim(),n=a.providerUrl.value.trim();if(!y(n)){p("URL inválida. Por favor, verifique o formato da URL.",!0);return}if(I(r)){p("Essa Bang já está em uso. Por favor, escolha outra.",!0);return}if(e&&r&&n){const d={name:e,bang:r,url:n};i.customProviders=[...i.customProviders,d],v(),console.log(`Custom provider added: ${d.name}`),h(),f()}else p("Por favor, preencha todos os campos: nome, bang e URL.",!0)}let m=null;function I(e){return m||(m=new Set([...g.map(r=>r.bang),...i.customProviders.map(r=>r.bang)])),m.has(e)}function N(){const e=a.providerUrl.value.trim();if(!y(e)){p("URL inválida. Por favor, verifique o formato da URL.",!0);return}window.open(e.replace("{{ placeholder }}","Banger LZArt"),"_blank")}function T(){a.modal.showModal()}function h(){a.modal.close(),a.providerName.value="",a.providerBang.value="",a.providerUrl.value=""}function S(){try{const e=localStorage.getItem("customProviders");i.customProviders=e?JSON.parse(e):[]}catch(e){console.error("Failed to load custom providers:",e),i.customProviders=[]}}function v(){try{localStorage.setItem("customProviders",JSON.stringify(i.customProviders))}catch(e){console.error("Failed to save custom providers:",e)}}function y(e){if(!e.includes("{{ placeholder }}"))return!1;try{return new URL(e.replace("{{ placeholder }}","test")),!0}catch{return!1}}function p(e,r=!1){const n=document.createElement("div");n.textContent=e,n.style.cssText=`
    position: fixed; bottom: 20px; right: 20px; padding: 10px 20px;
    background-color: ${r?"#ff5252":"#4caf50"}; color: white;
    border-radius: 4px; z-index: 1000; box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  `,document.body.appendChild(n),setTimeout(()=>{n.style.opacity="0",n.style.transition="opacity 0.5s",setTimeout(()=>document.body.removeChild(n),500)},3e3)}function f(){m=null;const e=[...g,...i.customProviders];if(a.providersList.innerHTML="",e.length===0){a.providersList.innerHTML='<li style="padding: 0.5rem">Nenhum provedor de busca encontrado.</li>';return}const r=document.createDocumentFragment(),n=i.defaultBang.bang;e.forEach(d=>{const o=document.createElement("li"),t=d.bang===n,l=!g.some(s=>s.bang===d.bang);if(o.style.cssText="padding: 0.5rem; margin-bottom: 0.25rem; cursor: pointer; display: flex; align-items: center; background-color: #f5f5f5; border-radius: 4px;",o.innerHTML=`
      <code style="font-family: monospace">
        !<span style="color: #d14; font-weight: bold">${d.bang}</span>:${d.name}
      </code>
      <span style="margin-left: 0.5rem; font-size: 0.85rem; color: ${t?"#2c9f35":"#666"}">
        ${t?"(padrão)":"(clique para definir como padrão)"}
      </span>
    `,l){const s=document.createElement("button");s.textContent="X",s.style.cssText="margin-left: auto; border: none; background: #ff5252; color: white; width: 20px; height: 20px; border-radius: 50%; cursor: pointer; font-size: 12px; line-height: 1;",s.title=`Remover ${d.bang}`,s.addEventListener("click",u=>{u.stopPropagation(),C(d)}),o.appendChild(s)}o.addEventListener("click",()=>k(d)),r.appendChild(o)}),a.providersList.appendChild(r)}function M(){a.main.innerHTML=x}w();
