import { useEffect, useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";

export default function PhotoDetails() {
  const { id } = useParams();

  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPhoto = async () => {
      try {
        const response = await api.get(`/photos/${id}`);

        setPhoto(response.data.data);
      } catch (error) {
        console.error(error);
        alert("Erreur lors du chargement de la photo.");
      } finally {
        setLoading(false);
      }
    };

    loadPhoto();
  }, [id]);

  const handleDownload = async () => {
    try {
      const response = await api.get(
        `/photos/${id}/download`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = window.document.createElement("a");

      link.href = url;
      link.download = photo.nom;

      window.document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Erreur lors du téléchargement.");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        Chargement...
      </div>
    );
  }

  if (!photo) {
    return (
      <div className="p-6">
        Photo introuvable.
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-6 p-6">

      <div className="flex items-center gap-4">

        <Link
          to="/photos"
          className="rounded-lg border border-slate-200 p-2 hover:bg-slate-100"
        >
          <ArrowLeft size={18} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {photo.nom}
          </h1>

          <p className="text-sm text-slate-500">
            Détails de la photo
          </p>
        </div>

      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

        <div className="bg-slate-100">

          <img
            src={photo.url}
            alt={photo.nom}
            className="mx-auto max-h-[650px] w-full object-contain"
          />

        </div>

        <div className="p-6">

          <div className="grid gap-6 md:grid-cols-2">

            <div>
              <p className="text-xs uppercase text-slate-400">
                Projet
              </p>

              <p className="mt-1 font-medium text-slate-800">
                {photo.projet?.nom || "-"}
              </p>

              <p className="text-sm text-slate-500">
                {photo.projet?.reference || ""}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase text-slate-400">
                Ajouté par
              </p>

              <p className="mt-1 font-medium text-slate-800">
                {photo.uploader?.name || "-"}
              </p>
            </div>

          </div>

          <div className="mt-6">

            <p className="text-xs uppercase text-slate-400">
              Description
            </p>

            <p className="mt-2 text-sm text-slate-600">
              {photo.description || "Aucune description."}
            </p>

          </div>

          <div className="mt-6 flex justify-end">

            <button
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
            >
              <Download size={18} />
              Télécharger
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}