import { createMemo, createSignal } from "solid-js";

import GenericModal from "#lib/frontend/components/modals/GenericModal.js";
import { customProvidersStore } from "#lib/frontend/stores/customProviders.js";
import { toastStore } from "#lib/frontend/stores/toast.js";
import { PLACEHOLDER_TOKEN, providerValidationMessage } from "#lib/frontend/utils/providers.js";

type Props = {
  open: boolean;
  onCancel?: () => void;
};

export default function AddProviderModal(props: Props) {
  const [providerName, setProviderName] = createSignal("");
  const [providerBang, setProviderBang] = createSignal("");
  const [providerUrl, setProviderUrl] = createSignal("");

  const formEmpty = createMemo(() => !providerName() || !providerBang() || !providerUrl());

  const resetForm = () => {
    setProviderName("");
    setProviderBang("");
    setProviderUrl("");
  };

  const close = () => {
    resetForm();
    props.onCancel?.();
  };

  const currentProvider = () => ({
    name: providerName(),
    bang: providerBang(),
    url: providerUrl(),
  });

  const handleAddProvider = () => {
    const error = customProvidersStore.add(currentProvider());
    if (error) {
      toastStore.showToast(providerValidationMessage(error), "error");
      return;
    }

    toastStore.showToast("Provedor adicionado", "success");
    close();
  };

  const handleTestProvider = () => {
    const error = customProvidersStore.test(currentProvider());
    if (error) toastStore.showToast(providerValidationMessage(error), "error");
  };

  return (
    <GenericModal
      title="Adicionar provedor personalizado"
      modalClass="max-w-lg w-full"
      open={props.open}
      onCancel={close}
      actions={
        <>
          <button
            type="button"
            class="btn"
            onClick={close}>
            Fechar
          </button>
          <button
            type="button"
            class="btn btn-ghost"
            onClick={handleTestProvider}
            disabled={!providerUrl()}>
            Testar
          </button>
          <button
            type="button"
            class="btn btn-success"
            onClick={handleAddProvider}
            disabled={formEmpty()}>
            Adicionar
          </button>
        </>
      }>
      <fieldset class="fieldset mt-2 w-full">
        <legend class="fieldset-legend font-semibold">Nome</legend>
        <input
          type="text"
          name="providerName"
          class="input w-full"
          placeholder="Exemplo: Meu Provider"
          value={providerName()}
          onInput={(event) => setProviderName(event.currentTarget.value)}
        />
      </fieldset>

      <fieldset class="fieldset mt-2 w-full">
        <legend class="fieldset-legend font-semibold">Bang</legend>
        <input
          type="text"
          name="providerBang"
          class="input w-full"
          placeholder="Exemplo: my"
          value={providerBang()}
          onInput={(event) => setProviderBang(event.currentTarget.value)}
        />
      </fieldset>

      <fieldset class="fieldset mt-2 w-full">
        <legend class="fieldset-legend font-semibold">
          URL ("{PLACEHOLDER_TOKEN}" é onde a pesquisa será inserida)
        </legend>
        <input
          type="text"
          name="providerUrl"
          class="input w-full"
          placeholder={`https://mysearch.com?q=${PLACEHOLDER_TOKEN}`}
          value={providerUrl()}
          onInput={(event) => setProviderUrl(event.currentTarget.value)}
        />
      </fieldset>
    </GenericModal>
  );
}
