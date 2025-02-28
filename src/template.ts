export const template = `<div
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

    `;
