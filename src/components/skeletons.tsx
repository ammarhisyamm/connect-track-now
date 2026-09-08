import { Skeleton } from "./motion";

/** Skeleton isi Home (di bawah header navy yang statis). */
export function HomeSkeleton() {
  return (
    <div className="space-y-6">
      <section>
        <Skeleton className="h-5 w-52" />
        <div className="mt-2.5 flex gap-2">
          <Skeleton className="h-9 w-20 rounded-full!" />
          <Skeleton className="h-9 w-24 rounded-full!" />
          <Skeleton className="h-9 w-24 rounded-full!" />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {[0, 1].map((i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white p-3.5">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="mt-2 h-6 w-1/2" />
              <Skeleton className="mt-2 h-1.5 w-full" />
            </div>
          ))}
        </div>
      </section>
      <section>
        <Skeleton className="h-5 w-44" />
        <div className="mt-2.5 rounded-xl border border-slate-200 bg-white p-4">
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="mt-2 h-5 w-3/4" />
          <Skeleton className="mt-2 h-3 w-2/3" />
        </div>
      </section>
      <section>
        <Skeleton className="h-5 w-40" />
        <div className="mt-2.5 space-y-3">
          {[0, 1].map((i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white p-4">
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="mt-2 h-4 w-3/4" />
              <Skeleton className="mt-1.5 h-3 w-1/2" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/** Skeleton daftar Aktivitas (di bawah header + pills + filter yang statis). */
export function AktivitasListSkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="rounded-xl border border-slate-200 bg-white p-4">
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="mt-2.5 h-4 w-4/5" />
          <Skeleton className="mt-1.5 h-3 w-1/2" />
          <Skeleton className="mt-3 h-11 w-full rounded-lg!" />
        </div>
      ))}
    </div>
  );
}

/** Skeleton Detail Aktivitas (di bawah header yang statis). */
export function AktivitasDetailSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="mt-2.5 h-5 w-4/5" />
        <Skeleton className="mt-1.5 h-3 w-1/2" />
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <Skeleton className="h-44 w-full rounded-lg!" />
        <Skeleton className="mx-auto mt-3 h-9 w-44 rounded-full!" />
      </div>
      <div>
        <Skeleton className="h-5 w-40" />
        <div className="mt-3 space-y-2.5">
          {[0, 1].map((i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5">
              <div className="flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="mt-1.5 h-3 w-1/2" />
              </div>
              <Skeleton className="h-10 w-10 rounded-full!" />
              <Skeleton className="h-10 w-10 rounded-full!" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Skeleton Kontak (di bawah header + search yang statis). */
export function KontakSkeleton() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-[76px] rounded-xl!" />
        <Skeleton className="h-[76px] rounded-xl!" />
      </div>
      {[0, 1].map((i) => (
        <div key={i} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="space-y-2 p-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-16 w-full rounded-lg!" />
            <Skeleton className="h-10 w-full rounded-full!" />
          </div>
          <Skeleton className="h-10 w-full rounded-none!" />
        </div>
      ))}
    </div>
  );
}

/** Skeleton Program (di bawah hero yang statis). */
export function ProgramSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="mt-1.5 h-3 w-1/3" />
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Skeleton className="h-[76px] rounded-xl!" />
          <Skeleton className="h-[76px] rounded-xl!" />
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="mt-1.5 h-3 w-full" />
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Skeleton className="h-28 rounded-xl!" />
          <Skeleton className="h-28 rounded-xl!" />
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <Skeleton className="h-5 w-1/2" />
        <div className="mt-3 space-y-2.5">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-[68px] rounded-xl!" />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Skeleton Profile (di bawah header yang statis). */
export function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-xl!" />
          <div className="flex-1">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="mt-1.5 h-3 w-1/3" />
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="mx-auto mt-4 h-[180px] w-[180px] rounded-full!" />
        <div className="mt-4 space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i}>
              <Skeleton className="h-3 w-1/2" />
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                <Skeleton className="h-9 rounded-lg!" />
                <Skeleton className="h-9 rounded-lg!" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Skeleton Notifikasi (di bawah header yang statis). */
export function NotifikasiSkeleton() {
  return (
    <div>
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex gap-3 border-b border-slate-100 px-5 py-4">
          <Skeleton className="h-12 w-12 rounded-xl!" />
          <div className="flex-1">
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="mt-1.5 h-3 w-full" />
            <Skeleton className="mt-1 h-3 w-2/3" />
            <Skeleton className="mt-1.5 h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
