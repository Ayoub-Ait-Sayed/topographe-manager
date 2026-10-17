import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

export default function EditRapport() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    projet_id: "",
    titre: "",
    contenu: "",
    date: "",
    fichier: null,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [rapportResponse, projetsResponse] =
          await Promise.all([
            api.get(`/rapports/${id}`),
            api.get("/projets"),
          ]);

        const rapport = rapportResponse.data.data;

        setForm({
          projet_id: rapport.projet_id || "",
          titre: rapport.titre || "",
          contenu: rapport.contenu || "",
          date: rapport.date || "",
          fichier: null,
        });

        setProjets(projetsResponse.data.data || []);
      } catch (error) {
        console.error(error);
        alert("Impossible de charger le rapport.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm((current) => ({
      ...current,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("_method", "PUT");
      formData.append("projet_id", form.projet_id);
      formData.append("titre", form.titre);
      formData.append("contenu", form.contenu);
      formData.append("date", form.date);

      if (form.fichier) {
        formData.append("fichier", form.fichier);
      }

      await api.post(`/rapports/${id}`, formData);

      navigate(`/rapports/${id}`);
    } catch (error) {
      console.error("Erreur modification rapport :", error);

      const message =
        error.response?.data?.message ||
        "Impossible de modifier le rapport.";

      alert(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-sm text-slate-500">
        Chargement...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          to={`/rapports/${id}`}
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          ← Retour au rapport
        </Link>

        <h1 className="mt-3 text-2xl font-bold text-slate-900">
          Modifier le rapport
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Projet
            </label>

            <select
              name="projet_id"
              value={form.projet_id}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-slate-500"
            >
              <option value="">Sélectionner un projet</option>

              {projets.map((projet) => (
                <option key={projet.id} value={projet.id}>
                  {projet.reference} — {projet.nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Date
            </label>

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-slate-500"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Titre
          </label>

          <input
            type="text"
            name="titre"
            value={form.titre}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Contenu
          </label>

          <textarea
            name="contenu"
            value={form.contenu}
            onChange={handleChange}
            required
            rows={10}
            className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Remplacer le fichier
          </label>

          <input
            type="file"
            name="fichier"
            accept=".pdf,.doc,.docx,.xls,.xlsx"
            onChange={handleChange}
            className="block w-full rounded-lg border border-slate-300 p-2 text-sm"
          />

          <p className="mt-2 text-xs text-slate-500">
            Laisser vide pour conserver le fichier actuel.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            to={`/rapports/${id}`}
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Annuler
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {saving ? "Modification..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
}