import GenericModal from "#lib/frontend/components/modals/GenericModal.js";
import { appState } from "#lib/frontend/stores/appState.js";
import type { Provider } from "#lib/frontend/utils/providers.js";

type Props = {
  provider: Provider;
  open: boolean;
  onCancel: () => void;
};

export default function RemoveProviderModal(props: Props) {
  const handleRemoveProvider = () => {
    appState.removeCustomProvider(props.provider);
    props.onCancel();
  };

  return (
    <GenericModal
      title={`Remover ${props.provider.name} ?`}
      open={props.open}
      onCancel={props.onCancel}
      actions={
        <>
          <button
            type="button"
            class="btn btn-error"
            onClick={handleRemoveProvider}>
            Remover
          </button>
          <button
            type="button"
            class="btn"
            onClick={props.onCancel}>
            Fechar
          </button>
        </>
      }>
      <p>Tem certeza que deseja remover este provedor?</p>
    </GenericModal>
  );
}
