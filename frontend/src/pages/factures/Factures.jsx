import { useEffect, useState } from "react";
import {
  Eye,
  FileText,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const statutLabels = {
  impayée: "Impayée",
  partiellement_payée: "Partiellement payée",
  payée: "Payée",
  annulée: "Annulée",
};

const statutClasses = {
  impayée: "bg-red-100 text-red-700",
  partiellement_payée: "bg-amber-100 text-amber-700",
  payée: "bg-emerald-100 text-emerald-700",
  annulée: "bg-slate-100 text-slate-700",
};

export default function Factures() {
  const [factures, setFactures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadFactures = async () => {
    try {
      setLoading(true);

      const response = await api.get("/factures");

      const data = response.data.data;

      setFactures(
        Array.isArray(data)
          ? data
          : data?.data || []
      );
    } catch (error) {
      console.error("Erreur chargement factures :", error);
      alert("Impossible de charger les factures.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFactures();
  }, []);

  const handleDelete = async (facture) => {
    const confirmed = window.confirm(
      `Voulez-vous supprimer la facture ${facture.numero} ?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/factures/${facture.id}`);

      setFactures((current) =>
        current.filter(
          (item) => item.id !== facture.id
        )
      );
    } catch (error) {
      console.error("Erreur suppression :", error);
      alert("Impossible de supprimer la facture.");
    }
  };

  const formatMoney = (value) => {
    return (
      Number(value || 0).toLocaleString("fr-FR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + " DH"
    );
  };

  const filteredFactures = factures.filter((facture) => {
    const value = search.toLowerCase();

    return (
      facture.numero?.toLowerCase().includes(value) ||
      facture.client?.nom?.toLowerCase().includes(value) ||
      facture.client?.entreprise
        ?.toLowerCase()
        .includes(value) ||
      facture.projet?.nom?.toLowerCase().includes(value) ||
      facture.projet?.reference
        ?.toLowerCase()
        .includes(value)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Factures
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Gestion des factures
          </p>
        </div>

        <Link
          to="/factures/create"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          <Plus size={18} />
          Nouvelle facture
        </Link>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Rechercher une facture..."
            className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Chargement...
          </div>
        ) : filteredFactures.length === 0 ? (
          <div className="p-8 text-center">
            <FileText
              size={40}
              className="mx-auto text-slate-300"
            />

            <p className="mt-3 text-sm text-slate-500">
              Aucune facture trouvée.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Facture
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
                    TTC
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Statut
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredFactures.map((facture) => (
                  <tr
                    key={facture.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">
                        {facture.numero}
                      </div>

                      <div className="mt-1 text-xs text-slate-500">
                        ID #{facture.id}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">
                        {facture.client?.nom || "-"}
                      </div>

                      {facture.client?.entreprise && (
                        <div className="mt-1 text-xs text-slate-500">
                          {facture.client.entreprise}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">
                        {facture.projet?.nom || "-"}
                      </div>

                      <div className="mt-1 text-xs text-slate-500">
                        {facture.projet?.reference || ""}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700">
                      {facture.date
                        ? new Date(
                            facture.date
                          ).toLocaleDateString("fr-FR")
                        : "-"}
                    </td>

                    <td className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                      {formatMoney(
                        facture.montant_ttc
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${
                          statutClasses[
                            facture.statut
                          ] ||
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {statutLabels[
                          facture.statut
                        ] || facture.statut}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1">
                        <Link
                          to={`/factures/${facture.id}`}
                          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                          title="Voir"
                        >
                          <Eye size={18} />
                        </Link>

                        <Link
                          to={`/factures/${facture.id}/edit`}
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                          title="Modifier"
                        >
                          <Pencil size={18} />
                        </Link>

                        <button
                          onClick={() =>
                            handleDelete(facture)
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