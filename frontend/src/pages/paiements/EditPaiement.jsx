import { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

export default function EditPaiement() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [factures, setFactures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    facture_id: "",
    montant: "",
    date: "",
    mode_paiement: "virement",
    reference: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [paiementResponse, facturesResponse] =
          await Promise.all([
            api.get(`/paiements/${id}`),
            api.get("/factures"),
          ]);

        const paiement = paiementResponse.data.data;
        const facturesData = facturesResponse.data.data;

        setFactures(
          Array.isArray(facturesData)
            ? facturesData
            : []
        );

        setForm({
          facture_id: paiement.facture_id || "",
          montant: paiement.montant || "",
          date: paiement.date || "",
          mode_paiement:
            paiement.mode_paiement || "virement",
          reference: paiement.reference || "",
        });
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

    loadData();
  }, [id]);

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

    try {
      setSaving(true);

      await api.put(`/paiements/${id}`, {
        facture_id: Number(form.facture_id),
        montant: Number(form.montant),
        date: form.date,
        mode_paiement: form.mode_paiement,
        reference: form.reference || null,
      });

      navigate(`/paiements/${id}`);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Impossible de modifier le paiement."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-sm text-slate-500">
        Chargement...
      </div>
    );
  }

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
            Modifier le paiement
          </h1>

          <p className="text-sm text-slate-500">
            Modifier les informations du paiement.
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
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
          >

            <option value="">
              Sélectionner une facture
            </option>

            {factures.map((facture) => (
              <option
                key={facture.id}
                value={facture.id}
              >
                {facture.numero} —{" "}
                {facture.montant_ttc} DH
              </option>
            ))}

          </select>

        </div>

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
              required
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
              required
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
              required
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
              placeholder="Référence"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
            />

          </div>

        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">

          <Link
            to={`/paiements/${id}`}
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

            {saving
              ? "Modification..."
              : "Enregistrer les modifications"}
          </button>

        </div>

      </form>

    </div>
  );
}