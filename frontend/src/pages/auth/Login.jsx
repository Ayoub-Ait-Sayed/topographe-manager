import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPinned,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  ArrowRight,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import topographieImage from "../../assets/topographie-login.jpg";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Email ou mot de passe incorrect."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Partie gauche : image */}
        <section
          className="relative hidden overflow-hidden bg-slate-950 bg-cover bg-center lg:flex lg:flex-col lg:justify-between"
          style={{
            backgroundImage: `
              linear-gradient(
                135deg,
                rgba(8, 25, 48, 0.94),
                rgba(8, 25, 48, 0.58)
              ),
              url(${topographieImage})
            `,
          }}
        >
          {/* Décoration */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -left-24 top-32 h-96 w-96 rounded-full border border-white/50" />
            <div className="absolute -left-12 top-44 h-72 w-72 rounded-full border border-white/50" />
            <div className="absolute left-0 top-56 h-48 w-48 rounded-full border border-white/50" />
          </div>

          <div className="relative z-10 p-12 xl:p-16">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
                <MapPinned size={32} className="text-white" />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-wide text-white">
                  Topographe Manager
                </h1>
                <p className="mt-1 text-sm text-slate-300">
                  Gestion professionnelle
                </p>
              </div>
            </div>

            {/* Texte principal */}
            <div className="mt-28 max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-slate-200 backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Votre espace de gestion
              </div>

              <h2 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
                Gérez vos projets topographiques simplement.
              </h2>

              <p className="mt-6 max-w-lg text-base leading-8 text-slate-300 xl:text-lg">
                Clients, projets, missions, interventions, documents,
                devis et factures dans une seule plateforme.
              </p>

              {/* Points forts */}
              <div className="mt-10 grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <MapPinned className="mb-3 text-sky-300" size={24} />
                  <p className="font-semibold text-white">
                    Projets centralisés
                  </p>
                  <p className="mt-1 text-sm text-slate-300">
                    Toutes vos données au même endroit
                  </p>
                </div>

                <div className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <LockKeyhole className="mb-3 text-sky-300" size={24} />
                  <p className="font-semibold text-white">
                    Accès sécurisé
                  </p>
                  <p className="mt-1 text-sm text-slate-300">
                    Un espace dédié à votre activité
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 px-12 pb-8 xl:px-16">
            <div className="border-t border-white/20 pt-5">
              <p className="text-sm text-slate-400">
                © 2026 Topographe Manager — Tous droits réservés
              </p>
            </div>
          </div>
        </section>

        {/* Partie droite : connexion */}
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10 sm:px-8">
          {/* Décoration de fond */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-100/70 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />

          <div className="relative z-10 w-full max-w-md">

            {/* Logo mobile */}
            <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
              <div className="rounded-xl bg-slate-900 p-3 text-white">
                <MapPinned size={27} />
              </div>

              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Topographe Manager
                </h1>
                <p className="text-sm text-slate-500">
                  Gestion professionnelle
                </p>
              </div>
            </div>

            {/* Carte de connexion */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xl shadow-slate-200/60 sm:p-9">

              <div className="mb-8">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <MapPinned size={30} />
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                  Bon retour !
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Connectez-vous à votre compte pour accéder à votre espace
                  de gestion.
                </p>
              </div>

              {/* Erreur */}
              {error && (
                <div
                  role="alert"
                  className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Adresse e-mail
                  </label>

                  <div className="relative">
                    <Mail
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="exemple@email.com"
                      autoComplete="email"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* Mot de passe */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-slate-700"
                    >
                      Mot de passe
                    </label>
                  </div>

                  <div className="relative">
                    <LockKeyhole
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Entrez votre mot de passe"
                      autoComplete="current-password"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword
                          ? "Masquer le mot de passe"
                          : "Afficher le mot de passe"
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                    >
                      {showPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Bouton connexion */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Connexion en cours...
                    </>
                  ) : (
                    <>
                      Se connecter
                      <ArrowRight
                        size={18}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </form>

              {/* Inscription */}
              <div className="mt-7 border-t border-slate-100 pt-6 text-center text-sm text-slate-500">
                Vous n'avez pas de compte ?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-blue-700 transition hover:text-blue-900"
                >
                  Créer un compte
                </Link>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-slate-400">
              Connexion sécurisée · Topographe Manager
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

