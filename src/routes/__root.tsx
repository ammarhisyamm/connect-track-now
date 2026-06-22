import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="mobile-shell items-center justify-center px-6 text-center">
      <h1 className="text-6xl font-bold text-brand">404</h1>
      <p className="mt-3 text-muted-foreground">Halaman tidak ditemukan.</p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="mobile-shell items-center justify-center px-6 text-center">
      <h1 className="text-xl font-semibold">Terjadi kesalahan</h1>
      <p className="mt-2 text-sm text-muted-foreground">Coba muat ulang halaman ini.</p>
      <button
        onClick={() => { router.invalidate(); reset(); }}
        className="mt-6 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground"
      >
        Coba lagi
      </button>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1" },
      { title: "Sales Tracking" },
      { name: "description", content: "Aplikasi sales tracking — kelola aktivitas, kontak, dan program." },
      { name: "theme-color", content: "#1f2360" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
