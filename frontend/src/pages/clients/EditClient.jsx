import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import api from "../../services/api";

export default function EditClient() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: "",
    email: "",
    telephone: "",
    adresse: "",
    entreprise: "",
    ville: "",
    notes: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Charger le client
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    const loadClient = async () => {
      try {
        setLoading(true);
        setError("");

        console.log(
          "Chargement client ID :",
          id
        );

        const response = await api.get(
          `/clients/${id}`
        );

        console.log(
          "Réponse client :",
          response.data
        );

        const client =
          response.data?.data ||
          response.data;

        if (!client) {
          throw new Error(
            "Client introuvable."
          );
        }

        setForm({
          nom: client.nom || "",
          email: client.email || "",
          telephone:
            client.telephone || "",
          adresse:
            client.adresse || "",
          entreprise:
            client.entreprise || "",
          ville: client.ville || "",
          notes: client.notes || "",
        });

      } catch (err) {
        console.error(
          "Erreur chargement client :",
          err
        );

        setError(
          err.response?.data?.message ||
            err.message ||
            "Impossible de charger le client."
        );
      } finally {
        setLoading(false);
      }
    };

    loadClient();
  }, [id]);

  /*
  |--------------------------------------------------------------------------
  | Modifier un champ
  |--------------------------------------------------------------------------
  */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Modifier le client
  |--------------------------------------------------------------------------
  */
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      /*
       * On prépare uniquement les champs
       * qui existent dans la table clients.
       */
      const data = {
        nom: form.nom.trim(),
        email: form.email.trim(),
        telephone: form.telephone.trim(),
        adresse: form.adresse.trim(),
        entreprise: form.entreprise.trim(),
        ville: form.ville.trim(),
        notes: form.notes.trim(),
      };

      console.log(
        "Modification client :",
        id
      );

      console.log(
        "Données envoyées :",
        data
      );

      /*
       * PATCH = modification partielle
       */
      const response = await api.patch(
        `/clients/${id}`,
        data
      );

      console.log(
        "Client modifié :",
        response.data
      );

      /*
       * Retour vers la liste
       */
      navigate("/clients");

    } catch (err) {
      console.error(
        "Erreur modification client :",
        err
      );

      console.error(
        "Status :",
        err.response?.status
      );

      console.error(
        "Réponse Laravel :",
        err.response?.data
      );

      /*
       * Erreurs de validation Laravel
       */
      const validationErrors =
        err.response?.data?.errors;

      if (validationErrors) {
        const messages = Object.values(
          validationErrors
        ).flat();

        setError(
          messages.length > 0
            ? messages.join(" ")
            : "Les données saisies sont invalides."
        );

        return;
      }

      /*
       * Erreur Laravel classique
       */
      if (err.response?.data?.message) {
        setError(
          err.response.data.message
        );

        return;
      }

      /*
       * Erreur HTTP
       */
      if (err.response?.status === 404) {
        setError(
          "Client introuvable."
        );

        return;
      }

      if (err.response?.status === 422) {
        setError(
          "Les données envoyées sont invalides."
        );

        return;
      }

      if (err.response?.status === 401) {
        setError(
          "Votre session a expiré. Veuillez vous reconnecter."
        );

        return;
      }

      setError(
        "Impossible de modifier le client."
      );

    } finally {
      setSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Chargement
  |--------------------------------------------------------------------------
  */
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-sm text-slate-500">
          Chargement du client...
        </p>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Page
  |--------------------------------------------------------------------------
  */
  return (
    <div>

      {/* HEADER */}
      <div className="mb-8 flex items-center gap-4">

        <Link
          to="/clients"
          className="rounded-xl p-2 text-slate-600 transition hover:bg-white hover:text-slate-900"
        >
          <ArrowLeft size={22} />
        </Link>

        <div>

          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Modifier le client
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Modifiez les informations du client.
          </p>

        </div>

      </div>

      {/* FORMULAIRE */}
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* INFORMATIONS PRINCIPALES */}
          <div className="grid gap-6 sm:grid-cols-2">

            {/* NOM */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Nom *
              </label>

              <input
                type="text"
                name="nom"
                value={form.nom}
                onChange={handleChange}
                required
                disabled={saving}
                placeholder="Nom du client"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:bg-slate-50"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled={saving}
                placeholder="client@example.com"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:bg-slate-50"
              />
            </div>

            {/* TELEPHONE */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Téléphone
              </label>

              <input
                type="text"
                name="telephone"
                value={form.telephone}
                onChange={handleChange}
                disabled={saving}
                placeholder="06XXXXXXXX"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:bg-slate-50"
              />
            </div>

            {/* ENTREPRISE */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Entreprise
              </label>

              <input
                type="text"
                name="entreprise"
                value={form.entreprise}
                onChange={handleChange}
                disabled={saving}
                placeholder="Nom de l'entreprise"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:bg-slate-50"
              />
            </div>

            {/* VILLE */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Ville
              </label>

              <input
                type="text"
                name="ville"
                value={form.ville}
                onChange={handleChange}
                disabled={saving}
                placeholder="Agadir"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:bg-slate-50"
              />
            </div>

          </div>

          {/* ADRESSE */}
          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Adresse
            </label>

            <textarea
              name="adresse"
              value={form.adresse}
              onChange={handleChange}
              disabled={saving}
              rows={4}
              placeholder="Adresse complète du client"
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:bg-slate-50"
            />

          </div>

          {/* NOTES */}
          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Notes
            </label>

            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              disabled={saving}
              rows={4}
              placeholder="Notes concernant le client..."
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:bg-slate-50"
            />

          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">

            <Link
              to="/clients"
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Annuler
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >

              <Save size={18} />

              {saving
                ? "Modification..."
                : "Enregistrer"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}
