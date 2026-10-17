import { useEffect, useMemo, useState } from "react";
import {
  CreditCard,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const modeLabels = {
  especes: "Espèces",
  cheque: "Chèque",
  virement: "Virement",
  carte: "Carte",
  autre: "Autre",
};

const formatMoney = (value) => {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));
};

export default function Paiements() {
  const [paiements, setPaiements] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPaiements = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/paiements");

      const data = response.data.data;

      setPaiements(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Impossible de récupérer les paiements."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPaiements();
  }, []);

  const filteredPaiements = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return paiements;
    }

    return paiements.filter((paiement) => {
      const factureNumero =
        paiement.facture?.numero?.toLowerCase() || "";

      const reference =
        paiement.reference?.toLowerCase() || "";

      const mode =
        modeLabels[paiement.mode_paiement]
          ?.toLowerCase() || "";

      return (
        factureNumero.includes(value) ||
        reference.includes(value) ||
        mode.includes(value)
      );
    });
  }, [paiements, search]);

  const handleDelete = async (paiement) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer ce paiement ?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/paiements/${paiement.id}`);

      await loadPaiements();
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Impossible de supprimer le paiement."
      );
    }
  };

  return (
    <div className="space-y-6">

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Paiements
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Gestion des paiements des factures.
          </p>
        </div>

        <Link
          to="/paiements/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <Plus size={18} />
          Nouveau paiement
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
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par facture, référence ou mode..."
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-slate-400"
          />

        </div>

      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Chargement...
          </div>
        ) : filteredPaiements.length === 0 ? (
          <div className="p-8 text-center">

            <CreditCard
              size={40}
              className="mx-auto text-slate-300"
            />

            <p className="mt-3 text-sm text-slate-500">
              Aucun paiement trouvé.
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="border-b border-slate-200 bg-slate-50">

                <tr>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Facture
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Montant
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Date
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Mode
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Référence
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase text-slate-500">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredPaiements.map((paiement) => (

                  <tr
                    key={paiement.id}
                    className="hover:bg-slate-50"
                  >

                    <td className="px-5 py-4">

                      <div className="font-semibold text-slate-900">
                        {paiement.facture?.numero ||
                          `Facture #${paiement.facture_id}`}
                      </div>

                    </td>

                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {formatMoney(paiement.montant)}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {paiement.date || "-"}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {modeLabels[paiement.mode_paiement] ||
                        paiement.mode_paiement}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {paiement.reference || "-"}
                    </td>

                    <td className="px-5 py-4">

                      <div className="flex justify-end gap-2">

                        <Link
                          to={`/paiements/${paiement.id}`}
                          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                          title="Voir"
                        >
                          <Eye size={18} />
                        </Link>

                        <Link
                          to={`/paiements/${paiement.id}/edit`}
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                          title="Modifier"
                        >
                          <Pencil size={18} />
                        </Link>

                        <button
                          onClick={() =>
                            handleDelete(paiement)
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