
import { useState } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  ClipboardList,
  BriefcaseBusiness,
  FileText,
  Camera,
  StickyNote,
  FileBarChart,
  FileSpreadsheet,
  Receipt,
  CreditCard,
  Bell,
  UserCircle,
  LogOut,
  Menu,
  X,
  MapPinned,
  ChevronRight,
  Settings2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const menuItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Clients", path: "/clients", icon: Users },
  { label: "Projets", path: "/projets", icon: FolderKanban },
  { label: "Missions", path: "/missions", icon: BriefcaseBusiness },
  { label: "Interventions", path: "/interventions", icon: ClipboardList },
  { label: "Documents", path: "/documents", icon: FileText },
  { label: "Photos", path: "/photos", icon: Camera },
  { label: "Notes", path: "/notes", icon: StickyNote },
  { label: "Rapports", path: "/rapports", icon: FileBarChart },
  { label: "Devis", path: "/devis", icon: FileSpreadsheet },
  { label: "Factures", path: "/factures", icon: Receipt },
  { label: "Paiements", path: "/paiements", icon: CreditCard },
];

function formatRole(role) {
  if (!role) return "Utilisateur";

  const roles = {
    admin: "Administrateur",
    administrateur: "Administrateur",
    topographe: "Topographe",
    technicien: "Technicien",
  };

  return roles[role.toLowerCase()] || role;
}

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const currentItem = [...menuItems]
    .sort((a, b) => b.path.length - a.path.length)
    .find(
      (item) =>
        location.pathname === item.path ||
        location.pathname.startsWith(`${item.path}/`)
    );

  const pageTitle =
    location.pathname === "/profile"
      ? "Mon profil"
      : location.pathname === "/notifications"
        ? "Notifications"
        : currentItem?.label || "Topographe Manager";

  const closeMobileMenu = () => setMobileOpen(false);

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    } finally {
      setLoggingOut(false);
    }
  };

  const linkClass = ({ isActive }) =>
    [
      "group relative flex items-center gap-3 rounded-xl px-3.5 py-3",
      "text-sm font-medium transition-all duration-200",
      isActive
        ? "bg-blue-600 text-white shadow-md shadow-blue-950/20"
        : "text-slate-300 hover:bg-white/[0.07] hover:text-white",
    ].join(" ");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Fermer le menu"
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col",
          "border-r border-white/5 bg-slate-950 text-white",
          "transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Brand */}
        <div className="flex h-[82px] shrink-0 items-center justify-between border-b border-white/10 px-5">
          <NavLink
            to="/dashboard"
            onClick={closeMobileMenu}
            className="flex min-w-0 items-center gap-3"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-500 shadow-lg shadow-blue-500/20">
              <MapPinned size={24} strokeWidth={2.2} />
            </div>

            <div className="min-w-0">
              <h1 className="text-base font-bold tracking-tight text-white">
                Topographe
              </h1>
              <p className="mt-0.5 text-xs text-slate-400">
                Manager · Gestion métier
              </p>
            </div>
          </NavLink>

          <button
            type="button"
            onClick={closeMobileMenu}
            aria-label="Fermer"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-scroll flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Espace de travail
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  end={item.path === "/dashboard"}
                  className={linkClass}
                >
                  <Icon
                    size={19}
                    strokeWidth={1.8}
                    className="shrink-0"
                  />

                  <span className="flex-1">{item.label}</span>

                  <ChevronRight
                    size={15}
                    className={[
                      "transition-transform",
                      location.pathname === item.path
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60",
                    ].join(" ")}
                  />
                </NavLink>
              );
            })}
          </div>

          <div className="mb-3 mt-8 flex items-center justify-between px-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              Mon espace
            </p>
            <Settings2 size={14} className="text-slate-500" />
          </div>

          <div className="space-y-1">
            <NavLink
              to="/notifications"
              onClick={closeMobileMenu}
              className={linkClass}
            >
              <Bell size={19} strokeWidth={1.8} />
              <span className="flex-1">Notifications</span>
            </NavLink>

            <NavLink
              to="/profile"
              onClick={closeMobileMenu}
              className={linkClass}
            >
              <UserCircle size={19} strokeWidth={1.8} />
              <span className="flex-1">Mon profil</span>
            </NavLink>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/15 to-transparent p-4">
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300">
              <MapPinned size={19} />
            </div>

            <p className="text-sm font-semibold text-white">
              Topographe Manager
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Gérez vos projets et votre activité depuis un seul espace.
            </p>
          </div>
        </nav>

        {/* User account */}
        <div className="shrink-0 border-t border-white/10 p-4">
          <NavLink
            to="/profile"
            onClick={closeMobileMenu}
            className="mb-3 flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.04] p-3 transition hover:bg-white/[0.08]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-300">
              <UserCircle size={23} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                {user?.name || "Utilisateur"}
              </p>
              <p className="mt-1 truncate text-xs text-slate-400">
                {formatRole(user?.role)}
              </p>
            </div>
          </NavLink>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-300 transition hover:bg-red-500/10 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogOut size={18} />
            {loggingOut ? "Déconnexion..." : "Déconnexion"}
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="min-h-screen lg:pl-[270px]">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
          <div className="flex h-[76px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Ouvrir le menu"
                className="rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-100 lg:hidden"
              >
                <Menu size={21} />
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="hidden sm:inline">Espace de travail</span>
                  <ChevronRight size={13} className="hidden sm:inline" />
                  <span className="truncate">{pageTitle}</span>
                </div>

                <h2 className="mt-1 truncate text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                  {pageTitle}
                </h2>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <NavLink
                to="/notifications"
                aria-label="Notifications"
                title="Notifications"
                className={({ isActive }) =>
                  [
                    "relative flex h-10 w-10 items-center justify-center rounded-xl border transition",
                    isActive
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                  ].join(" ")
                }
              >
                <Bell size={19} />
              </NavLink>

              <div className="hidden h-9 w-px bg-slate-200 sm:block" />

              <NavLink
                to="/profile"
                title="Mon profil"
                className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-100 sm:gap-3 sm:pr-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                  <UserCircle size={22} />
                </div>

                <div className="hidden min-w-0 text-left sm:block">
                  <p className="max-w-36 truncate text-sm font-semibold text-slate-800">
                    {user?.name || "Utilisateur"}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {formatRole(user?.role)}
                  </p>
                </div>
              </NavLink>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-[calc(100vh-76px)] p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-[1600px]">
            <Outlet />
          </div>
        </main>

        <footer className="border-t border-slate-200/80 px-4 py-4 text-center text-xs text-slate-500 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Topographe Manager
          <span className="mx-2">·</span>
          Gestion de votre activité
        </footer>
      </div>
    </div>
  );
}

