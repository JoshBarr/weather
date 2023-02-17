interface UnitButtonProps {
  selected: boolean;
  unit: string;
  onClick: () => void;
  label: string;
}

export const UnitButton: React.FC<UnitButtonProps> = ({
  selected,
  unit,
  onClick,
  label,
}) => {
  return (
    <button
      aria-label={`Show temperatures in ${label}`}
      className={`px-1 mr-2 rounded-sm ${
        selected ? "bg-slate-400" : "bg-slate-200	"
      }`}
      onClick={onClick}
    >
      º{unit}
    </button>
  );
};
