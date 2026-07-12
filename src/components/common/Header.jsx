import { useAppData } from "../../context/AppDataContext";

export default function Header() {
  const { user, role } = useAppData();

  return (
    <header className="fixed top-0 right-0 left-0 h-header_height z-50 flex items-center justify-between px-container_padding bg-surface border-b border-outline-variant">
      <div className="flex items-center gap-8 w-full max-w-7xl mx-auto">
        <div className="text-headline-lg font-headline-lg font-bold text-primary shrink-0">TransitOps</div>
        <div className="flex-grow max-w-md ml-8">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
              search
            </span>
            <input
              className="w-full bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-2 text-body-md font-body-md focus:ring-2 focus:ring-primary-container transition-all"
              placeholder="Search..."
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center gap-6 ml-auto">
          <div className="text-body-md font-body-md text-secondary">{user?.region ?? "Region K"}</div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-secondary">notifications</span>
            </button>
            <button className="p-2 rounded-full hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-secondary">help</span>
            </button>
          </div>
          <div className="flex items-center gap-3 pl-4 border-l border-outline-variant">
            <div className="text-right">
              <p className="text-body-md font-body-md font-bold text-on-surface">{user?.name ?? "Guest"}</p>
              <p className="text-label-caps font-label-caps text-secondary">{(role ?? "").toUpperCase()}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center overflow-hidden border border-outline-variant">
              <span className="material-symbols-outlined text-on-primary-fixed-variant">account_circle</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
