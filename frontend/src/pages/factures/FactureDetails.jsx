import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Download,
  FileText,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import api from "../../services/api";

const statutLabels = {
  impayée: "Impayée",
  partiellement_payée: "Partiellement payée",
  payée: "Payée",
  annulée: "Annulée",
};

const statutClasses = {
  impayée: "bg-red-100 text-red-700",
  partiellement_payée:
    "bg-amber-100 text-amber-700",
  payée: "bg-emerald-100 text-emerald-700",
  annulée: "bg-slate-100 text-slate-700",
};

export default function FactureDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [facture, setFacture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Charger la facture
  |--------------------------------------------------------------------------
  */

  const loadFacture = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        `/factures/${id}`
      );

      setFacture(response.data.data);
    } catch (error) {
      console.error(
        "Erreur chargement facture :",
        error
      );

      alert(
        "Impossible de charger la facture."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFacture();
  }, [id]);

  /*
  |--------------------------------------------------------------------------
  | Télécharger PDF
  |--------------------------------------------------------------------------
  */

  const handleDownloadPdf = async () => {
    try {
      setDownloading(true);

      const response = await api.get(
        `/factures/${id}/pdf`,
        {
          responseType: "blob",
        }
      );

      /*
      |--------------------------------------------------------------------------
      | Créer le Blob PDF
      |--------------------------------------------------------------------------
      */

      const blob = new Blob(
        [response.data],
        {
          type:
            response.headers["content-type"] ||
            "application/pdf",
        }
      );

      /*
      |--------------------------------------------------------------------------
      | Créer URL temporaire
      |--------------------------------------------------------------------------
      */

      const url =
        window.URL.createObjectURL(blob);

      /*
      |--------------------------------------------------------------------------
      | Créer le lien de téléchargement
      |--------------------------------------------------------------------------
      */

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        `facture-${facture?.numero || id}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      /*
      |--------------------------------------------------------------------------
      | Nettoyer
      |--------------------------------------------------------------------------
      */

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "Erreur téléchargement PDF facture :",
        error
      );

      console.error(
        "Status :",
        error.response?.status
      );

      console.error(
        "Response :",
        error.response?.data
      );

      alert(
        "Impossible de télécharger la facture PDF."
      );
    } finally {
      setDownloading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Supprimer
  |--------------------------------------------------------------------------
  */

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cette facture ?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/factures/${id}`
      );

      alert(
        "Facture supprimée avec succès."
      );

      navigate("/factures");
    } catch (error) {
      console.error(
        "Erreur suppression facture :",
        error
      );

      alert(
        "Impossible de supprimer la facture."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Format monnaie
  |--------------------------------------------------------------------------
  */

  const formatMoney = (value) => {
    return (
      Number(value || 0).toLocaleString(
        "fr-FR",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      ) + " DH"
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="p-8 text-center text-sm text-slate-500">
        Chargement...
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Facture introuvable
  |--------------------------------------------------------------------------
  */

  if (!facture) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-sm text-slate-500">
          Facture introuvable.
        </p>

        <Link
          to="/factures"
          className="mt-4 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm text-white"
        >
          Retour aux factures
        </Link>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Page
  |--------------------------------------------------------------------------
  */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <Link
            to="/factures"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          >
            <ArrowLeft size={20} />
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {facture.numero}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Détails de la facture
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {/* PDF */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Download size={17} />

            {downloading
              ? "Téléchargement..."
              : "Télécharger PDF"}
          </button>

          {/* Modifier */}
          <Link
            to={`/factures/${id}/edit`}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Pencil size={17} />

            Modifier
          </Link>

          {/* Supprimer */}
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
          >
            <Trash2 size={17} />

            Supprimer
          </button>
        </div>
      </div>

      {/* Informations */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Numéro */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-slate-500">
            <FileText size={18} />

            <span className="text-sm">
              Numéro
            </span>
          </div>

          <p className="font-semibold text-slate-900">
            {facture.numero}
          </p>
        </div>

        {/* Date */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-slate-500">
            <Calendar size={18} />

            <span className="text-sm">
              Date
            </span>
          </div>

          <p className="font-semibold text-slate-900">
            {facture.date
              ? new Date(
                  facture.date
                ).toLocaleDateString("fr-FR")
              : "-"}
          </p>
        </div>

        {/* Statut */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-3 text-sm text-slate-500">
            Statut
          </div>

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
            ] ||
              facture.statut ||
              "-"}
          </span>
        </div>
      </div>

      {/* Client / Projet */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Client */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-slate-900">
            Client
          </h2>

          <div className="space-y-2 text-sm">
            <p>
              <span className="text-slate-500">
                Nom :
              </span>{" "}
              <span className="font-medium text-slate-900">
                {facture.client?.nom ||
                  "-"}
              </span>
            </p>

            <p>
              <span className="text-slate-500">
                Entreprise :
              </span>{" "}
              <span className="font-medium text-slate-900">
                {facture.client
                  ?.entreprise || "-"}
              </span>
            </p>

            <p>
              <span className="text-slate-500">
                Téléphone :
              </span>{" "}
              <span className="font-medium text-slate-900">
                {facture.client
                  ?.telephone || "-"}
              </span>
            </p>

            <p>
              <span className="text-slate-500">
                Email :
              </span>{" "}
              <span className="font-medium text-slate-900">
                {facture.client?.email ||
                  "-"}
              </span>
            </p>
          </div>
        </div>

        {/* Projet */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-slate-900">
            Projet
          </h2>

          <div className="space-y-2 text-sm">
            <p>
              <span className="text-slate-500">
                Référence :
              </span>{" "}
              <span className="font-medium text-slate-900">
                {facture.projet
                  ?.reference || "-"}
              </span>
            </p>

            <p>
              <span className="text-slate-500">
                Nom :
              </span>{" "}
              <span className="font-medium text-slate-900">
                {facture.projet?.nom ||
                  "-"}
              </span>
            </p>

            <p>
              <span className="text-slate-500">
                Ville :
              </span>{" "}
              <span className="font-medium text-slate-900">
                {facture.projet?.ville ||
                  "-"}
              </span>
            </p>

            <p>
              <span className="text-slate-500">
                Adresse :
              </span>{" "}
              <span className="font-medium text-slate-900">
                {facture.projet?.adresse ||
                  "-"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Lignes de la facture
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                  Description
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-slate-500">
                  Quantité
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-slate-500">
                  Prix unitaire
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-slate-500">
                  Total
                </th>
              </tr>
            </thead>

            <tbody>
              {(facture.items || []).map(
                (item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-100"
                  >
                    <td className="px-6 py-4 text-sm text-slate-900">
                      {item.description}
                    </td>

                    <td className="px-6 py-4 text-right text-sm text-slate-700">
                      {item.quantite}
                    </td>

                    <td className="px-6 py-4 text-right text-sm text-slate-700">
                      {formatMoney(
                        item.prix_unitaire
                      )}
                    </td>

                    <td className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                      {formatMoney(
                        item.total
                      )}
                    </td>
                  </tr>
                )
              )}

              {(facture.items || [])
                .length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-8 text-center text-sm text-slate-500"
                  >
                    Aucune ligne dans cette facture.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totaux */}
      <div className="flex justify-end">
        <div className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:w-[420px]">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">
                Montant HT
              </span>

              <span className="font-medium text-slate-900">
                {formatMoney(
                  facture.montant_ht
                )}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-500">
                TVA
              </span>

              <span className="font-medium text-slate-900">
                {formatMoney(
                  facture.tva
                )}
              </span>
            </div>

            <div className="border-t border-slate-200 pt-3">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-900">
                  Montant TTC
                </span>

                <span className="text-xl font-bold text-slate-900">
                  {formatMoney(
                    facture.montant_ttc
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}