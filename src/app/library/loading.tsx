export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="h-14 border-b border-slate-200 bg-white" />
      <div className="mx-auto max-w-6xl animate-pulse px-6 py-8">
        <div className="mb-3 h-7 w-48 rounded bg-slate-200" />
        <div className="mb-8 h-4 w-80 rounded bg-slate-200" />
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_31rem]">
          <div className="flex flex-col gap-3">
            <div className="h-24 rounded-xl bg-slate-200" />
            <div className="h-24 rounded-xl bg-slate-200" />
            <div className="h-24 rounded-xl bg-slate-200" />
          </div>
          <div className="h-[40rem] rounded bg-slate-200" />
        </div>
      </div>
    </div>
  );
}
