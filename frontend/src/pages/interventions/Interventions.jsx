import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserRound,
} from "lucide-react";

import api from "../../services/api";

const statutLabels = {
  planifiee: "Planifiée",
  en_cours: "En cours",
  terminee: "Terminée",
  annulee: "Annulée",
};

const statutClasses = {
  planifiee: "bg-blue-100 text-blue-700",
  en_cours: "bg-amber-100 text-amber-700",
  terminee: "bg-emerald-100 text-emerald-700",
  annulee: "bg-red-100 text-red-700",
};

export default function Interventions() {
  const [interventions, setInterventions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadInterventions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/interventions");

      setInterventions(response.data.data || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Impossible de récupérer les interventions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterventions();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cette intervention ?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/interventions/${id}`);

      setInterventions((current) =>
        current.filter((intervention) => intervention.id !== id)
      );
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Impossible de supprimer l’intervention."
      );
    }
  };

  const filteredInterventions = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return interventions;
    }

    return interventions.filter((intervention) => {
      const values = [
        intervention.projet?.reference,
        intervention.projet?.nom,
        intervention.projet?.ville,
        intervention.technicien?.name,
        intervention.technicien?.email,
        intervention.description,
        intervention.statut,
        statutLabels[intervention.statut],
        intervention.date,
      ];

      return values.some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(term)
      );
    });
  }, [interventions, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Interventions
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Planifiez et gérez les interventions sur le terrain.
          </p>
        </div>

        <Link
          to="/interventions/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus size={18} />
          Nouvelle intervention
        </Link>
      </div>

      {/* Search */}
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
            placeholder="Rechercher par projet, technicien, date, statut..."
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-64 items-center justify-center text-sm text-slate-500">
            Chargement des interventions...
          </div>
        ) : filteredInterventions.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
            <CalendarDays size={42} className="text-slate-300" />

            <h3 className="mt-4 font-semibold text-slate-900">
              Aucune intervention
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Créez une nouvelle intervention pour commencer.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Projet
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Technicien
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Date
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Horaires
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Statut
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredInterventions.map((intervention) => (
                  <tr
                    key={intervention.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {intervention.projet?.nom || "Projet"}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {intervention.projet?.reference || "-"}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                          <UserRound
                            size={15}
                            className="text-slate-500"
                          />
                        </div>

                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {intervention.technicien?.name || "-"}
                          </p>

                          <p className="text-xs text-slate-500">
                            {intervention.technicien?.email || ""}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <CalendarDays size={16} />
                        {intervention.date || "-"}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <Clock size={16} />

                        <span>
                          {intervention.heure_debut || "--:--"} -{" "}
                          {intervention.heure_fin || "--:--"}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          statutClasses[intervention.statut] ||
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {statutLabels[intervention.statut] ||
                          intervention.statut}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/interventions/${intervention.id}`}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                          title="Voir"
                        >
                          <Eye size={17} />
                        </Link>

                        <Link
                          to={`/interventions/${intervention.id}/edit`}
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                          title="Modifier"
                        >
                          <Pencil size={17} />
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(intervention.id)
                          }
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                          title="Supprimer"
                        >
                          <Trash2 size={17} />
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