import { Link, useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { type ReactNode } from "react";

export function AppHeader({
  title,
  back,
  right,
}: {
  title: string;
  back?: string | boolean;
  right?: ReactNode;
}) {
  const router = useRouter();
  return (
    <header className="flex items-center gap-3 px-5 pt-3 pb-4 bg-background">
      {back !== undefined && back !== false && (
        typeof back === "string" ? (
          <Link to={back} className="p-2 -ml-2 rounded-full hover:bg-muted">
            <ChevronLeft className="w-5 h-5" />
          </Link>
        ) : (
          <button onClick={() => router.history.back()} className="p-2 -ml-2 rounded-full hover:bg-muted">
            <ChevronLeft className="w-5 h-5" />
          </button>
        )
      )}
      <h1 className="flex-1 text-center text-[17px] font-bold text-foreground">{title}</h1>
      <div className="min-w-[32px] flex justify-end">{right}</div>
    </header>
  );
}
