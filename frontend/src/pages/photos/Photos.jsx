import { useEffect, useState } from "react";
import {
  Download,
  Eye,
  Image as ImageIcon,
  Plus,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function Photos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);
  const [deleting, setDeleting] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | Charger les photos
  |--------------------------------------------------------------------------
  */

  const loadPhotos = async () => {
    try {
      setLoading(true);

      const response = await api.get("/photos");

      setPhotos(response.data.data || []);
    } catch (error) {
      console.error(
        "Erreur lors du chargement des photos :",
        error
      );

      alert("Erreur lors du chargement des photos.");
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | useEffect
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadPhotos();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Télécharger une photo
  |--------------------------------------------------------------------------
  */

  const handleDownload = async (photo) => {
    try {
      setDownloading(photo.id);

      const response = await api.get(
        `/photos/${photo.id}/download`,
        {
          responseType: "blob",
        }
      );

      /*
      |--------------------------------------------------------------------------
      | Vérifier le type reçu
      |--------------------------------------------------------------------------
      */

      const contentType =
        response.headers["content-type"] ||
        "application/octet-stream";

      const blob = new Blob(
        [response.data],
        {
          type: contentType,
        }
      );

      /*
      |--------------------------------------------------------------------------
      | Créer URL temporaire
      |--------------------------------------------------------------------------
      */

      const url = window.URL.createObjectURL(blob);

      /*
      |--------------------------------------------------------------------------
      | Créer le nom du fichier
      |--------------------------------------------------------------------------
      */

      let filename = photo.nom || "photo";

      /*
      |--------------------------------------------------------------------------
      | Récupérer extension depuis chemin
      |--------------------------------------------------------------------------
      |
      | Exemple :
      | photos/abc123.jpg
      | => jpg
      |
      */

      const extension = photo.chemin
        ?.split(".")
        .pop()
        ?.toLowerCase();

      /*
      |--------------------------------------------------------------------------
      | Ajouter extension si elle n'existe pas
      |--------------------------------------------------------------------------
      */

      if (
        extension &&
        !filename
          .toLowerCase()
          .endsWith(`.${extension}`)
      ) {
        filename += `.${extension}`;
      }

      /*
      |--------------------------------------------------------------------------
      | Créer le lien
      |--------------------------------------------------------------------------
      */

      const link = document.createElement("a");

      link.href = url;

      link.download = filename;

      document.body.appendChild(link);

      link.click();

      link.remove();

      /*
      |--------------------------------------------------------------------------
      | Libérer URL
      |--------------------------------------------------------------------------
      */

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "Erreur téléchargement photo :",
        error
      );

      console.error(
        "Status :",
        error.response?.status
      );

      console.error(
        "Response :",
        error.response?.data
      );

      alert("Erreur lors du téléchargement.");
    } finally {
      setDownloading(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Supprimer une photo
  |--------------------------------------------------------------------------
  */

  const handleDelete = async (photo) => {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer la photo "${photo.nom}" ?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(photo.id);

      await api.delete(
        `/photos/${photo.id}`
      );

      setPhotos((currentPhotos) =>
        currentPhotos.filter(
          (item) => item.id !== photo.id
        )
      );

      alert("Photo supprimée avec succès.");
    } catch (error) {
      console.error(
        "Erreur suppression photo :",
        error
      );

      const message =
        error.response?.data?.message ||
        "Erreur lors de la suppression.";

      alert(message);
    } finally {
      setDeleting(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-500">
            Chargement des photos...
          </div>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Page
  |--------------------------------------------------------------------------
  */

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Photos
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Gérez les photos de vos projets.
          </p>
        </div>

        <Link
          to="/photos/upload"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />

          Ajouter une photo
        </Link>
      </div>

      {/* Empty state */}
      {photos.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <ImageIcon
              size={30}
              className="text-gray-400"
            />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            Aucune photo
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Vous n'avez encore ajouté aucune photo.
          </p>

          <Link
            to="/photos/upload"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={18} />

            Ajouter une photo
          </Link>
        </div>
      ) : (
        /* Photos grid */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden bg-gray-100">
                {photo.url ? (
                  <img
                    src={photo.url}
                    alt={photo.nom || "Photo"}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                    onError={(event) => {
                      event.currentTarget.style.display =
                        "none";
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <ImageIcon
                      size={42}
                      className="text-gray-400"
                    />
                  </div>
                )}

                {/* Preview button */}
                <Link
                  to={`/photos/${photo.id}`}
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-black/80"
                  title="Voir la photo"
                >
                  <Eye size={18} />
                </Link>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Nom */}
                <h3
                  className="truncate text-sm font-semibold text-gray-900"
                  title={photo.nom}
                >
                  {photo.nom || "Photo sans nom"}
                </h3>

                {/* Projet */}
                {photo.projet && (
                  <p className="mt-1 truncate text-sm text-gray-500">
                    Projet :{" "}
                    <span className="font-medium text-gray-700">
                      {photo.projet.nom}
                    </span>
                  </p>
                )}

                {/* Description */}
                {photo.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                    {photo.description}
                  </p>
                )}

                {/* Actions */}
                <div className="mt-4 flex items-center gap-2">
                  {/* Voir */}
                  <Link
                    to={`/photos/${photo.id}`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    <Eye size={16} />

                    Voir
                  </Link>

                  {/* Download */}
                  <button
                    type="button"
                    onClick={() =>
                      handleDownload(photo)
                    }
                    disabled={
                      downloading === photo.id
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    title="Télécharger"
                  >
                    <Download size={17} />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(photo)
                    }
                    disabled={
                      deleting === photo.id
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    title="Supprimer"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}