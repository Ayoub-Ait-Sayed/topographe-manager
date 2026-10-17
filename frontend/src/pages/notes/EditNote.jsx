import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

export default function EditNote() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    projet_id: "",
    contenu: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [noteResponse, projetsResponse] = await Promise.all([
          api.get(`/notes/${id}`),
          api.get("/projets"),
        ]);

        const note = noteResponse.data.data;

        setForm({
          projet_id: note.projet_id || "",
          contenu: note.contenu || "",
        });

        setProjets(projetsResponse.data.data || []);
      } catch (error) {
        console.error("Erreur chargement note :", error);
        alert("Impossible de charger la note.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await api.put(`/notes/${id}`, {
        projet_id: Number(form.projet_id),
        contenu: form.contenu,
      });

      navigate(`/notes/${id}`);
    } catch (error) {
      console.error("Erreur modification note :", error);

      const message =
        error.response?.data?.message ||
        "Impossible de modifier la note.";

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
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          to={`/notes/${id}`}
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          ← Retour à la note
        </Link>

        <h1 className="mt-3 text-2xl font-bold text-slate-900">
          Modifier la note
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
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
            Contenu
          </label>

          <textarea
            name="contenu"
            value={form.contenu}
            onChange={handleChange}
            required
            rows={7}
            className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
          />
        </div>

        <div className="flex justify-end gap-3">
          <Link
            to={`/notes/${id}`}
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