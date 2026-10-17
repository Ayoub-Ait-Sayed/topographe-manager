import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import api from "../../services/api";

const STATUTS = [
  {
    value: "impayée",
    label: "Impayée",
  },
  {
    value: "partiellement_payée",
    label: "Partiellement payée",
  },
  {
    value: "payée",
    label: "Payée",
  },
  {
    value: "annulée",
    label: "Annulée",
  },
];

export default function CreateFacture() {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [projets, setProjets] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    numero: "",
    client_id: "",
    projet_id: "",
    date: new Date()
      .toISOString()
      .split("T")[0],
    statut: "impayée",
  });

  const [items, setItems] = useState([
    {
      description: "",
      quantite: 1,
      prix_unitaire: 0,
    },
  ]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);

        const [
          clientsResponse,
          projetsResponse,
        ] = await Promise.all([
          api.get("/clients"),
          api.get("/projets"),
        ]);

        const clientsData =
          clientsResponse.data.data;

        const projetsData =
          projetsResponse.data.data;

        setClients(
          Array.isArray(clientsData)
            ? clientsData
            : clientsData?.data || []
        );

        setProjets(
          Array.isArray(projetsData)
            ? projetsData
            : projetsData?.data || []
        );
      } catch (error) {
        console.error(
          "Erreur chargement données :",
          error
        );

        alert(
          "Impossible de charger les clients et projets."
        );
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleItemChange = (
    index,
    field,
    value
  ) => {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]:
                field === "description"
                  ? value
                  : Number(value),
            }
          : item
      )
    );
  };

  const addItem = () => {
    setItems((current) => [
      ...current,
      {
        description: "",
        quantite: 1,
        prix_unitaire: 0,
      },
    ]);
  };

  const removeItem = (index) => {
    if (items.length === 1) {
      return;
    }

    setItems((current) =>
      current.filter(
        (_, itemIndex) => itemIndex !== index
      )
    );
  };

  const itemsWithTotals = useMemo(() => {
    return items.map((item) => ({
      ...item,
      total:
        Number(item.quantite || 0) *
        Number(item.prix_unitaire || 0),
    }));
  }, [items]);

  const montantHT = useMemo(() => {
    return itemsWithTotals.reduce(
      (sum, item) => sum + item.total,
      0
    );
  }, [itemsWithTotals]);

  const tva = useMemo(() => {
    return montantHT * 0.2;
  }, [montantHT]);

  const montantTTC = useMemo(() => {
    return montantHT + tva;
  }, [montantHT, tva]);

  const formatMoney = (value) => {
    return (
      Number(value || 0).toLocaleString("fr-FR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + " DH"
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.numero.trim()) {
      alert("Le numéro de facture est obligatoire.");
      return;
    }

    if (!form.client_id) {
      alert("Veuillez sélectionner un client.");
      return;
    }

    if (!form.projet_id) {
      alert("Veuillez sélectionner un projet.");
      return;
    }

    for (const item of itemsWithTotals) {
      if (!item.description.trim()) {
        alert(
          "Toutes les lignes doivent avoir une description."
        );
        return;
      }

      if (Number(item.quantite) <= 0) {
        alert("La quantité doit être supérieure à 0.");
        return;
      }

      if (Number(item.prix_unitaire) < 0) {
        alert(
          "Le prix unitaire ne peut pas être négatif."
        );
        return;
      }
    }

    try {
      setSaving(true);

      await api.post("/factures", {
        numero: form.numero,
        client_id: Number(form.client_id),
        projet_id: Number(form.projet_id),
        date: form.date,
        montant_ht: montantHT,
        tva,
        montant_ttc: montantTTC,
        statut: form.statut,
        items: itemsWithTotals.map((item) => ({
          description: item.description,
          quantite: Number(item.quantite),
          prix_unitaire: Number(
            item.prix_unitaire
          ),
          total: Number(item.total),
        })),
      });

      alert("Facture créée avec succès.");

      navigate("/factures");
    } catch (error) {
      console.error(
        "Erreur création facture :",
        error
      );

      const message =
        error.response?.data?.message ||
        "Impossible de créer la facture.";

      alert(message);
    } finally {
      setSaving(false);
    }
  };

  if (loadingData) {
    return (
      <div className="p-8 text-center text-sm text-slate-500">
        Chargement...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/factures"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
        >
          <ArrowLeft size={20} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Nouvelle facture
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Créer une nouvelle facture
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Informations */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-slate-900">
            Informations générales
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Numéro de facture *
              </label>

              <input
                type="text"
                name="numero"
                value={form.numero}
                onChange={handleChange}
                placeholder="FAC-2026-001"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Client *
              </label>

              <select
                name="client_id"
                value={form.client_id}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  Sélectionner un client
                </option>

                {clients.map((client) => (
                  <option
                    key={client.id}
                    value={client.id}
                  >
                    {client.nom}
                    {client.entreprise
                      ? ` — ${client.entreprise}`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Projet *
              </label>

              <select
                name="projet_id"
                value={form.projet_id}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">
                  Sélectionner un projet
                </option>

                {projets.map((projet) => (
                  <option
                    key={projet.id}
                    value={projet.id}
                  >
                    {projet.reference} —{" "}
                    {projet.nom}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Statut
              </label>

              <select
                name="statut"
                value={form.statut}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {STATUTS.map((statut) => (
                  <option
                    key={statut.value}
                    value={statut.value}
                  >
                    {statut.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lignes */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 p-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Lignes de la facture
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Ajouter les prestations facturées
              </p>
            </div>

            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              <Plus size={17} />
              Ajouter
            </button>
          </div>

          <div className="overflow-x-auto p-6">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-3 text-left text-xs font-semibold uppercase text-slate-500">
                    Description
                  </th>

                  <th className="w-32 pb-3 text-right text-xs font-semibold uppercase text-slate-500">
                    Quantité
                  </th>

                  <th className="w-44 pb-3 text-right text-xs font-semibold uppercase text-slate-500">
                    Prix unitaire
                  </th>

                  <th className="w-44 pb-3 text-right text-xs font-semibold uppercase text-slate-500">
                    Total
                  </th>

                  <th className="w-16 pb-3"></th>
                </tr>
              </thead>

              <tbody>
                {itemsWithTotals.map(
                  (item, index) => (
                    <tr
                      key={index}
                      className="border-b border-slate-100"
                    >
                      <td className="py-4 pr-4">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(event) =>
                            handleItemChange(
                              index,
                              "description",
                              event.target.value
                            )
                          }
                          placeholder="Ex: Levé topographique"
                          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        />
                      </td>

                      <td className="py-4 px-2">
                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={item.quantite}
                          onChange={(event) =>
                            handleItemChange(
                              index,
                              "quantite",
                              event.target.value
                            )
                          }
                          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-right text-sm outline-none focus:border-blue-500"
                        />
                      </td>

                      <td className="py-4 px-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={
                            item.prix_unitaire
                          }
                          onChange={(event) =>
                            handleItemChange(
                              index,
                              "prix_unitaire",
                              event.target.value
                            )
                          }
                          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-right text-sm outline-none focus:border-blue-500"
                        />
                      </td>

                      <td className="py-4 px-2 text-right text-sm font-semibold text-slate-900">
                        {formatMoney(item.total)}
                      </td>

                      <td className="py-4 pl-2">
                        <button
                          type="button"
                          onClick={() =>
                            removeItem(index)
                          }
                          disabled={items.length === 1}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  )
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
                  {formatMoney(montantHT)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">
                  TVA (20%)
                </span>

                <span className="font-medium text-slate-900">
                  {formatMoney(tva)}
                </span>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-900">
                    Montant TTC
                  </span>

                  <span className="text-xl font-bold text-slate-900">
                    {formatMoney(montantTTC)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Link
            to="/factures"
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Annuler
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={17} />

            {saving
              ? "Enregistrement..."
              : "Créer la facture"}
          </button>
        </div>
      </form>
    </div>
  );
}