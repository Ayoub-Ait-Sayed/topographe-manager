import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Download,
  FileText,
  Pencil,
  Trash2,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
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

export default function DevisDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [devis, setDevis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // DEBUG ID
  // =========================================================

  console.log("========== DEVIS DETAILS ==========");
  console.log("ID dans URL :", id);

  // =========================================================
  // CHARGER LE DEVIS
  // =========================================================

  const loadDevis = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("====================================");
      console.log("AVANT APPEL API");
      console.log("ID =", id);
      console.log("URL =", `/devis/${id}`);
      console.log("====================================");

      const response = await api.get(`/devis/${id}`);

      console.log("====================================");
      console.log("RESPONSE API DEVIS");
      console.log(response);
      console.log("====================================");

      console.log("RESPONSE.DATA");
      console.log(response.data);

      console.log("RESPONSE.DATA.DATA");
      console.log(response.data?.data);

      const data = response.data?.data;

      if (!data) {
        console.error("Aucune donnée dans response.data.data");

        throw new Error(
          "Le serveur a répondu mais aucune donnée de devis n'a été trouvée."
        );
      }

      console.log("====================================");
      console.log("DEVIS FINAL");
      console.log(data);
      console.log("ID :", data.id);
      console.log("NUMERO :", data.numero);
      console.log("CLIENT :", data.client);
      console.log("PROJET :", data.projet);
      console.log("ITEMS :", data.items);
      console.log("====================================");

      // Normalisation éventuelle
      const devisNormalise = {
        ...data,

        client:
          data.client?.data ||
          data.client ||
          null,

        projet:
          data.projet?.data ||
          data.projet ||
          null,

        items:
          Array.isArray(data.items)
            ? data.items
            : Array.isArray(data.items?.data)
            ? data.items.data
            : [],
      };

      console.log("====================================");
      console.log("DEVIS NORMALISE");
      console.log(devisNormalise);
      console.log("====================================");

      setDevis(devisNormalise);

    } catch (error) {
      console.error("====================================");
      console.error("ERREUR CHARGEMENT DEVIS");
      console.error(error);
      console.error("MESSAGE :", error.message);
      console.error("RESPONSE :", error.response);
      console.error("RESPONSE DATA :", error.response?.data);
      console.error("STATUS :", error.response?.status);
      console.error("====================================");

      setError(
        error.response?.data?.message ||
          error.message ||
          "Impossible de charger le devis."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // USE EFFECT
  // =========================================================

  useEffect(() => {
    console.log("useEffect lancé avec ID :", id);

    if (!id) {
      setError("Aucun identifiant de devis trouvé dans l'URL.");
      setLoading(false);
      return;
    }

    loadDevis();
  }, [id]);

  // =========================================================
  // SUPPRIMER
  // =========================================================

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer ce devis ?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/devis/${id}`);

      alert("Devis supprimé avec succès.");

      navigate("/devis");

    } catch (error) {
      console.error("Erreur suppression devis :", error);

      alert(
        error.response?.data?.message ||
          "Impossible de supprimer le devis."
      );
    }
  };

  // =========================================================
  // PDF
  // =========================================================

  const handlePdf = async () => {
    if (!devis) {
      return;
    }

    try {
      setPdfLoading(true);

      const response = await api.get(`/devis/${id}/pdf`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `devis-${devis.numero || id}.pdf`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Erreur génération PDF :", error);

      alert(
        error.response?.data?.message ||
          "Impossible de générer le PDF du devis."
      );
    } finally {
      setPdfLoading(false);
    }
  };

  // =========================================================
  // FORMAT ARGENT
  // =========================================================

  const formatMoney = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "0,00 DH";
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
      return "0,00 DH";
    }

    return (
      number.toLocaleString("fr-FR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + " DH"
    );
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString("fr-FR");
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">

        <div className="text-center">

          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700" />

          <p className="text-sm text-slate-500">
            Chargement du devis...
          </p>

        </div>

      </div>
    );
  }

  // =========================================================
  // ERREUR
  // =========================================================

  if (error) {
    return (
      <div className="space-y-4">

        <div className="rounded-xl border border-red-200 bg-red-50 p-6">

          <h2 className="text-lg font-semibold text-red-800">
            Erreur
          </h2>

          <p className="mt-2 text-sm text-red-700">
            {error}
          </p>

        </div>

        <div className="flex gap-3">

          <button
            onClick={loadDevis}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Réessayer
          </button>

          <Link
            to="/devis"
            className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Retour aux devis
          </Link>

        </div>

      </div>
    );
  }

  // =========================================================
  // DEVIS INTROUVABLE
  // =========================================================

  if (!devis) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">

        <FileText
          size={40}
          className="mx-auto mb-4 text-slate-400"
        />

        <p className="text-sm text-slate-500">
          Devis introuvable.
        </p>

        <Link
          to="/devis"
          className="mt-4 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm text-white"
        >
          Retour aux devis
        </Link>

      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div className="flex items-center gap-3">

          <Link
            to="/devis"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          >
            <ArrowLeft size={20} />
          </Link>

          <div>

            <h1 className="text-2xl font-bold text-slate-900">
              {devis.numero || "-"}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Détails du devis
            </p>

          </div>

        </div>

        <div className="flex flex-wrap gap-2">

          {/* MODIFIER */}

          <Link
            to={`/devis/${id}/edit`}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Pencil size={17} />
            Modifier
          </Link>

          {/* PDF */}

          <button
            onClick={handlePdf}
            disabled={pdfLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Download size={17} />

            {pdfLoading
              ? "Génération..."
              : "PDF"}
          </button>

          {/* SUPPRIMER */}

          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
          >
            <Trash2 size={17} />
            Supprimer
          </button>

        </div>

      </div>

      {/* =====================================================
          INFORMATIONS
      ===================================================== */}

      <div className="grid gap-6 lg:grid-cols-3">

        {/* NUMERO */}

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-3 flex items-center gap-2 text-slate-500">

            <FileText size={18} />

            <span className="text-sm">
              Numéro
            </span>

          </div>

          <p className="font-semibold text-slate-900">
            {devis.numero || "-"}
          </p>

        </div>

        {/* DATE */}

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-3 flex items-center gap-2 text-slate-500">

            <Calendar size={18} />

            <span className="text-sm">
              Date
            </span>

          </div>

          <p className="font-semibold text-slate-900">
            {formatDate(devis.date)}
          </p>

        </div>

        {/* STATUT */}

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-3 text-sm text-slate-500">
            Statut
          </div>

          <span
            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${
              statutClasses[devis.statut] ||
              "bg-slate-100 text-slate-700"
            }`}
          >
            {statutLabels[devis.statut] ||
              devis.statut ||
              "-"}
          </span>

        </div>

      </div>

      {/* =====================================================
          CLIENT / PROJET
      ===================================================== */}

      <div className="grid gap-6 lg:grid-cols-2">

        {/* CLIENT */}

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-5 text-lg font-semibold text-slate-900">
            Client
          </h2>

          <div className="space-y-3 text-sm">

            <p>

              <span className="text-slate-500">
                Nom :
              </span>{" "}

              <span className="font-medium text-slate-900">
                {devis.client?.nom || "-"}
              </span>

            </p>

            <p>

              <span className="text-slate-500">
                Entreprise :
              </span>{" "}

              <span className="font-medium text-slate-900">
                {devis.client?.entreprise || "-"}
              </span>

            </p>

            <p>

              <span className="text-slate-500">
                Téléphone :
              </span>{" "}

              <span className="font-medium text-slate-900">
                {devis.client?.telephone || "-"}
              </span>

            </p>

            <p>

              <span className="text-slate-500">
                Email :
              </span>{" "}

              <span className="font-medium text-slate-900">
                {devis.client?.email || "-"}
              </span>

            </p>

            <p>

              <span className="text-slate-500">
                Ville :
              </span>{" "}

              <span className="font-medium text-slate-900">
                {devis.client?.ville || "-"}
              </span>

            </p>

          </div>

        </div>

        {/* PROJET */}

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-5 text-lg font-semibold text-slate-900">
            Projet
          </h2>

          <div className="space-y-3 text-sm">

            <p>

              <span className="text-slate-500">
                Référence :
              </span>{" "}

              <span className="font-medium text-slate-900">
                {devis.projet?.reference || "-"}
              </span>

            </p>

            <p>

              <span className="text-slate-500">
                Nom :
              </span>{" "}

              <span className="font-medium text-slate-900">
                {devis.projet?.nom || "-"}
              </span>

            </p>

            <p>

              <span className="text-slate-500">
                Type de mission :
              </span>{" "}

              <span className="font-medium text-slate-900">
                {devis.projet?.type_mission || "-"}
              </span>

            </p>

            <p>

              <span className="text-slate-500">
                Ville :
              </span>{" "}

              <span className="font-medium text-slate-900">
                {devis.projet?.ville || "-"}
              </span>

            </p>

            <p>

              <span className="text-slate-500">
                Adresse :
              </span>{" "}

              <span className="font-medium text-slate-900">
                {devis.projet?.adresse || "-"}
              </span>

            </p>

          </div>

        </div>

      </div>

      {/* =====================================================
          ITEMS
      ===================================================== */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 p-6">

          <h2 className="text-lg font-semibold text-slate-900">
            Lignes du devis
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

              {devis.items.map((item) => (

                <tr
                  key={item.id}
                  className="border-b border-slate-100"
                >

                  <td className="px-6 py-4 text-sm text-slate-900">
                    {item.description || "-"}
                  </td>

                  <td className="px-6 py-4 text-right text-sm text-slate-700">
                    {item.quantite ?? "-"}
                  </td>

                  <td className="px-6 py-4 text-right text-sm text-slate-700">
                    {formatMoney(item.prix_unitaire)}
                  </td>

                  <td className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                    {formatMoney(item.total)}
                  </td>

                </tr>

              ))}

              {devis.items.length === 0 && (

                <tr>

                  <td
                    colSpan="4"
                    className="px-6 py-8 text-center text-sm text-slate-500"
                  >
                    Aucune ligne dans ce devis.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* =====================================================
          TOTAUX
      ===================================================== */}

      <div className="flex justify-end">

        <div className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:w-[420px]">

          <div className="space-y-3">

            <div className="flex justify-between text-sm">

              <span className="text-slate-500">
                Montant HT
              </span>

              <span className="font-medium text-slate-900">
                {formatMoney(devis.montant_ht)}
              </span>

            </div>

            <div className="flex justify-between text-sm">

              <span className="text-slate-500">
                TVA
              </span>

              <span className="font-medium text-slate-900">
                {formatMoney(devis.tva)}
              </span>

            </div>

            <div className="border-t border-slate-200 pt-3">

              <div className="flex justify-between">

                <span className="font-semibold text-slate-900">
                  Montant TTC
                </span>

                <span className="text-xl font-bold text-slate-900">
                  {formatMoney(devis.montant_ttc)}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          VALIDITE
      ===================================================== */}

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

        <p className="text-sm text-slate-500">
          Validité du devis
        </p>

        <p className="mt-1 font-medium text-slate-900">
          {formatDate(devis.validite)}
        </p>

      </div>

    </div>
  );
}