import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function CreateRapport() {
  const navigate = useNavigate();

  const [projets, setProjets] = useState([]);
  const [loadingProjets, setLoadingProjets] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    projet_id: "",
    titre: "",
    contenu: "",
    date: new Date().toISOString().split("T")[0],
    fichier: null,
  });

  useEffect(() => {
    const loadProjets = async () => {
      try {
        setLoadingProjets(true);

        const response = await api.get("/projets");

        const data = response.data?.data || [];

        setProjets(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error(
          "Erreur chargement projets :",
          error
        );

        alert(
          error.response?.data?.message ||
            "Impossible de charger les projets."
        );
      } finally {
        setLoadingProjets(false);
      }
    };

    loadProjets();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "fichier") {
      const file =
        files && files.length > 0
          ? files[0]
          : null;

      console.log(
        "Fichier sélectionné :",
        file
      );

      console.log(
        "Fichier valide :",
        file instanceof File
      );

      setForm((current) => ({
        ...current,
        fichier: file,
      }));

      return;
    }

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.projet_id) {
      alert("Veuillez sélectionner un projet.");
      return;
    }

    if (!form.titre.trim()) {
      alert("Le titre est obligatoire.");
      return;
    }

    if (!form.contenu.trim()) {
      alert("Le contenu est obligatoire.");
      return;
    }

    if (!form.date) {
      alert("La date est obligatoire.");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append(
        "projet_id",
        String(form.projet_id)
      );

      formData.append(
        "titre",
        form.titre.trim()
      );

      formData.append(
        "contenu",
        form.contenu.trim()
      );

      formData.append(
        "date",
        form.date
      );

      /*
       * Le fichier est ajouté uniquement
       * s'il s'agit réellement d'un objet File.
       */
      if (form.fichier instanceof File) {
        formData.append(
          "fichier",
          form.fichier,
          form.fichier.name
        );
      }

      console.log(
        "========== RAPPORT =========="
      );

      console.log(
        "Projet :",
        form.projet_id
      );

      console.log(
        "Titre :",
        form.titre
      );

      console.log(
        "Date :",
        form.date
      );

      console.log(
        "Fichier :",
        form.fichier
      );

      console.log(
        "Fichier instanceof File :",
        form.fichier instanceof File
      );

      console.log(
        "========== FORMDATA =========="
      );

      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(
            key,
            "FILE =>",
            value.name,
            value.type,
            value.size
          );
        } else {
          console.log(
            key,
            "=>",
            value
          );
        }
      }

      const response = await api.post(
        "/rapports",
        formData
      );

      console.log(
        "Réponse serveur :",
        response.data
      );

      alert(
        response.data?.message ||
          "Rapport créé avec succès."
      );

      navigate("/rapports");
    } catch (error) {
      console.error(
        "Erreur création rapport :",
        error
      );

      console.error(
        "Status :",
        error.response?.status
      );

      console.error(
        "Réponse serveur :",
        error.response?.data
      );

      const errors =
        error.response?.data?.errors;

      if (errors) {
        const messages = Object.values(errors)
          .flat()
          .join("\n");

        alert(messages);
      } else {
        alert(
          error.response?.data?.message ||
            "Impossible de créer le rapport."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/rapports"
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          ← Retour aux rapports
        </Link>

        <h1 className="mt-3 text-2xl font-bold text-slate-900">
          Nouveau rapport
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Créer un rapport pour un projet.
        </p>
      </div>

      {/* Formulaire */}
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        {/* Projet + Date */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Projet */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Projet *
            </label>

            <select
              name="projet_id"
              value={form.projet_id}
              onChange={handleChange}
              required
              disabled={loadingProjets || saving}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-500 disabled:bg-slate-100"
            >
              <option value="">
                {loadingProjets
                  ? "Chargement..."
                  : "Sélectionner un projet"}
              </option>

              {projets.map((projet) => (
                <option
                  key={projet.id}
                  value={projet.id}
                >
                  {projet.reference} —{" "}
                  {projet.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Date *
            </label>

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              disabled={saving}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-slate-500 disabled:bg-slate-100"
            />
          </div>
        </div>

        {/* Titre */}
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
            disabled={saving}
            placeholder="Ex : Rapport de levé topographique"
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-slate-500 disabled:bg-slate-100"
          />
        </div>

        {/* Contenu */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Contenu *
          </label>

          <textarea
            name="contenu"
            value={form.contenu}
            onChange={handleChange}
            required
            disabled={saving}
            rows={10}
            placeholder="Écrire le contenu du rapport..."
            className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-500 disabled:bg-slate-100"
          />
        </div>

        {/* Fichier */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Fichier du rapport
          </label>

          <input
            type="file"
            name="fichier"
            accept=".pdf,.doc,.docx,.xls,.xlsx"
            onChange={handleChange}
            disabled={saving}
            className="block w-full rounded-lg border border-slate-300 p-2 text-sm disabled:bg-slate-100"
          />

          <p className="mt-2 text-xs text-slate-500">
            Formats acceptés : PDF, Word, Excel — maximum 10 MB.
          </p>

          {form.fichier instanceof File && (
            <div className="mt-3 rounded-lg bg-slate-50 p-3">
              <p className="text-sm font-medium text-slate-700">
                Fichier sélectionné :
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {form.fichier.name}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {(form.fichier.size / 1024 / 1024).toFixed(
                  2
                )}{" "}
                MB
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
          <Link
            to="/rapports"
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Annuler
          </Link>

          <button
            type="submit"
            disabled={saving || loadingProjets}
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Création..."
              : "Créer le rapport"}
          </button>
        </div>
      </form>
    </div>
  );
}

