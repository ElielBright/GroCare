import Sidebar from "@/components/Sidebar";
import AIAssistant from "@/components/AIAssistant";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-4 pt-20 lg:pt-8 lg:p-8 max-w-full overflow-x-hidden">
        {children}
      </main>
      <AIAssistant />
    </div>
  );
}
