import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function CreateNote() {
  const navigate = useNavigate();

  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingProjets, setLoadingProjets] = useState(true);

  const [form, setForm] = useState({
    projet_id: "",
    contenu: "",
  });

  useEffect(() => {
    const loadProjets = async () => {
      try {
        const response = await api.get("/projets");

        setProjets(response.data.data || []);
      } catch (error) {
        console.error("Erreur chargement projets :", error);
        alert("Impossible de charger les projets.");
      } finally {
        setLoadingProjets(false);
      }
    };

    loadProjets();
  }, []);

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
      setLoading(true);

      await api.post("/notes", {
        projet_id: Number(form.projet_id),
        contenu: form.contenu,
      });

      navigate("/notes");
    } catch (error) {
      console.error("Erreur création note :", error);

      const message =
        error.response?.data?.message ||
        "Impossible de créer la note.";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          to="/notes"
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          ← Retour aux notes
        </Link>

        <h1 className="mt-3 text-2xl font-bold text-slate-900">
          Nouvelle note
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Ajouter une note à un projet.
        </p>
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
            disabled={loadingProjets}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-slate-500"
          >
            <option value="">
              {loadingProjets
                ? "Chargement des projets..."
                : "Sélectionner un projet"}
            </option>

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
            placeholder="Écrire la note..."
            className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500"
          />
        </div>

        <div className="flex justify-end gap-3">
          <Link
            to="/notes"
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Annuler
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? "Enregistrement..." : "Créer la note"}
          </button>
        </div>
      </form>
    </div>
  );
}