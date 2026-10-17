import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import api from "../../services/api";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadNotes = async () => {
    try {
      setLoading(true);

      const response = await api.get("/notes");

      setNotes(response.data.data || []);
    } catch (error) {
      console.error("Erreur chargement notes :", error);
      alert("Impossible de charger les notes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cette note ?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/notes/${id}`);

      setNotes((currentNotes) =>
        currentNotes.filter((note) => note.id !== id)
      );
    } catch (error) {
      console.error("Erreur suppression note :", error);
      alert("Impossible de supprimer la note.");
    }
  };

  const filteredNotes = notes.filter((note) => {
    const contenu = note.contenu?.toLowerCase() || "";
    const projetNom = note.projet?.nom?.toLowerCase() || "";
    const projetReference = note.projet?.reference?.toLowerCase() || "";
    const userName = note.user?.name?.toLowerCase() || "";

    const searchValue = search.toLowerCase();

    return (
      contenu.includes(searchValue) ||
      projetNom.includes(searchValue) ||
      projetReference.includes(searchValue) ||
      userName.includes(searchValue)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Notes
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Gestion des notes liées aux projets.
          </p>
        </div>

        <Link
          to="/notes/create"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          <Plus size={18} />
          Nouvelle note
        </Link>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une note, un projet ou un utilisateur..."
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-slate-500"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Chargement...
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Aucune note trouvée.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Projet
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Contenu
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Auteur
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Date
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredNotes.map((note) => (
                  <tr
                    key={note.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">
                        {note.projet?.nom || "Projet supprimé"}
                      </div>

                      <div className="text-xs text-slate-500">
                        {note.projet?.reference || "-"}
                      </div>
                    </td>

                    <td className="max-w-md px-6 py-4">
                      <p className="truncate text-sm text-slate-700">
                        {note.contenu}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-800">
                        {note.user?.name || "-"}
                      </div>

                      <div className="text-xs text-slate-500">
                        {note.user?.role || ""}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {note.created_at
                        ? new Date(note.created_at).toLocaleDateString(
                            "fr-FR"
                          )
                        : "-"}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/notes/${note.id}`}
                          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                          title="Voir"
                        >
                          <Eye size={18} />
                        </Link>

                        <Link
                          to={`/notes/${note.id}/edit`}
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                          title="Modifier"
                        >
                          <Pencil size={18} />
                        </Link>

                        <button
                          onClick={() => handleDelete(note.id)}
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