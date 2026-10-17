import { useEffect, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function UploadPhoto() {
  const navigate = useNavigate();

  const [projets, setProjets] = useState([]);

  const [form, setForm] = useState({
    projet_id: "",
    nom: "",
    description: "",
    image: null,
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

    if (name === "image") {
      setForm((current) => ({
        ...current,
        image: files[0] || null,
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

    if (!form.projet_id) {
      alert("Veuillez sélectionner un projet.");
      return;
    }

    if (!form.image) {
      alert("Veuillez sélectionner une photo.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("projet_id", form.projet_id);
      formData.append("nom", form.nom);
      formData.append("description", form.description);
      formData.append("image", form.image);

      await api.post("/photos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Photo ajoutée avec succès.");

      navigate("/photos");
    } catch (error) {
      console.error("Erreur upload photo :", error);

      const message =
        error.response?.data?.message ||
        "Erreur lors de l'ajout de la photo.";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6 p-6">

      <div className="flex items-center gap-4">

        <Link
          to="/photos"
          className="rounded-lg border border-slate-200 p-2 hover:bg-slate-100"
        >
          <ArrowLeft size={18} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Ajouter une photo
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Ajouter une photo à un projet
          </p>
        </div>

      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-slate-200 bg-white p-6"
      >

        {/* Projet */}
        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Projet
          </label>

          <select
            name="projet_id"
            value={form.projet_id}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-3"
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

        {/* Nom */}
        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Nom de la photo
          </label>

          <input
            type="text"
            name="nom"
            value={form.nom}
            onChange={handleChange}
            required
            placeholder="Ex: Terrain avant intervention"
            className="w-full rounded-lg border border-slate-300 px-4 py-3"
          />

        </div>

        {/* Description */}
        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Description
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            placeholder="Description de la photo..."
            className="w-full rounded-lg border border-slate-300 px-4 py-3"
          />

        </div>

        {/* Image */}
        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Photo
          </label>

          <input
            type="file"
            name="image"
            onChange={handleChange}
            required
            accept=".jpg,.jpeg,.png,.webp"
            className="w-full rounded-lg border border-slate-300 px-4 py-3"
          />

          <p className="mt-2 text-xs text-slate-500">
            JPG, JPEG, PNG ou WEBP — maximum 10 MB.
          </p>

        </div>

        {/* Prévisualisation */}
        {form.image && (
          <div className="overflow-hidden rounded-xl border border-slate-200">

            <img
              src={URL.createObjectURL(form.image)}
              alt="Prévisualisation"
              className="max-h-80 w-full object-contain bg-slate-50"
            />

          </div>
        )}

        {/* Boutons */}
        <div className="flex justify-end gap-3">

          <Link
            to="/photos"
            className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700"
          >
            Annuler
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
          >

            <Upload size={18} />

            {loading
              ? "Upload en cours..."
              : "Ajouter la photo"}

          </button>

        </div>

      </form>

    </div>
  );
}