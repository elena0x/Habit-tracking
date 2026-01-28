interface EmptyStateProps {
  onCreateFirst: () => void;
}

export const EmptyState = ({ onCreateFirst }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 animate-fade-in">
      <div className="text-6xl mb-6">📝</div>
      <h2 className="text-xl font-medium text-foreground mb-2">开始记录生活</h2>
      <p className="text-muted-foreground text-center mb-8 max-w-xs">
        创建你的第一个事件，记录下那些值得回顾的时刻
      </p>
      <button
        onClick={onCreateFirst}
        className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity"
      >
        创建第一个事件
      </button>
    </div>
  );
};
