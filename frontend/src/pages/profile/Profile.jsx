import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Lock,
  LogOut,
  Save,
  Eye,
  EyeOff,
  UserRound,
  CalendarDays,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | Formulaire profil
  |--------------------------------------------------------------------------
  */

  const [form, setForm] = useState({
    name: "",
    email: "",
    telephone: "",
  });

  /*
  |--------------------------------------------------------------------------
  | Formulaire mot de passe
  |--------------------------------------------------------------------------
  */

  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  /*
  |--------------------------------------------------------------------------
  | Récupérer l'utilisateur connecté
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/user");

        const userData = response.data?.data || response.data;

        setUser(userData);

        setForm({
          name: userData?.name || "",
          email: userData?.email || "",
          telephone:
            userData?.telephone ||
            userData?.phone ||
            "",
        });
      } catch (err) {
        console.error("Erreur profil :", err);

        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        setError(
          err.response?.data?.message ||
            "Impossible de charger votre profil."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  /*
  |--------------------------------------------------------------------------
  | Changement formulaire
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
  | Changement mot de passe
  |--------------------------------------------------------------------------
  */

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Modifier profil
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      /*
       * Pour le moment cette partie prépare le formulaire.
       * Le endpoint PATCH /profile sera ajouté côté Laravel.
       */

      const response = await api.patch("/profile", form);

      const updatedUser =
        response.data?.data ||
        response.data?.user ||
        response.data;

      if (updatedUser) {
        setUser(updatedUser);

        setForm({
          name: updatedUser.name || "",
          email: updatedUser.email || "",
          telephone:
            updatedUser.telephone ||
            updatedUser.phone ||
            "",
        });
      }

      setMessage("Profil mis à jour avec succès.");
    } catch (err) {
      console.error("Erreur modification profil :", err);

      setError(
        err.response?.data?.message ||
          "Impossible de modifier le profil."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Modifier mot de passe
  |--------------------------------------------------------------------------
  */

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      passwordForm.password !==
      passwordForm.password_confirmation
    ) {
      setError(
        "La confirmation du mot de passe ne correspond pas."
      );

      return;
    }

    if (passwordForm.password.length < 8) {
      setError(
        "Le nouveau mot de passe doit contenir au moins 8 caractères."
      );

      return;
    }

    try {
      setPasswordSaving(true);

      await api.patch(
        "/profile/password",
        passwordForm
      );

      setPasswordForm({
        current_password: "",
        password: "",
        password_confirmation: "",
      });

      setMessage(
        "Mot de passe modifié avec succès."
      );
    } catch (err) {
      console.error(
        "Erreur modification mot de passe :",
        err
      );

      setError(
        err.response?.data?.message ||
          "Impossible de modifier le mot de passe."
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Déconnexion
  |--------------------------------------------------------------------------
  */

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.error("Erreur logout :", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login");
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Initiales
  |--------------------------------------------------------------------------
  */

  const getInitials = () => {
    if (!user?.name) {
      return "U";
    }

    const parts = user.name
      .trim()
      .split(" ")
      .filter(Boolean);

    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    return (
      parts[0].charAt(0) +
      parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  /*
  |--------------------------------------------------------------------------
  | Rôle
  |--------------------------------------------------------------------------
  */

  const getRoleLabel = () => {
    const role =
      user?.role?.name ||
      user?.role ||
      user?.roles?.[0]?.name ||
      "";

    const roles = {
      admin: "Administrateur",
      topographe: "Topographe",
      technicien: "Technicien",
    };

    return roles[role] || role || "Utilisateur";
  };

  /*
  |--------------------------------------------------------------------------
  | Date création compte
  |--------------------------------------------------------------------------
  */

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    try {
      return new Date(date).toLocaleDateString(
        "fr-FR",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      );
    } catch {
      return "—";
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <div className="h-8 w-32 animate-pulse rounded-lg bg-gray-200" />

          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="h-72 animate-pulse rounded-2xl bg-gray-200" />

          <div className="h-72 animate-pulse rounded-2xl bg-gray-200 lg:col-span-2" />
        </div>

        <div className="mt-6 h-80 animate-pulse rounded-2xl bg-gray-200" />
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Interface
  |--------------------------------------------------------------------------
  */

  return (
    <div className="p-6">
      {/* =========================================================
          HEADER
      ========================================================= */}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Profil
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Gérez vos informations personnelles et votre compte.
        </p>
      </div>

      {/* =========================================================
          MESSAGES
      ========================================================= */}

      {message && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* =========================================================
          PROFIL + INFORMATIONS
      ========================================================= */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* =======================================================
            CARTE UTILISATEUR
        ======================================================= */}

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col items-center p-8 text-center">
            {/* Avatar */}

            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-900 text-3xl font-bold text-white shadow-sm">
              {getInitials()}
            </div>

            {/* Nom */}

            <h2 className="mt-5 text-xl font-bold text-gray-900">
              {user?.name || "Utilisateur"}
            </h2>

            {/* Email */}

            <p className="mt-1 break-all text-sm text-gray-500">
              {user?.email || "—"}
            </p>

            {/* Role */}

            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2">
              <ShieldCheck
                size={15}
                className="text-gray-700"
              />

              <span className="text-xs font-semibold text-gray-700">
                {getRoleLabel()}
              </span>
            </div>

            {/* Date */}

            <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
              <CalendarDays size={15} />

              <span>
                Compte créé le{" "}
                {formatDate(user?.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* =======================================================
            INFORMATIONS PERSONNELLES
        ======================================================= */}

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm lg:col-span-2">
          <div className="border-b border-gray-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                <UserRound size={19} />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  Informations personnelles
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Modifiez les informations de votre compte.
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6"
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Nom */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Nom complet
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                    placeholder="Votre nom"
                  />
                </div>
              </div>

              {/* Email */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Adresse email
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              {/* Téléphone */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Téléphone
                </label>

                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    name="telephone"
                    value={form.telephone}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                    placeholder="06 XX XX XX XX"
                  />
                </div>
              </div>

              {/* Rôle non modifiable */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Rôle
                </label>

                <div className="flex h-[46px] items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4">
                  <ShieldCheck
                    size={18}
                    className="text-gray-500"
                  />

                  <span className="text-sm font-medium text-gray-700">
                    {getRoleLabel()}
                  </span>

                  <span className="ml-auto text-xs text-gray-400">
                    Non modifiable
                  </span>
                </div>
              </div>
            </div>

            {/* Bouton */}

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={17} />

                {saving
                  ? "Enregistrement..."
                  : "Enregistrer les modifications"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* =========================================================
          SÉCURITÉ
      ========================================================= */}

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
              <Lock size={19} />
            </div>

            <div>
              <h2 className="font-semibold text-gray-900">
                Sécurité
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Modifiez le mot de passe de votre compte.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handlePasswordSubmit}
          className="p-6"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {/* Ancien mot de passe */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Ancien mot de passe
              </label>

              <div className="relative">
                <input
                  type={
                    showCurrentPassword
                      ? "text"
                      : "password"
                  }
                  name="current_password"
                  value={
                    passwordForm.current_password
                  }
                  onChange={handlePasswordChange}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-4 pr-11 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowCurrentPassword(
                      !showCurrentPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showCurrentPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Nouveau mot de passe */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Nouveau mot de passe
              </label>

              <div className="relative">
                <input
                  type={
                    showNewPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={passwordForm.password}
                  onChange={handlePasswordChange}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-4 pr-11 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowNewPassword(
                      !showNewPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showNewPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirmation */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Confirmation
              </label>

              <div className="relative">
                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="password_confirmation"
                  value={
                    passwordForm.password_confirmation
                  }
                  onChange={handlePasswordChange}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-4 pr-11 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={passwordSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Lock size={17} />

              {passwordSaving
                ? "Modification..."
                : "Modifier le mot de passe"}
            </button>
          </div>
        </form>
      </div>

     
    </div>
  );
}