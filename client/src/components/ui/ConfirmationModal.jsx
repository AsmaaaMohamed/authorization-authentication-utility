import { C } from "../../constants/theme";
import Button from "./Button";
import Modal from "./Modal";

function ConfirmationModal({
  title = "Are you sure?",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
    >
      <div
        style={{
          fontSize: 13,
          color: C.textMuted,
          marginBottom: 20,
        }}
      >
        {message}
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
        }}
      >
        <Button
          variant="secondary"
          full
          type="button"
          onClick={onCancel}
        >
          {cancelText}
        </Button>

        <Button
          full
          type="button"
          onClick={onConfirm}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}

export default ConfirmationModal;