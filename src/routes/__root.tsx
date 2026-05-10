import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { AuthProvider } from "@/lib/auth";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-hero px-4">
      <div className="max-w-md text-center text-white">
        <h1 className="text-7xl font-extrabold">404</h1>
        <p className="mt-4 text-white/70">This destination isn't on the map yet.</p>
        <Link to="/" className="mt-6 inline-flex items-center justify-center rounded-full bg-cta text-background px-6 py-2 font-bold">
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button onClick={reset} className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Traveloop — Plan unforgettable journeys" },
      { name: "description", content: "Discover places, plan unforgettable journeys, and make every loop count with Traveloop." },
      { property: "og:title", content: "Traveloop — Plan unforgettable journeys" },
      { property: "og:description", content: "Discover places, plan unforgettable journeys, and make every loop count with Traveloop." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Traveloop — Plan unforgettable journeys" },
      { name: "twitter:description", content: "Discover places, plan unforgettable journeys, and make every loop count with Traveloop." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/df3bbef4-2554-4c89-9a21-5cd4c817fda6/id-preview-16cce648--7e2cb3a2-68b4-4927-a409-93f44452f801.lovable.app-1778404699129.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/df3bbef4-2554-4c89-9a21-5cd4c817fda6/id-preview-16cce648--7e2cb3a2-68b4-4927-a409-93f44452f801.lovable.app-1778404699129.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Pacifico&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
        <Toaster theme="dark" position="top-center" richColors />
      </AuthProvider>
    </QueryClientProvider>
  );
}
