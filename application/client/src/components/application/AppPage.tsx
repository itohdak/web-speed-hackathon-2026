import type { ReactNode } from "react";

import { Navigation } from "@web-speed-hackathon-2026/client/src/components/application/Navigation";

interface Props {
  activeUser: Models.User | null;
  children: ReactNode;
  onOpenAuthModal: () => void;
  onOpenNewPostModal: () => void;
  onLogout: () => void;
}

export const AppPage = ({
  activeUser,
  children,
  onLogout,
  onOpenAuthModal,
  onOpenNewPostModal,
}: Props) => {
  return (
    <div className="app-shell relative z-0 flex justify-center font-sans">
      <div className="app-frame bg-cax-surface text-cax-text flex min-h-screen max-w-full">
        <aside className="relative z-10">
          <Navigation
            activeUser={activeUser}
            onLogout={onLogout}
            onOpenAuthModal={onOpenAuthModal}
            onOpenNewPostModal={onOpenNewPostModal}
          />
        </aside>
        <main className="app-main relative z-0 w-screen max-w-screen-sm min-w-0 shrink pb-12 lg:pb-0">
          {children}
        </main>
      </div>
    </div>
  );
};
