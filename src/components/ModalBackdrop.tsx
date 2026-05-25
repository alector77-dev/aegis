type Props = {
  children: React.ReactNode;
  onClose: () => void;
};

export default function ModalBackdrop({
  children,
  onClose,
}: Props) {
  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}