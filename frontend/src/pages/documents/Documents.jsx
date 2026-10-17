import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Download, Eye, Plus, Trash2 } from "lucide-react";
import api from "../../services/api";

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDocuments = async () => {
    try {
      const response = await api.get("/documents");

      setDocuments(response.data.data || []);
    } catch (error) {
      console.error(error);
      alert("Erreur lors du chargement des documents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer ce document ?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/documents/${id}`);

      setDocuments((current) =>
        current.filter((document) => document.id !== id)
      );
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression.");
    }
  };

  const handleDownload = async (document) => {
    try {
      const response = await api.get(
        `/documents/${document.id}/download`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = window.document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        `${document.nom}.${document.type}`
      );

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
        Chargement des documents...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Documents
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Gestion des documents des projets
          </p>
        </div>

        <Link
          to="/documents/upload"
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          <Plus size={18} />
          Ajouter un document
        </Link>

      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="bg-slate-50">

              <tr>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                  Document
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                  Type
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                  Projet
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                  Date
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-slate-500">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {documents.map((document) => (

                <tr key={document.id} className="hover:bg-slate-50">

                  <td className="px-6 py-4">

                    <div className="font-medium text-slate-900">
                      {document.nom}
                    </div>

                  </td>

                  <td className="px-6 py-4">

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {document.type}
                    </span>

                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">

                    {document.projet ? (
                      <>
                        <div className="font-medium text-slate-800">
                          {document.projet.nom}
                        </div>

                        <div className="text-xs text-slate-500">
                          {document.projet.reference}
                        </div>
                      </>
                    ) : (
                      "-"
                    )}

                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {document.date || "-"}
                  </td>

                  <td className="px-6 py-4">

                    <div className="flex justify-end gap-2">

                      <Link
                        to={`/documents/${document.id}`}
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                        title="Voir"
                      >
                        <Eye size={17} />
                      </Link>

                      <button
                        onClick={() => handleDownload(document)}
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                        title="Télécharger"
                      >
                        <Download size={17} />
                      </button>

                      <button
                        onClick={() => handleDelete(document.id)}
                        className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
                        title="Supprimer"
                      >
                        <Trash2 size={17} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

              {documents.length === 0 && (

                <tr>

                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-sm text-slate-500"
                  >
                    Aucun document trouvé.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}