import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import api from "../../services/api";

export default function NoteDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNote = async () => {
      try {
        const response = await api.get(`/notes/${id}`);

        setNote(response.data.data);
      } catch (error) {
        console.error("Erreur chargement note :", error);
        alert("Impossible de charger la note.");
      } finally {
        setLoading(false);
      }
    };

    loadNote();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cette note ?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/notes/${id}`);

      navigate("/notes");
    } catch (error) {
      console.error("Erreur suppression note :", error);
      alert("Impossible de supprimer la note.");
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-sm text-slate-500">
        Chargement...
      </div>
    );
  }

  if (!note) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        Note introuvable.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <Link
            to="/notes"
            className="text-sm text-slate-500 hover:text-slate-900"
          >
            ← Retour aux notes
          </Link>

          <h1 className="mt-3 text-2xl font-bold text-slate-900">
            Détail de la note
          </h1>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/notes/${id}/edit`}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Pencil size={17} />
            Modifier
          </Link>

          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
          >
            <Trash2 size={17} />
            Supprimer
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Projet
          </h2>

          <div className="space-y-2">
            <p className="text-sm text-slate-500">
              Référence
            </p>

            <p className="font-medium text-slate-900">
              {note.projet?.reference || "-"}
            </p>

            <p className="pt-2 text-sm text-slate-500">
              Nom
            </p>

            <p className="font-medium text-slate-900">
              {note.projet?.nom || "-"}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Auteur
          </h2>

          <p className="font-medium text-slate-900">
            {note.user?.name || "-"}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {note.user?.email || "-"}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Rôle : {note.user?.role || "-"}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Contenu
        </h2>

        <div className="whitespace-pre-wrap rounded-lg bg-slate-50 p-5 text-sm leading-7 text-slate-700">
          {note.contenu}
        </div>
      </div>

      <div className="text-sm text-slate-500">
        Créée le{" "}
        {note.created_at
          ? new Date(note.created_at).toLocaleString("fr-FR")
          : "-"}
      </div>
    </div>
  );
}