import { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";

export default function EditIntervention() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    projet_id: "",
    technicien_id: "",
    date: "",
    heure_debut: "",
    heure_fin: "",
    description: "",
    statut: "planifiee",
  });

  const [projets, setProjets] = useState([]);
  const [techniciens, setTechniciens] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [
          interventionResponse,
          projetsResponse,
          techniciensResponse,
        ] = await Promise.all([
          api.get(`/interventions/${id}`),
          api.get("/projets"),
          api.get("/interventions/techniciens"),
        ]);

        const intervention =
          interventionResponse.data.data;

        setForm({
          projet_id: intervention.projet_id || "",
          technicien_id:
            intervention.technicien_id || "",
          date: intervention.date || "",
          heure_debut:
            intervention.heure_debut || "",
          heure_fin: intervention.heure_fin || "",
          description:
            intervention.description || "",
          statut:
            intervention.statut || "planifiee",
        });

        setProjets(projetsResponse.data.data || []);
        setTechniciens(
          techniciensResponse.data.data || []
        );
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message ||
            "Impossible de charger l’intervention."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (validationErrors[name]) {
      setValidationErrors((current) => ({
        ...current,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setValidationErrors({});

      await api.put(`/interventions/${id}`, form);

      navigate(`/interventions/${id}`);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 422) {
        setValidationErrors(
          err.response.data.errors || {}
        );
      }

      setError(
        err.response?.data?.message ||
          "Impossible de modifier l’intervention."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center text-sm text-slate-500">
        Chargement...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to={`/interventions/${id}`}
          className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:bg-slate-50"
        >
          <ArrowLeft size={18} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Modifier l’intervention
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Modifier les informations de l’intervention.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Projet *
            </label>

            <select
              name="projet_id"
              value={form.projet_id}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            >
              <option value="">
                Sélectionner un projet
              </option>

              {projets.map((projet) => (
                <option
                  key={projet.id}
                  value={projet.id}
                >
                  {projet.reference} - {projet.nom}
                </option>
              ))}
            </select>

            {validationErrors.projet_id && (
              <p className="mt-1 text-xs text-red-600">
                {validationErrors.projet_id[0]}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Technicien *
            </label>

            <select
              name="technicien_id"
              value={form.technicien_id}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            >
              <option value="">
                Sélectionner un technicien
              </option>

              {techniciens.map((technicien) => (
                <option
                  key={technicien.id}
                  value={technicien.id}
                >
                  {technicien.name} - {technicien.email}
                </option>
              ))}
            </select>

            {validationErrors.technicien_id && (
              <p className="mt-1 text-xs text-red-600">
                {validationErrors.technicien_id[0]}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Date *
            </label>

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />

            {validationErrors.date && (
              <p className="mt-1 text-xs text-red-600">
                {validationErrors.date[0]}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Statut *
            </label>

            <select
              name="statut"
              value={form.statut}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            >
              <option value="planifiee">Planifiée</option>
              <option value="en_cours">En cours</option>
              <option value="terminee">Terminée</option>
              <option value="annulee">Annulée</option>
            </select>

            {validationErrors.statut && (
              <p className="mt-1 text-xs text-red-600">
                {validationErrors.statut[0]}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Heure de début *
            </label>

            <input
              type="time"
              name="heure_debut"
              value={form.heure_debut}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />

            {validationErrors.heure_debut && (
              <p className="mt-1 text-xs text-red-600">
                {validationErrors.heure_debut[0]}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Heure de fin *
            </label>

            <input
              type="time"
              name="heure_fin"
              value={form.heure_fin}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />

            {validationErrors.heure_fin && (
              <p className="mt-1 text-xs text-red-600">
                {validationErrors.heure_fin[0]}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="5"
              placeholder="Décrire l’intervention..."
              className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />

            {validationErrors.description && (
              <p className="mt-1 text-xs text-red-600">
                {validationErrors.description[0]}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-6">
          <Link
            to={`/interventions/${id}`}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Annuler
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={17} />

            {saving
              ? "Enregistrement..."
              : "Enregistrer les modifications"}
          </button>
        </div>
      </form>
    </div>
  );
}