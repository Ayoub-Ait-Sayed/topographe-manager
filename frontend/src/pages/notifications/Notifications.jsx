import { useEffect, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  RefreshCw,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/notifications");

      setNotifications(response.data.data || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Impossible de récupérer les notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const unreadCount = notifications.filter(
    (notification) => notification.read_at === null
  ).length;

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id
            ? {
                ...notification,
                read_at: new Date().toISOString(),
              }
            : notification
        )
      );
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Impossible de marquer la notification comme lue."
      );
    }
  };

  const markAllAsRead = async () => {
    if (unreadCount === 0) {
      return;
    }

    try {
      setProcessing(true);

      await api.patch("/notifications/read-all");

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          read_at:
            notification.read_at || new Date().toISOString(),
        }))
      );
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Impossible de marquer toutes les notifications comme lues."
      );
    } finally {
      setProcessing(false);
    }
  };

  const deleteNotification = async (id) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cette notification ?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/notifications/${id}`);

      setNotifications((current) =>
        current.filter((notification) => notification.id !== id)
      );
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Impossible de supprimer la notification."
      );
    }
  };

  const getTypeConfig = (type) => {
    switch (type) {
      case "success":
        return {
          icon: CheckCircle,
          container: "bg-emerald-50 border-emerald-200",
          iconContainer: "bg-emerald-100 text-emerald-600",
          title: "text-emerald-800",
        };

      case "warning":
        return {
          icon: AlertTriangle,
          container: "bg-amber-50 border-amber-200",
          iconContainer: "bg-amber-100 text-amber-600",
          title: "text-amber-800",
        };

      case "error":
        return {
          icon: XCircle,
          container: "bg-red-50 border-red-200",
          iconContainer: "bg-red-100 text-red-600",
          title: "text-red-800",
        };

      default:
        return {
          icon: Info,
          container: "bg-blue-50 border-blue-200",
          iconContainer: "bg-blue-100 text-blue-600",
          title: "text-blue-800",
        };
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Bell size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Notifications
              </h1>

              <p className="text-sm text-slate-500">
                Gérez vos notifications et alertes.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">

          <button
            type="button"
            onClick={loadNotifications}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />

            Actualiser
          </button>

          <button
            type="button"
            onClick={markAllAsRead}
            disabled={processing || unreadCount === 0}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCheck size={16} />

            Tout marquer comme lu
          </button>

        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {notifications.length}
          </p>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
          <p className="text-sm text-blue-600">
            Non lues
          </p>

          <p className="mt-1 text-2xl font-bold text-blue-700">
            {unreadCount}
          </p>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <p className="text-sm text-emerald-600">
            Lues
          </p>

          <p className="mt-1 text-2xl font-bold text-emerald-700">
            {notifications.length - unreadCount}
          </p>
        </div>

      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center gap-3 text-slate-600">
            <RefreshCw size={20} className="animate-spin" />
            Chargement des notifications...
          </div>
        </div>
      ) : notifications.length === 0 ? (

        /* Empty */
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Bell size={30} />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            Aucune notification
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Vous n'avez aucune notification pour le moment.
          </p>

          <Link
            to="/dashboard"
            className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Retour au dashboard
          </Link>

        </div>

      ) : (

        /* List */
        <div className="space-y-3">

          {notifications.map((notification) => {

            const typeConfig = getTypeConfig(
              notification.data?.type
            );

            const Icon = typeConfig.icon;

            const isUnread = notification.read_at === null;

            return (
              <div
                key={notification.id}
                className={`rounded-xl border p-5 shadow-sm transition ${
                  isUnread
                    ? "border-blue-200 bg-white"
                    : "border-slate-200 bg-slate-50"
                }`}
              >

                <div className="flex gap-4">

                  {/* Icon */}
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      typeConfig.iconContainer
                    }`}
                  >
                    <Icon size={21} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                      <div>

                        <div className="flex flex-wrap items-center gap-2">

                          <h3
                            className={`font-semibold ${
                              isUnread
                                ? "text-slate-900"
                                : "text-slate-700"
                            }`}
                          >
                            {notification.data?.title ||
                              "Notification"}
                          </h3>

                          {isUnread && (
                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                              Non lue
                            </span>
                          )}

                        </div>

                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          {notification.data?.message ||
                            "Aucun message."}
                        </p>

                      </div>

                      <span className="shrink-0 text-xs text-slate-400">
                        {formatDate(notification.created_at)}
                      </span>

                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex flex-wrap items-center gap-2">

                      {isUnread && (
                        <button
                          type="button"
                          onClick={() =>
                            markAsRead(notification.id)
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-100"
                        >
                          <Check size={15} />
                          Marquer comme lue
                        </button>
                      )}

                      {!isUnread && (
                        <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                          <CheckCircle size={15} />
                          Lue
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          deleteNotification(notification.id)
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-100"
                      >
                        <Trash2 size={15} />
                        Supprimer
                      </button>

                    </div>

                  </div>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}