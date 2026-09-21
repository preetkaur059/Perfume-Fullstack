const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-between gap-3 text-sm">
      <button type="button" onClick={() => onPageChange(pagination.page - 1)} disabled={!pagination.hasPreviousPage} className="rounded-lg border border-zinc-700 px-4 py-2 text-zinc-300 transition hover:border-lime-400 hover:text-lime-400 disabled:cursor-not-allowed disabled:opacity-40">
        Previous
      </button>
      <span className="text-zinc-400">Page {pagination.page} of {pagination.totalPages}</span>
      <button type="button" onClick={() => onPageChange(pagination.page + 1)} disabled={!pagination.hasNextPage} className="rounded-lg border border-zinc-700 px-4 py-2 text-zinc-300 transition hover:border-lime-400 hover:text-lime-400 disabled:cursor-not-allowed disabled:opacity-40">
        Next
      </button>
    </div>
  );
};

export default Pagination;
