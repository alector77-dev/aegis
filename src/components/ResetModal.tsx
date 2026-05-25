import "./ResetModal.css";

type ResetModalProps = {
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ResetModal({
  onCancel,
  onConfirm,
}: ResetModalProps) {
  return (
    <div
      className="reset-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="reset-title">Reset Duel?</h2>

      <p className="reset-body">
        This will reset both players to 8000 LP and clear the duel log.
      </p>

      <div className="reset-button-row">
        <button
          className="reset-cancel-button"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button
          className="reset-confirm-button"
          onClick={onConfirm}
        >
          Reset
        </button>
      </div>
    </div>
  );
}