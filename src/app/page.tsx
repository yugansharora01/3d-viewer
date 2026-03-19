"use client";

import SideDrawer from "@/components/SideDrawer/SideDrawer";

export default function Home() {
  return (
    <SideDrawer>
      <div className="flex flex-col flex-1 items-center justify-center font-sans h-full min-h-[500px]">
        <div className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center p-8 bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800">
          <h1 className="text-4xl font-bold mb-4 text-white">Welcome to 3D Viewer</h1>
          <p className="text-zinc-400 text-center max-w-md">
            The side drawer allows you to navigate the application. On desktop, it collapses to 20%; on mobile, it uses a hamburger menu.
          </p>
        </div>
      </div>
    </SideDrawer>
  );
}
