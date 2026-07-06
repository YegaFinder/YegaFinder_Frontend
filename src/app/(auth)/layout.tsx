import { siteConfig } from "@/config/site";

/**
 * Shared shell for every screen under app/(auth)/.
 * The (auth) folder name is a Next.js "route group" — it groups these
 * routes under one layout without adding "/auth" to the actual URL.
 * e.g. app/(auth)/login/page.tsx renders at /login, not /auth/login.
 */
export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left — branding panel, hidden on small screens */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-yegna-primary to-yegna-secondary text-white p-12">
        <div className="max-w-md text-center space-y-6">
          <h1 className="text-4xl font-bold font-poppins">
            Discover Everything Around You.
          </h1>
          <p className="text-lg opacity-90 font-inter">
            Ethiopia&apos;s leading smart local discovery platform. Find
            trusted businesses, book services, and explore your city.
          </p>
        </div>
      </div>

      {/* Right — the actual auth form for whichever page matched */}
      <div className="flex flex-col justify-center items-center p-8 bg-yegna-background dark:bg-yegna-dark">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden text-center mb-8">
            <h2 className="text-3xl font-bold text-yegna-primary font-poppins">
              {siteConfig.name}
            </h2>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
