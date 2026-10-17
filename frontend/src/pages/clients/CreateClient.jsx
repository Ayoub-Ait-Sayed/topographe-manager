import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import api from "../../services/api";

export default function CreateClient() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: "",
    email: "",
    telephone: "",
    adresse: "",
    entreprise: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await api.post("/clients", form);

      navigate("/clients");
    } catch (err) {
      console.error(err);

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
            "Impossible de créer le client."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      <div className="mb-8 flex items-center gap-4">

        <Link
          to="/clients"
          className="rounded-xl p-2 hover:bg-white"
        >
          <ArrowLeft size={22} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Ajouter un client
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Créez un nouveau client.
          </p>
        </div>

      </div>

      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div className="grid gap-6 sm:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium">
                Nom
              </label>

              <input
                name="nom"
                value={form.nom}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900"
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
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Téléphone
              </label>

              <input
                name="telephone"
                value={form.telephone}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Entreprise
              </label>

              <input
                name="entreprise"
                value={form.entreprise}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900"
              />
            </div>

          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Adresse
            </label>

            <textarea
              name="adresse"
              value={form.adresse}
              onChange={handleChange}
              rows="4"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">

            <Link
              to="/clients"
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Annuler
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              <Save size={18} />

              {loading
                ? "Enregistrement..."
                : "Enregistrer"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}