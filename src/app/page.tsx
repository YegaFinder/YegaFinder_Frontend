import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-yegna-background dark:bg-yegna-dark">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-5xl font-bold tracking-tight text-yegna-primary font-poppins">
          YegnaFinder V2
        </h1>
        <p className="text-xl text-muted-foreground font-inter">
          Smart Local Discovery & Marketplace Platform
        </p>
        
        <div className="pt-8 flex gap-4 justify-center">
          <Link 
            href="/login" 
            className="px-6 py-3 rounded-xl bg-gradient-to-br from-yegna-primary to-yegna-secondary text-white font-medium hover:opacity-90 transition-opacity"
          >
            Login to App
          </Link>
          <Link 
            href="/register" 
            className="px-6 py-3 rounded-xl border border-yegna-primary text-yegna-primary bg-white dark:bg-transparent font-medium hover:bg-yegna-primary/5 transition-colors"
          >
            Create Account
          </Link>
        </div>
      </div>
    </main>
  );
}
