import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  FileText,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import api from "../../services/api";

const statutLabels = {
  brouillon: "Brouillon",
  envoyé: "Envoyé",
  accepté: "Accepté",
  refusé: "Refusé",
  expiré: "Expiré",
};

const statutClasses = {
  brouillon: "bg-slate-100 text-slate-700",
  envoyé: "bg-blue-100 text-blue-700",
  accepté: "bg-emerald-100 text-emerald-700",
  refusé: "bg-red-100 text-red-700",
  expiré: "bg-amber-100 text-amber-700",
};

export default function Devis() {
  const [devis, setDevis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadDevis = async () => {
    try {
      setLoading(true);

      const response = await api.get("/devis");

      setDevis(response.data.data || []);
    } catch (error) {
      console.error("Erreur chargement devis :", error);
      alert("Impossible de charger les devis.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDevis();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer ce devis ?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/devis/${id}`);

      setDevis((current) =>
        current.filter((devisItem) => devisItem.id !== id)
      );
    } catch (error) {
      console.error("Erreur suppression devis :", error);
      alert("Impossible de supprimer le devis.");
    }
  };

  const filteredDevis = devis.filter((devisItem) => {
    const numero = devisItem.numero?.toLowerCase() || "";
    const client = devisItem.client?.nom?.toLowerCase() || "";
    const entreprise =
      devisItem.client?.entreprise?.toLowerCase() || "";
    const projet = devisItem.projet?.nom?.toLowerCase() || "";
    const reference =
      devisItem.projet?.reference?.toLowerCase() || "";

    const value = search.toLowerCase();

    return (
      numero.includes(value) ||
      client.includes(value) ||
      entreprise.includes(value) ||
      projet.includes(value) ||
      reference.includes(value)
    );
  });

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " DH";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Devis
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Gestion des devis des clients et projets.
          </p>
        </div>

        <Link
          to="/devis/create"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          <Plus size={18} />
          Nouveau devis
        </Link>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par numéro, client ou projet..."
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-slate-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Chargement...
          </div>
        ) : filteredDevis.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Aucun devis trouvé.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Devis
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Client
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Projet
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Date
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-slate-500">
                    Montant TTC
                  </th>

                  <th className="px-6 py-4 text-center text-xs font-semibold uppercase text-slate-500">
                    Statut
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredDevis.map((devisItem) => (
                  <tr
                    key={devisItem.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >
                    {/* Numéro */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-slate-100 p-2">
                          <FileText size={18} />
                        </div>

                        <div>
                          <div className="font-medium text-slate-900">
                            {devisItem.numero}
                          </div>

                          <div className="text-xs text-slate-500">
                            Validité : {devisItem.validite || "-"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Client */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">
                        {devisItem.client?.nom || "-"}
                      </div>

                      {devisItem.client?.entreprise && (
                        <div className="text-xs text-slate-500">
                          {devisItem.client.entreprise}
                        </div>
                      )}
                    </td>

                    {/* Projet */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">
                        {devisItem.projet?.nom || "-"}
                      </div>

                      <div className="text-xs text-slate-500">
                        {devisItem.projet?.reference || "-"}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {devisItem.date
                        ? new Date(
                            devisItem.date
                          ).toLocaleDateString("fr-FR")
                        : "-"}
                    </td>

                    {/* TTC */}
                    <td className="px-6 py-4 text-right">
                      <span className="font-semibold text-slate-900">
                        {formatMoney(devisItem.montant_ttc)}
                      </span>
                    </td>

                    {/* Statut */}
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          statutClasses[devisItem.statut] ||
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {statutLabels[devisItem.statut] ||
                          devisItem.statut ||
                          "-"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/devis/${devisItem.id}`}
                          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                          title="Voir"
                        >
                          <Eye size={18} />
                        </Link>

                        <Link
                          to={`/devis/${devisItem.id}/edit`}
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                          title="Modifier"
                        >
                          <Pencil size={18} />
                        </Link>

                        <button
                          onClick={() =>
                            handleDelete(devisItem.id)
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