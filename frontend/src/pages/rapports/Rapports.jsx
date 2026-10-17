import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Download,
  Eye,
  FileText,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import api from "../../services/api";

export default function Rapports() {
  const [rapports, setRapports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadRapports = async () => {
    try {
      setLoading(true);

      const response = await api.get("/rapports");

      setRapports(response.data.data || []);
    } catch (error) {
      console.error("Erreur chargement rapports :", error);
      alert("Impossible de charger les rapports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRapports();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer ce rapport ?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/rapports/${id}`);

      setRapports((current) =>
        current.filter((rapport) => rapport.id !== id)
      );
    } catch (error) {
      console.error("Erreur suppression rapport :", error);
      alert("Impossible de supprimer le rapport.");
    }
  };

 const handleDownload = async (rapport) => {
  try {
    const response = await api.get(
      `/rapports/${rapport.id}/download`,
      {
        responseType: "blob",
      }
    );

    const contentType =
      response.headers["content-type"] || "";

    // Laravel error
    if (contentType.includes("application/json")) {
      const text = await response.data.text();

      let errorData;

      try {
        errorData = JSON.parse(text);
      } catch {
        errorData = null;
      }

      console.error(
        "Erreur Laravel :",
        errorData
      );

      alert(
        errorData?.message ||
          "Erreur lors du téléchargement."
      );

      return;
    }

    const filename =
      rapport.fichier?.split("/").pop() ||
      "rapport";

    const blob = new Blob(
      [response.data],
      {
        type:
          contentType ||
          "application/octet-stream",
      }
    );

    const url =
      window.URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);

    link.click();

    link.remove();

    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 1000);

  } catch (error) {
    console.error(
      "Erreur téléchargement rapport :",
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

    alert(
      "Impossible de télécharger le fichier."
    );
  }
};

  const filteredRapports = rapports.filter((rapport) => {
    const titre = rapport.titre?.toLowerCase() || "";
    const contenu = rapport.contenu?.toLowerCase() || "";
    const projet = rapport.projet?.nom?.toLowerCase() || "";
    const reference =
      rapport.projet?.reference?.toLowerCase() || "";
    const createur =
      rapport.createur?.name?.toLowerCase() || "";

    const value = search.toLowerCase();

    return (
      titre.includes(value) ||
      contenu.includes(value) ||
      projet.includes(value) ||
      reference.includes(value) ||
      createur.includes(value)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Rapports
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Gestion des rapports des projets.
          </p>
        </div>

        <Link
          to="/rapports/create"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          <Plus size={18} />
          Nouveau rapport
        </Link>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un rapport, projet ou auteur..."
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-slate-500"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Chargement...
          </div>
        ) : filteredRapports.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Aucun rapport trouvé.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Rapport
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Projet
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Auteur
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Date
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Fichier
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredRapports.map((rapport) => (
                  <tr
                    key={rapport.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-slate-100 p-2">
                          <FileText size={18} />
                        </div>

                        <div>
                          <div className="font-medium text-slate-900">
                            {rapport.titre}
                          </div>

                          <div className="max-w-xs truncate text-xs text-slate-500">
                            {rapport.contenu}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">
                        {rapport.projet?.nom || "-"}
                      </div>

                      <div className="text-xs text-slate-500">
                        {rapport.projet?.reference || "-"}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700">
                      {rapport.createur?.name || "-"}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {rapport.date
                        ? new Date(
                            rapport.date
                          ).toLocaleDateString("fr-FR")
                        : "-"}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {rapport.fichier ? (
                        <span className="font-medium text-emerald-600">
                          Disponible
                        </span>
                      ) : (
                        <span className="text-slate-400">
                          Aucun fichier
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/rapports/${rapport.id}`}
                          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                          title="Voir"
                        >
                          <Eye size={18} />
                        </Link>

                        <Link
                          to={`/rapports/${rapport.id}/edit`}
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                          title="Modifier"
                        >
                          <Pencil size={18} />
                        </Link>

                        {rapport.fichier && (
                          <button
                            onClick={() =>
                              handleDownload(rapport)
                            }
                            className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50"
                            title="Télécharger"
                          >
                            <Download size={18} />
                          </button>
                        )}

                        <button
                          onClick={() =>
                            handleDelete(rapport.id)
                          }
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}