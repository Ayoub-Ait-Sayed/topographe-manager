import { useEffect, useState } from "react";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";

export default function DocumentDetails() {
  const { id } = useParams();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDocument = async () => {
      try {
        const response = await api.get(`/documents/${id}`);

        setDocument(response.data.data);
      } catch (error) {
        console.error(error);
        alert("Erreur lors du chargement du document.");
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [id]);

  const handleDownload = async () => {
    try {
      const response = await api.get(
        `/documents/${id}/download`,
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
        Chargement...
      </div>
    );
  }

  if (!document) {
    return (
      <div className="p-6">
        Document introuvable.
      </div>
    );
  }

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
            {document.nom}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Détails du document
          </p>
        </div>

      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">

        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">

          <div className="rounded-xl bg-slate-100 p-4">
            <FileText size={32} className="text-slate-600" />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              {document.nom}
            </h2>

            <p className="text-sm text-slate-500">
              Format : {document.type}
            </p>
          </div>

        </div>

        <div className="grid gap-6 py-6 md:grid-cols-2">

          <div>
            <p className="text-xs uppercase text-slate-400">
              Projet
            </p>

            <p className="mt-1 font-medium text-slate-800">
              {document.projet?.nom || "-"}
            </p>

            <p className="text-sm text-slate-500">
              {document.projet?.reference || ""}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase text-slate-400">
              Date
            </p>

            <p className="mt-1 font-medium text-slate-800">
              {document.date || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase text-slate-400">
              Ajouté par
            </p>

            <p className="mt-1 font-medium text-slate-800">
              {document.uploader?.name || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase text-slate-400">
              Type
            </p>

            <p className="mt-1 font-medium text-slate-800">
              {document.type}
            </p>
          </div>

        </div>

        <div className="flex justify-end border-t border-slate-100 pt-6">

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
  );
}