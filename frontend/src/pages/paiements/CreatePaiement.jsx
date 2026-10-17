import { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

const formatMoney = (value) => {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));
};

export default function CreatePaiement() {
  const navigate = useNavigate();

  const [factures, setFactures] = useState([]);
  const [loadingFactures, setLoadingFactures] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    facture_id: "",
    montant: "",
    date: new Date().toISOString().split("T")[0],
    mode_paiement: "virement",
    reference: "",
  });

  useEffect(() => {
    const loadFactures = async () => {
      try {
        const response = await api.get("/factures");

        const data = response.data.data;

        setFactures(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message ||
            "Impossible de charger les factures."
        );
      } finally {
        setLoadingFactures(false);
      }
    };

    loadFactures();
  }, []);

  const selectedFacture = factures.find(
    (facture) =>
      String(facture.id) === String(form.facture_id)
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.facture_id) {
      setError("Veuillez sélectionner une facture.");
      return;
    }

    if (!form.montant || Number(form.montant) <= 0) {
      setError("Le montant doit être supérieur à 0.");
      return;
    }

    try {
      setSaving(true);

      await api.post("/paiements", {
        facture_id: Number(form.facture_id),
        montant: Number(form.montant),
        date: form.date,
        mode_paiement: form.mode_paiement,
        reference: form.reference || null,
      });

      navigate("/paiements");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Impossible d'enregistrer le paiement."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">

      <div className="flex items-center gap-3">

        <Link
          to="/paiements"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
        >
          <ArrowLeft size={20} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Nouveau paiement
          </h1>

          <p className="text-sm text-slate-500">
            Enregistrer un paiement pour une facture.
          </p>
        </div>

      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >

        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Facture *
          </label>

          <select
            name="facture_id"
            value={form.facture_id}
            onChange={handleChange}
            disabled={loadingFactures}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
          >

            <option value="">
              {loadingFactures
                ? "Chargement..."
                : "Sélectionner une facture"}
            </option>

            {factures.map((facture) => (
              <option
                key={facture.id}
                value={facture.id}
              >
                {facture.numero} —{" "}
                {formatMoney(facture.montant_ttc)}
              </option>
            ))}

          </select>

        </div>

        {selectedFacture && (
          <div className="rounded-xl bg-slate-50 p-4">

            <p className="text-sm text-slate-500">
              Montant TTC de la facture
            </p>

            <p className="mt-1 text-xl font-bold text-slate-900">
              {formatMoney(selectedFacture.montant_ttc)}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Statut actuel : {selectedFacture.statut}
            </p>

          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Montant *
            </label>

            <input
              type="number"
              name="montant"
              value={form.montant}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              placeholder="0.00"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Date *
            </label>

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
            />

          </div>

        </div>

        <div className="grid gap-5 md:grid-cols-2">

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Mode de paiement *
            </label>

            <select
              name="mode_paiement"
              value={form.mode_paiement}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
            >
              <option value="especes">
                Espèces
              </option>

              <option value="cheque">
                Chèque
              </option>

              <option value="virement">
                Virement
              </option>

              <option value="carte">
                Carte
              </option>

              <option value="autre">
                Autre
              </option>

            </select>

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Référence
            </label>

            <input
              type="text"
              name="reference"
              value={form.reference}
              onChange={handleChange}
              placeholder="Ex: VIR-2026-001"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
            />

          </div>

        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">

          <Link
            to="/paiements"
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Annuler
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>

        </div>

      </form>

    </div>
  );
}