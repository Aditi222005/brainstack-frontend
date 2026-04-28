// DashboardNavbar — kept for backwards compatibility; Dashboard uses its own header.
export function DashboardNavbar(_: {
  onAddIdea: () => void;
  onAutoConnect: () => void;
  onSummary: () => void;
  onClear: () => void;
  onCreateProject?: () => void;
  isAutoConnecting?: boolean;
}) {
  return null;
}
