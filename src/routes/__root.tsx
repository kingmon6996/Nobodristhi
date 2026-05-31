import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CivicAuthProvider, useUser } from "@civic/auth/react";
import { useEffect } from "react";
import admins from "@/admins.json";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CustomCursor } from "@/components/site/CustomCursor";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lovable App" },
      { name: "description", content: "Lovable Generated Project" },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Lovable App" },
      { property: "og:description", content: "Lovable Generated Project" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
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
    <html lang="en">
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

function BackendSync() {
  const { user } = useUser();

  useEffect(() => {
    if (user && user.id) {
      if (sessionStorage.getItem('backend_synced_user_id') === user.id) return;

      const syncToBackend = async () => {
        try {
          const backendUrl = import.meta.env.VITE_BACKEND_URL;
          
          if (!backendUrl) {
            console.warn("❌ VITE_BACKEND_URL is not defined in .env file");
            return;
          }
          
          const email = user.email || "no-email@example.com";
          const payload = {
            id: user.id,
            name: user.name || "Unknown",
            email: email,
            role: admins.includes(email) ? "admin" : "reporter"
          };
          
          // Use proxy path in development, full URL in production
          const endpoint = import.meta.env.DEV ? '/api/member/login' : `${backendUrl}/member/login`;
          console.log(`🔄 Syncing user to backend: ${endpoint}`);
          
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });
          
          if (!response.ok) {
            console.error(`❌ Backend returned ${response.status}: ${response.statusText}`);
            const errorText = await response.text();
            console.error("Response body:", errorText);
            return;
          }
          
          console.log("✅ User synced to backend successfully");
          sessionStorage.setItem('backend_synced_user_id', user.id);
        } catch (error) {
          console.error("❌ Failed to sync user to backend:", error);
          if (error instanceof TypeError) {
            console.error("This is likely a network/CORS issue or invalid URL");
            console.error("Troubleshooting: Ensure backend is running and accessible at VITE_BACKEND_URL");
          }
        }
      };
      
      syncToBackend();
    }
  }, [user]);

  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <CivicAuthProvider clientId={import.meta.env.VITE_CIVIC_CLIENT_ID || ""}>
      <BackendSync />
      <QueryClientProvider client={queryClient}>
        <CustomCursor />
        <SmoothScroll />
        <Outlet />
      </QueryClientProvider>
    </CivicAuthProvider>
  );
}
