import { ReactNode } from "react";
import { Header } from "@/features/header";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen w-full" >
      <Header />
      <main className="min-h-screen bg-[#efefef]">
        {children}
      </main>
    </div>
  );
}
