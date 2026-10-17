import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Edit,
  Eye,
  MapPin,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import api from "../../services/api";

export default function Projets() {
  const [projets, setProjets] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProjets = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/projets");

      const result = response.data;

      if (Array.isArray(result?.data)) {
        setProjets(result.data);
      } else if (Array.isArray(result)) {
        setProjets(result);
      } else {
        setProjets([]);
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Impossible de récupérer les projets."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjets();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer ce projet ?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/projets/${id}`);

      setProjets((current) =>
        current.filter((projet) => projet.id !== id)
      );
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Impossible de supprimer le projet."
      );
    }
  };

  const filteredProjets = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) {
      return projets;
    }

    return projets.filter((projet) => {
      const reference = projet.reference || "";
      const nom = projet.nom || "";
      const ville = projet.ville || "";
      const clientNom =
        projet.client?.nom ||
        projet.client?.name ||
        "";

      return (
        reference.toLowerCase().includes(keyword) ||
        nom.toLowerCase().includes(keyword) ||
        ville.toLowerCase().includes(keyword) ||
        clientNom.toLowerCase().includes(keyword)
      );
    });
  }, [projets, search]);

  const getStatusStyle = (statut) => {
    switch (statut) {
      case "en_attente":
        return "bg-amber-100 text-amber-700";

      case "en_cours":
        return "bg-blue-100 text-blue-700";

      case "termine":
        return "bg-emerald-100 text-emerald-700";

      case "annule":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusLabel = (statut) => {
    switch (statut) {
      case "en_attente":
        return "En attente";

      case "en_cours":
        return "En cours";

      case "termine":
        return "Terminé";

      case "annule":
        return "Annulé";

      default:
        return statut || "-";
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("fr-FR");
  };

  const formatAmount = (amount) => {
    if (amount === null || amount === undefined || amount === "") {
      return "-";
    }

    return `${Number(amount).toLocaleString("fr-FR")} DH`;
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Projets
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Gestion des projets topographiques
          </p>
        </div>

        <Link
          to="/projets/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus size={18} />
          Nouveau projet
        </Link>
      </div>

      {/* SEARCH */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un projet..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
          />
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-60 items-center justify-center">
            <p className="text-sm text-slate-500">
              Chargement des projets...
            </p>
          </div>
        ) : filteredProjets.length === 0 ? (
          <div className="flex min-h-60 flex-col items-center justify-center px-6 text-center">
            <p className="font-semibold text-slate-800">
              Aucun projet trouvé
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Créez votre premier projet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Projet
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Client
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Localisation
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Dates
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Statut
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Montant
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredProjets.map((projet) => (
                  <tr
                    key={projet.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {projet.nom}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {projet.reference || "Sans référence"}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm text-slate-700">
                        {projet.client?.nom ||
                          projet.client?.name ||
                          "-"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin size={16} />

                        <span>
                          {projet.ville ||
                            projet.adresse ||
                            "-"}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="text-sm text-slate-600">
                        <p>
                          {formatDate(projet.date_debut)}
                        </p>

                        {projet.date_fin && (
                          <p className="text-xs text-slate-400">
                            → {formatDate(projet.date_fin)}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                          projet.statut
                        )}`}
                      >
                        {getStatusLabel(projet.statut)}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-slate-700">
                      {formatAmount(projet.montant)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/projets/${projet.id}`}
                          title="Voir"
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                          <Eye size={17} />
                        </Link>

                        <Link
                          to={`/projets/${projet.id}/edit`}
                          title="Modifier"
                          className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                        >
                          <Edit size={17} />
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(projet.id)
                          }
                          title="Supprimer"
                          className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
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