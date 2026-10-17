import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Users,
  Search,
} from "lucide-react";
import api from "../../services/api";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadClients = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/clients");

      const data = response.data;

      if (Array.isArray(data)) {
        setClients(data);
      } else if (Array.isArray(data.data)) {
        setClients(data.data);
      } else {
        setClients([]);
      }
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Impossible de charger les clients."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const deleteClient = async (id) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer ce client ?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/clients/${id}`);

      setClients((prev) =>
        prev.filter((client) => client.id !== id)
      );
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Impossible de supprimer ce client."
      );
    }
  };

  const filteredClients = clients.filter((client) => {
    const text = search.toLowerCase();

    return (
      client.nom?.toLowerCase().includes(text) ||
      client.name?.toLowerCase().includes(text) ||
      client.email?.toLowerCase().includes(text) ||
      client.telephone?.toLowerCase().includes(text) ||
      client.phone?.toLowerCase().includes(text)
    );
  });

  return (
    <div>

      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Clients
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Gérez les clients de votre entreprise.
          </p>
        </div>

        <Link
          to="/clients/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <Plus size={18} />
          Ajouter un client
        </Link>

      </div>

      {/* SEARCH */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="relative">

          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un client..."
            className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none focus:border-slate-900"
          />

        </div>

      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* CONTENT */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {loading ? (

          <div className="p-10 text-center">
            <p className="text-sm text-slate-500">
              Chargement des clients...
            </p>
          </div>

        ) : filteredClients.length === 0 ? (

          <div className="flex flex-col items-center justify-center p-12 text-center">

            <div className="rounded-full bg-slate-100 p-4">
              <Users
                size={28}
                className="text-slate-500"
              />
            </div>

            <h3 className="mt-4 font-semibold text-slate-900">
              Aucun client
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Aucun client ne correspond à votre recherche.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[800px]">

              <thead className="border-b border-slate-200 bg-slate-50">

                <tr>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Client
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Email
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-slate-500">
                    Téléphone
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-slate-500">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredClients.map((client) => (

                  <tr
                    key={client.id}
                    className="hover:bg-slate-50"
                  >

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-700">
                          {(
                            client.nom ||
                            client.name ||
                            "C"
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <p className="font-semibold text-slate-900">
                            {client.nom ||
                              client.name ||
                              "-"}
                          </p>

                          {client.entreprise && (
                            <p className="text-xs text-slate-500">
                              {client.entreprise}
                            </p>
                          )}
                        </div>

                      </div>

                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {client.email || "-"}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {client.telephone ||
                        client.phone ||
                        "-"}
                    </td>

                    <td className="px-6 py-4">

                      <div className="flex justify-end gap-2">

                        <Link
                          to={`/clients/${client.id}`}
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                          title="Voir"
                        >
                          <Eye size={18} />
                        </Link>

                        <Link
                          to={`/clients/${client.id}/edit`}
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                          title="Modifier"
                        >
                          <Pencil size={18} />
                        </Link>

                        <button
                          onClick={() =>
                            deleteClient(client.id)
                          }
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}