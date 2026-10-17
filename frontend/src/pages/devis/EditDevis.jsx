import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import api from "../../services/api";

const TVA_RATE = 20;

const emptyItem = {
  description: "",
  quantite: 1,
  prix_unitaire: 0,
};

export default function EditDevis() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [projets, setProjets] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    numero: "",
    client_id: "",
    projet_id: "",
    date: "",
    validite: "",
    statut: "brouillon",
  });

  const [items, setItems] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [
          devisResponse,
          clientsResponse,
          projetsResponse,
        ] = await Promise.all([
          api.get(`/devis/${id}`),
          api.get("/clients"),
          api.get("/projets"),
        ]);

        const devis = devisResponse.data.data;

        setClients(clientsResponse.data.data || []);
        setProjets(projetsResponse.data.data || []);

        setForm({
          numero: devis.numero || "",
          client_id: devis.client_id || "",
          projet_id: devis.projet_id || "",
          date: devis.date || "",
          validite: devis.validite || "",
          statut: devis.statut || "brouillon",
        });

        setItems(
          (devis.items || []).map((item) => ({
            id: item.id,
            description: item.description || "",
            quantite: item.quantite ?? 1,
            prix_unitaire: item.prix_unitaire ?? 0,
          }))
        );
      } catch (error) {
        console.error("Erreur chargement devis :", error);
        alert("Impossible de charger le devis.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const montantHt = useMemo(() => {
    return items.reduce((total, item) => {
      return (
        total +
        (Number(item.quantite) || 0) *
          (Number(item.prix_unitaire) || 0)
      );
    }, 0);
  }, [items]);

  const montantTva = useMemo(() => {
    return montantHt * (TVA_RATE / 100);
  }, [montantHt]);

  const montantTtc = useMemo(() => {
    return montantHt + montantTva;
  }, [montantHt, montantTva]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const addItem = () => {
    setItems((current) => [
      ...current,
      { ...emptyItem },
    ]);
  };

  const removeItem = (index) => {
    if (items.length === 1) {
      return;
    }

    setItems((current) =>
      current.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      alert("Ajoutez au moins une ligne au devis.");
      return;
    }

    const invalidItem = items.find(
      (item) =>
        !item.description.trim() ||
        Number(item.quantite) <= 0 ||
        Number(item.prix_unitaire) < 0
    );

    if (invalidItem) {
      alert(
        "Veuillez compléter correctement toutes les lignes du devis."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        numero: form.numero,
        client_id: Number(form.client_id),
        projet_id: form.projet_id
          ? Number(form.projet_id)
          : null,
        date: form.date,
        validite: form.validite,
        montant_ht: Number(montantHt.toFixed(2)),
        tva: Number(montantTva.toFixed(2)),
        montant_ttc: Number(montantTtc.toFixed(2)),
        statut: form.statut,

        items: items.map((item) => ({
          ...(item.id ? { id: item.id } : {}),
          description: item.description,
          quantite: Number(item.quantite),
          prix_unitaire: Number(item.prix_unitaire),
          total: Number(
            (
              Number(item.quantite) *
              Number(item.prix_unitaire)
            ).toFixed(2)
          ),
        })),
      };

      await api.put(`/devis/${id}`, payload);

      alert("Devis modifié avec succès.");

      navigate(`/devis/${id}`);
    } catch (error) {
      console.error("Erreur modification devis :", error);

      if (error.response?.data?.errors) {
        console.error(error.response.data.errors);
      }

      alert(
        error.response?.data?.message ||
          "Impossible de modifier le devis."
      );
    } finally {
      setSaving(false);
    }
  };

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " DH";
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-sm text-slate-500">
        Chargement...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to={`/devis/${id}`}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
        >
          <ArrowLeft size={20} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Modifier le devis
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Modifier les informations et les lignes du devis.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-slate-900">
            Informations générales
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Numéro du devis
              </label>

              <input
                type="text"
                name="numero"
                value={form.numero}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Client
              </label>

              <select
                name="client_id"
                value={form.client_id}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-slate-500"
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
                      ? ` - ${client.entreprise}`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Projet
              </label>

              <select
                name="projet_id"
                value={form.projet_id}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-slate-500"
              >
                <option value="">
                  Aucun projet
                </option>

                {projets.map((projet) => (
                  <option
                    key={projet.id}
                    value={projet.id}
                  >
                    {projet.reference} - {projet.nom}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Date
              </label>

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Validité
              </label>

              <input
                type="text"
                name="validite"
                value={form.validite}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Statut
              </label>

              <select
                name="statut"
                value={form.statut}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-slate-500"
              >
                <option value="brouillon">
                  Brouillon
                </option>

                <option value="envoyé">
                  Envoyé
                </option>

                <option value="accepté">
                  Accepté
                </option>

                <option value="refusé">
                  Refusé
                </option>

                <option value="expiré">
                  Expiré
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Lignes du devis
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Modifier les prestations.
              </p>
            </div>

            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Plus size={17} />
              Ajouter une ligne
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => {
              const total =
                Number(item.quantite || 0) *
                Number(item.prix_unitaire || 0);

              return (
                <div
                  key={item.id || index}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="grid gap-4 md:grid-cols-12">
                    <div className="md:col-span-5">
                      <label className="mb-2 block text-xs font-medium text-slate-600">
                        Description
                      </label>

                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        required
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-xs font-medium text-slate-600">
                        Quantité
                      </label>

                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={item.quantite}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "quantite",
                            e.target.value
                          )
                        }
                        required
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-xs font-medium text-slate-600">
                        Prix unitaire
                      </label>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.prix_unitaire}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            "prix_unitaire",
                            e.target.value
                          )
                        }
                        required
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-xs font-medium text-slate-600">
                        Total
                      </label>

                      <div className="rounded-lg bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-900">
                        {formatMoney(total)}
                      </div>
                    </div>

                    <div className="flex items-end justify-end md:col-span-1">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        disabled={items.length === 1}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Totaux */}
        <div className="flex justify-end">
          <div className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:w-[420px]">
            <h2 className="mb-5 text-lg font-semibold text-slate-900">
              Récapitulatif
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">
                  Montant HT
                </span>

                <span className="font-medium text-slate-900">
                  {formatMoney(montantHt)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">
                  TVA ({TVA_RATE}%)
                </span>

                <span className="font-medium text-slate-900">
                  {formatMoney(montantTva)}
                </span>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-900">
                    Montant TTC
                  </span>

                  <span className="text-xl font-bold text-slate-900">
                    {formatMoney(montantTtc)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <Link
            to={`/devis/${id}`}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Annuler
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={17} />

            {saving
              ? "Enregistrement..."
              : "Enregistrer les modifications"}
          </button>
        </div>
      </form>
    </div>
  );
}