interface EmptyStateProps {
  onCreateFirst: () => void;
}

export const EmptyState = ({ onCreateFirst }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 animate-fade-in">
      <div className="text-6xl mb-6">📝</div>
      <h2 className="text-xl font-medium text-foreground mb-2">Start with one small habit</h2>
      <p className="text-muted-foreground text-center mb-8 max-w-xs">
        Create a habit, routine, or life log and make your progress visible.
      </p>
      <button
        onClick={onCreateFirst}
        className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity"
      >
        Create your first habit
      </button>
    </div>
  );
};
