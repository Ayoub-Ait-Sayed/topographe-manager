import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPinned } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

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

    if (form.password !== form.password_confirmation) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    try {
      await register(
        form.name,
        form.email,
        form.password,
        form.password_confirmation
      );

      navigate("/dashboard");
    } catch (err) {
      const errors = err.response?.data?.errors;

      if (errors) {
        const firstError = Object.values(errors)[0];

        setError(
          Array.isArray(firstError)
            ? firstError[0]
            : "Erreur de validation."
        );
      } else {
        setError(
          err.response?.data?.message ||
            "Une erreur est survenue."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="rounded-xl bg-slate-900 p-3 text-white">
              <MapPinned size={24} />
            </div>

            <div>
              <h1 className="font-bold text-slate-900">
                Topographe Manager
              </h1>

              <p className="text-sm text-slate-500">
                Création de compte
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              Créer un compte
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Remplissez les informations ci-dessous.
            </p>

            {error && (
              <div className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Nom complet
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900"
                  placeholder="Votre nom"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900"
                  placeholder="vous@example.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Mot de passe
                </label>

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  minLength={8}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900"
                  placeholder="Minimum 8 caractères"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Confirmer le mot de passe
                </label>

                <input
                  type="password"
                  name="password_confirmation"
                  value={form.password_confirmation}
                  onChange={handleChange}
                  minLength={8}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900"
                  placeholder="Répétez le mot de passe"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-slate-900 px-4 py-3 font-medium text-white hover:bg-slate-800 disabled:opacity-60"
              >
                {loading
                  ? "Création..."
                  : "Créer mon compte"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
              Vous avez déjà un compte ?{" "}
              <Link
                to="/login"
                className="font-semibold text-slate-900 hover:underline"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}