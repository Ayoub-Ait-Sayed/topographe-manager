import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  BriefcaseBusiness,
} from "lucide-react";
import api from "../../services/api";

const statusLabels = {
  en_attente: "En attente",
  en_cours: "En cours",
  termine: "Terminée",
  annule: "Annulée",
};

const statusClasses = {
  en_attente: "bg-amber-100 text-amber-700",
  en_cours: "bg-blue-100 text-blue-700",
  termine: "bg-emerald-100 text-emerald-700",
  annule: "bg-red-100 text-red-700",
};

export default function Missions() {
  const [missions, setMissions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadMissions = async () => {
    try {
      setLoading(true);

      const response = await api.get("/missions");

      setMissions(response.data.data || []);
    } catch (error) {
      console.error(error);
      alert("Impossible de récupérer les missions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMissions();
  }, []);

  const filteredMissions = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) {
      return missions;
    }

    return missions.filter((mission) => {
      return (
        mission.titre?.toLowerCase().includes(value) ||
        mission.statut?.toLowerCase().includes(value) ||
        mission.projet?.nom?.toLowerCase().includes(value) ||
        mission.projet?.reference?.toLowerCase().includes(value)
      );
    });
  }, [missions, search]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cette mission ?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/missions/${id}`);

      setMissions((current) =>
        current.filter((mission) => mission.id !== id)
      );
    } catch (error) {
      console.error(error);
      alert("Impossible de supprimer la mission.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-900 p-3 text-white">
              <BriefcaseBusiness size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Missions
              </h1>

              <p className="text-sm text-slate-500">
                Gestion des missions topographiques
              </p>
            </div>
          </div>
        </div>

        <Link
          to="/missions/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus size={18} />
          Nouvelle mission
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher une mission..."
            className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none focus:border-slate-400"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-slate-500">
            Chargement...
          </div>
        ) : filteredMissions.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            Aucune mission trouvée.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Mission
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Projet
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Début
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Fin
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Statut
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredMissions.map((mission) => (
                  <tr
                    key={mission.id}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">
                        {mission.titre}
                      </p>

                      <p className="text-sm text-slate-500">
                        #{mission.id}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">
                        {mission.projet?.nom || "—"}
                      </p>

                      <p className="text-sm text-slate-500">
                        {mission.projet?.reference || "—"}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {mission.date_debut || "—"}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {mission.date_fin || "—"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          statusClasses[mission.statut] ||
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {statusLabels[mission.statut] ||
                          mission.statut}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/missions/${mission.id}`}
                          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                          title="Voir"
                        >
                          <Eye size={18} />
                        </Link>

                        <Link
                          to={`/missions/${mission.id}/edit`}
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                          title="Modifier"
                        >
                          <Pencil size={18} />
                        </Link>

                        <button
                          onClick={() => handleDelete(mission.id)}
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

