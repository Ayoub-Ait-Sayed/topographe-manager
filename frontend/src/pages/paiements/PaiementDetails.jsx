import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CreditCard,
  Pencil,
  Trash2,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
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

export default function PaiementDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [paiement, setPaiement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPaiement = async () => {
      try {
        const response = await api.get(
          `/paiements/${id}`
        );

        setPaiement(response.data.data);
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message ||
            "Impossible de charger le paiement."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPaiement();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer ce paiement ?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/paiements/${id}`);

      navigate("/paiements");
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Impossible de supprimer le paiement."
      );
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-sm text-slate-500">
        Chargement...
      </div>
    );
  }

  if (error || !paiement) {
    return (
      <div className="space-y-4">

        <Link
          to="/paiements"
          className="inline-flex items-center gap-2 text-sm text-slate-600"
        >
          <ArrowLeft size={18} />
          Retour aux paiements
        </Link>

        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error || "Paiement introuvable."}
        </div>

      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div className="flex items-center gap-3">

          <Link
            to="/paiements"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          >
            <ArrowLeft size={20} />
          </Link>

          <div>

            <div className="flex items-center gap-2">

              <CreditCard
                size={22}
                className="text-slate-700"
              />

              <h1 className="text-2xl font-bold text-slate-900">
                Paiement #{paiement.id}
              </h1>

            </div>

            <p className="mt-1 text-sm text-slate-500">
              Détails du paiement.
            </p>

          </div>

        </div>

        <div className="flex gap-2">

          <Link
            to={`/paiements/${paiement.id}/edit`}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Pencil size={17} />
            Modifier
          </Link>

          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
          >
            <Trash2 size={17} />
            Supprimer
          </button>

        </div>

      </div>

      <div className="grid gap-6 md:grid-cols-2">

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-slate-900">
            Informations du paiement
          </h2>

          <div className="mt-5 space-y-4">

            <div>
              <p className="text-xs uppercase text-slate-400">
                Montant
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {formatMoney(paiement.montant)}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase text-slate-400">
                Date
              </p>

              <p className="mt-1 text-sm text-slate-700">
                {paiement.date || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase text-slate-400">
                Mode de paiement
              </p>

              <p className="mt-1 text-sm text-slate-700">
                {modeLabels[paiement.mode_paiement] ||
                  paiement.mode_paiement}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase text-slate-400">
                Référence
              </p>

              <p className="mt-1 text-sm text-slate-700">
                {paiement.reference || "-"}
              </p>
            </div>

          </div>

        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-slate-900">
            Facture associée
          </h2>

          {paiement.facture ? (
            <div className="mt-5 space-y-4">

              <div>

                <p className="text-xs uppercase text-slate-400">
                  Numéro
                </p>

                <Link
                  to={`/factures/${paiement.facture.id}`}
                  className="mt-1 inline-block font-semibold text-blue-600 hover:underline"
                >
                  {paiement.facture.numero}
                </Link>

              </div>

              <div>

                <p className="text-xs uppercase text-slate-400">
                  Montant TTC
                </p>

                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {formatMoney(
                    paiement.facture.montant_ttc
                  )}
                </p>

              </div>

              <div>

                <p className="text-xs uppercase text-slate-400">
                  Statut
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {paiement.facture.statut}
                </p>

              </div>

            </div>
          ) : (
            <p className="mt-5 text-sm text-slate-500">
              Facture non disponible.
            </p>
          )}

        </div>

      </div>

    </div>
  );
}