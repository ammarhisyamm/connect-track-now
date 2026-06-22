import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MobileShell } from "@/components/mobile-shell";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login" }] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [show, setShow] = useState(false);

  return (
    <MobileShell hideNav>
      <div className="flex flex-1 flex-col text-brand-foreground" style={{ background: "var(--gradient-brand)" }}>
        <div className="flex flex-1 flex-col justify-end px-6 pb-8 pt-20">
          <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-2xl font-black text-accent-foreground">
            S
          </div>
          <h1 className="text-3xl font-bold leading-tight">Sales Tracking</h1>
          <p className="mt-1 text-sm text-brand-foreground/70">Masuk untuk mulai aktivitasmu hari ini.</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            nav({ to: "/" });
          }}
          className="space-y-4 rounded-t-3xl bg-card p-6 pb-10 text-foreground"
        >
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">NIP / Email</label>
            <input
              type="text"
              defaultValue="PG-098231"
              className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Password</label>
            <div className="relative mt-1.5">
              <input
                type={show ? "text" : "password"}
                defaultValue="••••••••"
                className="w-full rounded-xl border border-border bg-card px-4 py-3 pr-11 text-sm outline-none focus:border-brand"
              />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <button className="text-xs font-medium text-brand">Lupa password?</button>
          <button
            type="submit"
            className="w-full rounded-full bg-brand py-3.5 text-sm font-semibold text-brand-foreground shadow-lg shadow-brand/20 active:scale-[0.98]"
          >
            Masuk
          </button>
        </form>
      </div>
    </MobileShell>
  );
}
