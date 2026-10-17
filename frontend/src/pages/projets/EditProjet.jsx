import { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import api from "../../services/api";

export default function EditProjet() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    reference: "",
    nom: "",
    description: "",
    client_id: "",
    type_mission: "",
    adresse: "",
    ville: "",
    latitude: "",
    longitude: "",
    date_debut: "",
    date_fin: "",
    statut: "en_attente",
    montant: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [projetResponse, clientsResponse] =
          await Promise.all([
            api.get(`/projets/${id}`),
            api.get("/clients"),
          ]);

        const projetResult = projetResponse.data;
        const projet =
          projetResult?.data || projetResult;

        const clientsResult = clientsResponse.data;

        const clientsData = Array.isArray(
          clientsResult?.data
        )
          ? clientsResult.data
          : Array.isArray(clientsResult)
          ? clientsResult
          : [];

        setClients(clientsData);

        setForm({
          reference: projet.reference || "",
          nom: projet.nom || "",
          description: projet.description || "",
          client_id: projet.client_id
            ? String(projet.client_id)
            : "",
          type_mission: projet.type_mission || "",
          adresse: projet.adresse || "",
          ville: projet.ville || "",
          latitude:
            projet.latitude !== null &&
            projet.latitude !== undefined
              ? String(projet.latitude)
              : "",
          longitude:
            projet.longitude !== null &&
            projet.longitude !== undefined
              ? String(projet.longitude)
              : "",
          date_debut: projet.date_debut
            ? String(projet.date_debut).substring(0, 10)
            : "",
          date_fin: projet.date_fin
            ? String(projet.date_fin).substring(0, 10)
            : "",
          statut: projet.statut || "en_attente",
          montant:
            projet.montant !== null &&
            projet.montant !== undefined
              ? String(projet.montant)
              : "",
        });
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message ||
            "Impossible de charger le projet."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload = {
        ...form,
        client_id: Number(form.client_id),
        latitude:
          form.latitude === ""
            ? null
            : Number(form.latitude),
        longitude:
          form.longitude === ""
            ? null
            : Number(form.longitude),
        date_fin:
          form.date_fin === ""
            ? null
            : form.date_fin,
        montant:
          form.montant === ""
            ? null
            : Number(form.montant),
      };

      await api.put(`/projets/${id}`, payload);

      navigate("/projets");
    } catch (err) {
      console.error(err);

      const validationErrors =
        err.response?.data?.errors;

      if (validationErrors) {
        const messages = Object.values(validationErrors)
          .flat()
          .join(" ");

        setError(messages);
      } else {
        setError(
          err.response?.data?.message ||
            "Impossible de modifier le projet."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-60 items-center justify-center">
        <p className="text-sm text-slate-500">
          Chargement du projet...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/projets"
          className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 hover:bg-slate-50"
        >
          <ArrowLeft size={20} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Modifier le projet
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Modifier les informations du projet
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
        className="space-y-6"
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-slate-900">
            Informations générales
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Référence"
              name="reference"
              value={form.reference}
              onChange={handleChange}
            />

            <Field
              label="Nom du projet"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              required
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Client *
              </label>

              <select
                name="client_id"
                value={form.client_id}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
              >
                <option value="">
                  Sélectionner un client
                </option>

                {clients.map((client) => (
                  <option
                    key={client.id}
                    value={client.id}
                  >
                    {client.nom ||
                      client.name ||
                      client.entreprise ||
                      `Client #${client.id}`}
                  </option>
                ))}
              </select>
            </div>

            <Field
              label="Type de mission"
              name="type_mission"
              value={form.type_mission}
              onChange={handleChange}
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Statut *
              </label>

              <select
                name="statut"
                value={form.statut}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
              >
                <option value="en_attente">
                  En attente
                </option>

                <option value="en_cours">
                  En cours
                </option>

                <option value="termine">
                  Terminé
                </option>

                <option value="annule">
                  Annulé
                </option>
              </select>
            </div>

            <Field
              label="Montant (DH)"
              name="montant"
              type="number"
              value={form.montant}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-slate-900">
            Localisation
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Adresse"
              name="adresse"
              value={form.adresse}
              onChange={handleChange}
            />

            <Field
              label="Ville"
              name="ville"
              value={form.ville}
              onChange={handleChange}
            />

            <Field
              label="Latitude"
              name="latitude"
              type="number"
              value={form.latitude}
              onChange={handleChange}
              step="any"
            />

            <Field
              label="Longitude"
              name="longitude"
              type="number"
              value={form.longitude}
              onChange={handleChange}
              step="any"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-slate-900">
            Planning
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Date de début"
              name="date_debut"
              type="date"
              value={form.date_debut}
              onChange={handleChange}
              required
            />

            <Field
              label="Date de fin"
              name="date_fin"
              type="date"
              value={form.date_fin}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            to="/projets"
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Annuler
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            <Save size={18} />

            {saving
              ? "Modification..."
              : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  min,
  step,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
        {required && " *"}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        min={min}
        step={step}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
      />
    </div>
  );
}