type Props = {
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  emptyText?: string;
};

export function Status({ loading, error, empty, emptyText = "No data" }: Props) {
  if (loading) {
    return <div className="status">Loading...</div>;
  }

  if (error) {
    return <div className="status status-error">{error}</div>;
  }

  if (empty) {
    return <div className="status">{emptyText}</div>;
  }

  return null;
}
