import { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

export default function EditMission() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    projet_id: "",
    titre: "",
    description: "",
    date_debut: "",
    date_fin: "",
    statut: "en_attente",
  });

  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [missionResponse, projetsResponse] =
          await Promise.all([
            api.get(`/missions/${id}`),
            api.get("/projets"),
          ]);

        const mission = missionResponse.data.data;

        setForm({
          projet_id: mission.projet_id ?? "",
          titre: mission.titre ?? "",
          description: mission.description ?? "",
          date_debut: mission.date_debut ?? "",
          date_fin: mission.date_fin ?? "",
          statut: mission.statut ?? "en_attente",
        });

        setProjets(projetsResponse.data.data || []);
      } catch (error) {
        console.error(error);
        alert("Impossible de récupérer la mission.");
        navigate("/missions");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      await api.put(`/missions/${id}`, {
        projet_id: Number(form.projet_id),
        titre: form.titre,
        description: form.description || null,
        date_debut: form.date_debut,
        date_fin: form.date_fin || null,
        statut: form.statut,
      });

      navigate("/missions");
    } catch (error) {
      console.error(error);

      const errors = error.response?.data?.errors;

      if (errors) {
        alert(
          Object.values(errors)
            .flat()
            .join("\n")
        );
      } else {
        alert("Impossible de modifier la mission.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-slate-500">
          Chargement...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/missions"
          className="rounded-xl border border-slate-200 bg-white p-2.5 hover:bg-slate-50"
        >
          <ArrowLeft size={20} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Modifier la mission
          </h1>

          <p className="text-sm text-slate-500">
            Modification de la mission #{id}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Projet *
          </label>

          <select
            name="projet_id"
            value={form.projet_id}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
          >
            <option value="">
              Sélectionner un projet
            </option>

            {projets.map((projet) => (
              <option
                key={projet.id}
                value={projet.id}
              >
                {projet.reference} — {projet.nom}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Titre *
          </label>

          <input
            type="text"
            name="titre"
            value={form.titre}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Description
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="5"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Date de début *
            </label>

            <input
              type="date"
              name="date_debut"
              value={form.date_debut}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Date de fin
            </label>

            <input
              type="date"
              name="date_fin"
              value={form.date_fin}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Statut *
          </label>

          <select
            name="statut"
            value={form.statut}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-400"
          >
            <option value="en_attente">En attente</option>
            <option value="en_cours">En cours</option>
            <option value="termine">Terminée</option>
            <option value="annule">Annulée</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
          <Link
            to="/missions"
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Annuler
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
}

