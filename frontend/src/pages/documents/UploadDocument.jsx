import { useEffect, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function UploadDocument() {
  const navigate = useNavigate();

  const [projets, setProjets] = useState([]);

  const [form, setForm] = useState({
    nom: "",
    projet_id: "",
    date: "",
    fichier: null,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProjets = async () => {
      try {
        const response = await api.get("/projets");

        setProjets(response.data.data || []);
      } catch (error) {
        console.error(error);
        alert("Erreur lors du chargement des projets.");
      }
    };

    loadProjets();
  }, []);

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    if (name === "fichier") {
      setForm((current) => ({
        ...current,
        fichier: files[0] || null,
      }));

      return;
    }

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.fichier) {
      alert("Veuillez sélectionner un fichier.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("nom", form.nom);
      formData.append("projet_id", form.projet_id);
      formData.append("date", form.date);
      formData.append("fichier", form.fichier);

      await api.post("/documents", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/documents");
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.message ||
        "Erreur lors de l'ajout du document.";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6 p-6">

      <div className="flex items-center gap-4">

        <Link
          to="/documents"
          className="rounded-lg border border-slate-200 p-2 hover:bg-slate-100"
        >
          <ArrowLeft size={18} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Ajouter un document
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Télécharger un document lié à un projet
          </p>
        </div>

      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-slate-200 bg-white p-6"
      >

        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Nom du document
          </label>

          <input
            type="text"
            name="nom"
            value={form.nom}
            onChange={handleChange}
            required
            placeholder="Ex: Plan topographique"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
          />

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Projet
          </label>

          <select
            name="projet_id"
            value={form.projet_id}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
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
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
          />

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Fichier
          </label>

          <input
            type="file"
            name="fichier"
            onChange={handleChange}
            required
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            className="w-full rounded-lg border border-slate-300 px-4 py-3"
          />

          <p className="mt-2 text-xs text-slate-500">
            Formats acceptés : PDF, Word, Excel, JPG, PNG — maximum 10 MB.
          </p>

        </div>

        <div className="flex justify-end gap-3">

          <Link
            to="/documents"
            className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Annuler
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
          >

            <Upload size={18} />

            {loading
              ? "Upload en cours..."
              : "Ajouter le document"}

          </button>

        </div>

      </form>

    </div>
  );
}