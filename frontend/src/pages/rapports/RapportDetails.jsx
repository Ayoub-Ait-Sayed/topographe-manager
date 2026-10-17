import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Download,
  Pencil,
  Trash2,
} from "lucide-react";
import api from "../../services/api";

export default function RapportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rapport, setRapport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const loadRapport = async () => {
      try {
        const response = await api.get(`/rapports/${id}`);

        console.log("Rapport chargé :", response.data);

        setRapport(response.data.data);
      } catch (error) {
        console.error(
          "Erreur chargement rapport :",
          error
        );

        alert("Impossible de charger le rapport.");
      } finally {
        setLoading(false);
      }
    };

    loadRapport();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer ce rapport ?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/rapports/${id}`);

      navigate("/rapports");
    } catch (error) {
      console.error(
        "Erreur suppression rapport :",
        error
      );

      alert("Impossible de supprimer le rapport.");
    }
  };

  const handleDownload = async () => {
    if (!rapport?.fichier) {
      alert("Aucun fichier associé à ce rapport.");
      return;
    }

    try {
      setDownloading(true);

      console.log("=================================");
      console.log("       DOWNLOAD RAPPORT");
      console.log("=================================");

      console.log("Rapport ID :", id);
      console.log("Fichier :", rapport.fichier);

      const token = localStorage.getItem("token");

      console.log(
        "Token présent :",
        Boolean(token)
      );

      if (!token) {
        throw new Error(
          "Token d'authentification absent."
        );
      }

      const response = await api.get(
        `/rapports/${id}/download`,
        {
          responseType: "blob",
        }
      );

      console.log(
        "STATUS :",
        response.status
      );

      console.log(
        "CONTENT-TYPE :",
        response.headers["content-type"]
      );

      console.log(
        "CONTENT-LENGTH :",
        response.headers["content-length"]
      );

      console.log(
        "BLOB SIZE :",
        response.data?.size
      );

      console.log(
        "BLOB TYPE :",
        response.data?.type
      );

      if (
        !response.data ||
        response.data.size === 0
      ) {
        throw new Error(
          "Le serveur a retourné un fichier vide."
        );
      }

      /*
       * IMPORTANT
       *
       * Laravel peut retourner un PDF,
       * mais également un JSON d'erreur
       * avec responseType = blob.
       *
       * On vérifie donc le Content-Type.
       */

      const contentType =
        response.headers["content-type"] || "";

      if (
        contentType.includes("application/json")
      ) {
        const text =
          await response.data.text();

        console.error(
          "Réponse JSON Laravel :",
          text
        );

        let message =
          "Erreur lors du téléchargement.";

        try {
          const json = JSON.parse(text);

          message =
            json.message ||
            message;
        } catch {
          // Réponse non JSON
        }

        throw new Error(message);
      }

      const blob = new Blob(
        [response.data],
        {
          type:
            contentType ||
            "application/octet-stream",
        }
      );

      const downloadUrl =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = downloadUrl;

      /*
       * Nom du fichier
       */
      let filename =
        rapport.fichier
          ?.split("/")
          .pop() ||
        "rapport";

      /*
       * Si le nom n'a pas d'extension,
       * on ajoute .pdf.
       */
      if (
        !filename.includes(".")
      ) {
        filename += ".pdf";
      }

      link.download = filename;

      link.style.display = "none";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      setTimeout(() => {
        window.URL.revokeObjectURL(
          downloadUrl
        );
      }, 1000);

      console.log(
        "Fichier téléchargé :",
        filename
      );

      console.log("=================================");
      console.log("       DOWNLOAD SUCCESS");
      console.log("=================================");

    } catch (error) {
      console.error("=================================");
      console.error("       DOWNLOAD ERROR");
      console.error("=================================");

      console.error(
        "Erreur complète :",
        error
      );

      console.error(
        "Message :",
        error.message
      );

      console.error(
        "Status :",
        error.response?.status
      );

      console.error(
        "Headers :",
        error.response?.headers
      );

      console.error(
        "Data :",
        error.response?.data
      );

      /*
       * Laravel retourne souvent une erreur
       * JSON sous forme de Blob à cause de
       * responseType: "blob".
       */
      if (
        error.response?.data instanceof Blob
      ) {
        try {
          const text =
            await error.response.data.text();

          console.error(
            "Laravel response :",
            text
          );

          try {
            const json =
              JSON.parse(text);

            console.error(
              "Laravel JSON :",
              json
            );

            if (json.message) {
              alert(
                `Erreur téléchargement : ${json.message}`
              );
              return;
            }
          } catch {
            // Ce n'est pas du JSON
          }

        } catch (blobError) {
          console.error(
            "Impossible de lire le Blob Laravel :",
            blobError
          );
        }
      }

      if (
        error.response?.status === 401
      ) {
        alert(
          "Session expirée. Veuillez vous reconnecter."
        );
      } else if (
        error.response?.status === 403
      ) {
        alert(
          "Vous n'avez pas l'autorisation de télécharger ce fichier."
        );
      } else if (
        error.response?.status === 404
      ) {
        alert(
          "Le fichier du rapport est introuvable."
        );
      } else if (
        error.response?.status >= 500
      ) {
        alert(
          "Erreur serveur Laravel lors du téléchargement."
        );
      } else {
        alert(
          error.message ||
          "Impossible de télécharger le fichier."
        );
      }

    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-sm text-slate-500">
        Chargement...
      </div>
    );
  }

  if (!rapport) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        Rapport introuvable.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">

      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>

          <Link
            to="/rapports"
            className="text-sm text-slate-500 hover:text-slate-900"
          >
            ← Retour aux rapports
          </Link>

          <h1 className="mt-3 text-2xl font-bold text-slate-900">
            {rapport.titre}
          </h1>

        </div>

        <div className="flex flex-wrap gap-2">

          {/* MODIFIER */}
          <Link
            to={`/rapports/${id}/edit`}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Pencil size={17} />
            Modifier
          </Link>

          {/* TELECHARGER */}
          {rapport.fichier && (
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={17} />

              {downloading
                ? "Téléchargement..."
                : "Télécharger"}
            </button>
          )}

          {/* SUPPRIMER */}
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
          >
            <Trash2 size={17} />
            Supprimer
          </button>

        </div>
      </div>

      {/* INFORMATIONS */}
      <div className="grid gap-6 md:grid-cols-3">

        {/* PROJET */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          <p className="text-xs font-semibold uppercase text-slate-500">
            Projet
          </p>

          <p className="mt-2 font-semibold text-slate-900">
            {rapport.projet?.nom || "-"}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {rapport.projet?.reference || "-"}
          </p>

        </div>

        {/* AUTEUR */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          <p className="text-xs font-semibold uppercase text-slate-500">
            Auteur
          </p>

          <p className="mt-2 font-semibold text-slate-900">
            {rapport.createur?.name || "-"}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {rapport.createur?.email || "-"}
          </p>

        </div>

        {/* DATE */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          <p className="text-xs font-semibold uppercase text-slate-500">
            Date
          </p>

          <p className="mt-2 font-semibold text-slate-900">
            {rapport.date
              ? new Date(
                  rapport.date
                ).toLocaleDateString(
                  "fr-FR"
                )
              : "-"}
          </p>

        </div>

      </div>

      {/* CONTENU */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Contenu du rapport
        </h2>

        <div className="whitespace-pre-wrap rounded-lg bg-slate-50 p-6 text-sm leading-7 text-slate-700">
          {rapport.contenu}
        </div>

      </div>

      {/* FICHIER */}
      {rapport.fichier && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-3 text-lg font-semibold text-slate-900">
            Fichier
          </h2>

          <div className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 p-4">

            <div className="min-w-0">

              <p className="truncate text-sm font-medium text-slate-800">
                {rapport.fichier
                  .split("/")
                  .pop()}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Fichier associé au rapport
              </p>

            </div>

            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="shrink-0 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >

              <Download size={16} />

              {downloading
                ? "Téléchargement..."
                : "Télécharger"}

            </button>

          </div>

        </div>
      )}

    </div>
  );
}

