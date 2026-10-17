import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

const TVA_RATE = 20;

const emptyItem = {
  description: "",
  quantite: 1,
  prix_unitaire: 0,
};

export default function CreateDevis() {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [projets, setProjets] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    numero: "",
    client_id: "",
    projet_id: "",
    date: new Date().toISOString().split("T")[0],
    validite: "",
    statut: "brouillon",
  });

  const [items, setItems] = useState([
    { ...emptyItem },
  ]);

  /*
  |--------------------------------------------------------------------------
  | Charger clients et projets
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [clientsResponse, projetsResponse] =
          await Promise.all([
            api.get("/clients"),
            api.get("/projets"),
          ]);

        setClients(clientsResponse.data.data || []);
        setProjets(projetsResponse.data.data || []);
      } catch (error) {
        console.error(
          "Erreur chargement données :",
          error
        );

        alert(
          error.response?.data?.message ||
            "Impossible de charger les clients et projets."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Calcul montant HT
  |--------------------------------------------------------------------------
  */

  const montantHt = useMemo(() => {
    return items.reduce((total, item) => {
      const quantite = Number(item.quantite) || 0;
      const prix = Number(item.prix_unitaire) || 0;

      return total + quantite * prix;
    }, 0);
  }, [items]);

  /*
  |--------------------------------------------------------------------------
  | Calcul TVA
  |--------------------------------------------------------------------------
  */

  const montantTva = useMemo(() => {
    return montantHt * (TVA_RATE / 100);
  }, [montantHt]);

  /*
  |--------------------------------------------------------------------------
  | Calcul TTC
  |--------------------------------------------------------------------------
  */

  const montantTtc = useMemo(() => {
    return montantHt + montantTva;
  }, [montantHt, montantTva]);

  /*
  |--------------------------------------------------------------------------
  | Changement formulaire
  |--------------------------------------------------------------------------
  */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Changement ligne
  |--------------------------------------------------------------------------
  */

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
              [field]: value,
            }
          : item
      )
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Ajouter ligne
  |--------------------------------------------------------------------------
  */

  const addItem = () => {
    setItems((current) => [
      ...current,
      {
        ...emptyItem,
      },
    ]);
  };

  /*
  |--------------------------------------------------------------------------
  | Supprimer ligne
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | Créer devis
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (e) => {
    e.preventDefault();

    /*
    | Validation numéro
    */

    if (!form.numero.trim()) {
      alert("Veuillez saisir le numéro du devis.");
      return;
    }

    /*
    | Validation client
    */

    if (!form.client_id) {
      alert("Veuillez sélectionner un client.");
      return;
    }

    /*
    | Validation date
    */

    if (!form.date) {
      alert("Veuillez sélectionner la date du devis.");
      return;
    }

    /*
    | Validation validité
    */

    if (!form.validite) {
      alert(
        "Veuillez sélectionner la date de validité."
      );
      return;
    }

    /*
    | Validation lignes
    */

    if (items.length === 0) {
      alert(
        "Ajoutez au moins une ligne au devis."
      );
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

      /*
      |--------------------------------------------------------------------------
      | Payload API
      |--------------------------------------------------------------------------
      */

      const payload = {
        numero: form.numero.trim(),

        client_id: Number(form.client_id),

        projet_id: form.projet_id
          ? Number(form.projet_id)
          : null,

        date: form.date,

        validite: form.validite,

        montant_ht: Number(
          montantHt.toFixed(2)
        ),

        tva: Number(
          montantTva.toFixed(2)
        ),

        montant_ttc: Number(
          montantTtc.toFixed(2)
        ),

        statut: form.statut,

        items: items.map((item) => ({
          description:
            item.description.trim(),

          quantite: Number(
            item.quantite
          ),

          prix_unitaire: Number(
            item.prix_unitaire
          ),

          total: Number(
            (
              Number(item.quantite) *
              Number(item.prix_unitaire)
            ).toFixed(2)
          ),
        })),
      };

      console.log(
        "Payload devis :",
        payload
      );

      /*
      |--------------------------------------------------------------------------
      | POST
      |--------------------------------------------------------------------------
      */

      await api.post(
        "/devis",
        payload
      );

      alert(
        "Devis créé avec succès."
      );

      navigate("/devis");
    } catch (error) {
      console.error(
        "Erreur création devis :",
        error
      );

      /*
      | Afficher les erreurs Laravel
      */

      if (error.response?.data?.errors) {
        console.error(
          "Erreurs validation :",
          error.response.data.errors
        );

        const errors =
          error.response.data.errors;

        const firstError = Object.values(
          errors
        ).flat()[0];

        alert(
          firstError ||
            "Erreur de validation."
        );
      } else {
        alert(
          error.response?.data?.message ||
            "Impossible de créer le devis."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Format argent
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
      <div className="flex min-h-[300px] items-center justify-center text-sm text-slate-500">
        Chargement...
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="space-y-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex items-center gap-3">

        <Link
          to="/devis"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
        >
          <ArrowLeft size={20} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Nouveau devis
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Créer un nouveau devis pour un client.
          </p>
        </div>

      </div>

      {/* =================================================
          FORM
      ================================================= */}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* =================================================
            INFORMATIONS GÉNÉRALES
        ================================================= */}

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="mb-6 text-lg font-semibold text-slate-900">
            Informations générales
          </h2>

          <div className="grid gap-5 md:grid-cols-2">

            {/* =================================================
                NUMÉRO
            ================================================= */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Numéro du devis
              </label>

              <input
                type="text"
                name="numero"
                value={form.numero}
                onChange={handleChange}
                placeholder="DEV-2026-001"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-slate-500"
              />

            </div>

            {/* =================================================
                CLIENT
            ================================================= */}

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

            {/* =================================================
                PROJET
            ================================================= */}

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
                    {projet.reference} -{" "}
                    {projet.nom}
                  </option>
                ))}

              </select>

            </div>

            {/* =================================================
                DATE
            ================================================= */}

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

            {/* =================================================
                DATE VALIDITÉ
            ================================================= */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Date de validité
              </label>

              <input
                type="date"
                name="validite"
                value={form.validite}
                onChange={handleChange}
                min={form.date}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-slate-500"
              />

              <p className="mt-1 text-xs text-slate-500">
                Date jusqu'à laquelle le devis reste valable.
              </p>

            </div>

            {/* =================================================
                STATUT
            ================================================= */}

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

        {/* =================================================
            LIGNES DU DEVIS
        ================================================= */}

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-center">

            <div>

              <h2 className="text-lg font-semibold text-slate-900">
                Lignes du devis
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Ajoutez les prestations ou services.
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
                Number(
                  item.prix_unitaire || 0
                );

              return (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 p-4"
                >

                  <div className="grid gap-4 md:grid-cols-12">

                    {/* DESCRIPTION */}

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
                        placeholder="Prestation topographique"
                        required
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500"
                      />

                    </div>

                    {/* QUANTITÉ */}

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

                    {/* PRIX UNITAIRE */}

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

                    {/* TOTAL */}

                    <div className="md:col-span-2">

                      <label className="mb-2 block text-xs font-medium text-slate-600">
                        Total
                      </label>

                      <div className="rounded-lg bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-900">
                        {formatMoney(total)}
                      </div>

                    </div>

                    {/* SUPPRIMER */}

                    <div className="flex items-end justify-end md:col-span-1">

                      <button
                        type="button"
                        onClick={() =>
                          removeItem(index)
                        }
                        disabled={
                          items.length === 1
                        }
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
                        title="Supprimer"
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

        {/* =================================================
            TOTAUX
        ================================================= */}

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

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">

          <Link
            to="/devis"
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
              : "Créer le devis"}

          </button>

        </div>

      </form>

    </div>
  );
}