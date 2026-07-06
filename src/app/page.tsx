import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-yegna-background dark:bg-yegna-dark">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-5xl font-bold tracking-tight text-yegna-primary font-poppins">
          YegnaFinder
        </h1>
        <p className="text-xl text-muted-foreground font-inter">
          Discover Everything Around You.
        </p>

        <div className="pt-8 flex gap-4 justify-center">
          <Link
            href={ROUTES.LOGIN}
            className="rounded-[14px] px-6 py-3.5 text-white font-medium bg-gradient-to-br from-yegna-primary to-yegna-secondary"
          >
            Login to App
          </Link>
          <Link
            href={ROUTES.REGISTER}
            className="rounded-[14px] px-6 py-3.5 font-medium border border-yegna-primary text-yegna-primary bg-white"
          >
            Create Account
          </Link>
        </div>
      </div>
    </main>
  );
}
