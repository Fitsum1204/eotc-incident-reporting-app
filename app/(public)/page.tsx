import { HomeContent } from "@/components/shared/HomeContent";
import { Loader2 } from "lucide-react";

  import { Suspense } from "react";
export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}

