import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Clients from "./pages/clients/Clients";
import CreateClient from "./pages/clients/CreateClient";
import ClientDetails from "./pages/clients/ClientDetails";
import EditClient from "./pages/clients/EditClient";
import Projets from "./pages/projets/Projets";
import CreateProjet from "./pages/projets/CreateProjet";
import EditProjet from "./pages/projets/EditProjet";
import ProjetDetails from "./pages/projets/ProjetDetails";
import Missions from "./pages/missions/Missions";
import CreateMission from "./pages/missions/CreateMission";
import EditMission from "./pages/missions/EditMission";
import MissionDetails from "./pages/missions/MissionDetails";
import Interventions from "./pages/interventions/Interventions";
import CreateIntervention from "./pages/interventions/CreateIntervention";
import EditIntervention from "./pages/interventions/EditIntervention";
import InterventionDetails from "./pages/interventions/InterventionDetails";
import Documents from "./pages/documents/Documents";
import UploadDocument from "./pages/documents/UploadDocument";
import DocumentDetails from "./pages/documents/DocumentDetails";
import Photos from "./pages/photos/Photos";
import UploadPhoto from "./pages/photos/UploadPhoto";
import PhotoDetails from "./pages/photos/PhotoDetails";
import Notes from "./pages/notes/Notes";
import CreateNote from "./pages/notes/CreateNote";
import EditNote from "./pages/notes/EditNote";
import NoteDetails from "./pages/notes/NoteDetails";
import Rapports from "./pages/rapports/Rapports";
import CreateRapport from "./pages/rapports/CreateRapport";
import EditRapport from "./pages/rapports/EditRapport";
import RapportDetails from "./pages/rapports/RapportDetails";
import Devis from "./pages/devis/Devis";
import CreateDevis from "./pages/devis/CreateDevis";
import EditDevis from "./pages/devis/EditDevis";
import DevisDetails from "./pages/devis/DevisDetails";
import Factures from "./pages/factures/Factures";
import CreateFacture from "./pages/factures/CreateFacture";
import EditFacture from "./pages/factures/EditFacture";
import FactureDetails from "./pages/factures/FactureDetails";
import Paiements from "./pages/paiements/Paiements";
import CreatePaiement from "./pages/paiements/CreatePaiement";
import EditPaiement from "./pages/paiements/EditPaiement";
import PaiementDetails from "./pages/paiements/PaiementDetails";
import Notifications from "./pages/notifications/Notifications";
import Profile from "./pages/profile/Profile";

import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";

export default function App() {
  return (
    <Routes>

      {/* =====================================================
          AUTH
      ===================================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* =====================================================
          APPLICATION PROTÉGÉE
      ===================================================== */}

      <Route element={<ProtectedRoute />}>

        <Route element={<MainLayout />}>

          {/* =================================================
              DASHBOARD
          ================================================= */}

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />


          <Route path="/profile" element={<Profile />} />
          

          {/* =================================================
              CLIENTS
          ================================================= */}

          <Route
            path="/clients"
            element={<Clients />}
          />

          <Route
            path="/clients/create"
            element={<CreateClient />}
          />

          <Route
            path="/clients/:id"
            element={<ClientDetails />}
          />

          <Route
            path="/clients/:id/edit"
            element={<EditClient />}
          />

          {/* =================================================
              PROJETS
          ================================================= */}

          <Route
            path="/projets"
            element={<Projets />}
          />

          <Route
            path="/projets/create"
            element={<CreateProjet />}
          />

          <Route
            path="/projets/:id"
            element={<ProjetDetails />}
          />

          <Route
            path="/projets/:id/edit"
            element={<EditProjet />}
          />

          {/* =================================================
              MISSIONS
          ================================================= */}

          <Route
            path="/missions"
            element={<Missions />}
          />

          <Route
            path="/missions/create"
            element={<CreateMission />}
          />

          <Route
            path="/missions/:id"
            element={<MissionDetails />}
          />

          <Route
            path="/missions/:id/edit"
            element={<EditMission />}
          />

          {/* =================================================
              INTERVENTIONS
          ================================================= */}

          <Route
            path="/interventions"
            element={<Interventions />}
          />

          <Route
            path="/interventions/create"
            element={<CreateIntervention />}
          />

          <Route
            path="/interventions/:id"
            element={<InterventionDetails />}
          />

          <Route
            path="/interventions/:id/edit"
            element={<EditIntervention />}
          />

          {/* =================================================
              DOCUMENTS
          ================================================= */}

          <Route
            path="/documents"
            element={<Documents />}
          />

          <Route
            path="/documents/upload"
            element={<UploadDocument />}
          />

          <Route
            path="/documents/:id"
            element={<DocumentDetails />}
          />

          {/* =================================================
              PHOTOS
          ================================================= */}

          <Route
            path="/photos"
            element={<Photos />}
          />

          <Route
            path="/photos/upload"
            element={<UploadPhoto />}
          />

          <Route
            path="/photos/:id"
            element={<PhotoDetails />}
          />

          {/* =================================================
              NOTES
          ================================================= */}

          <Route
            path="/notes"
            element={<Notes />}
          />

          <Route
            path="/notes/create"
            element={<CreateNote />}
          />

          <Route
            path="/notes/:id"
            element={<NoteDetails />}
          />

          <Route
            path="/notes/:id/edit"
            element={<EditNote />}
          />

          {/* =================================================
              RAPPORTS
          ================================================= */}

          <Route
            path="/rapports"
            element={<Rapports />}
          />

          <Route
            path="/rapports/create"
            element={<CreateRapport />}
          />

          <Route
            path="/rapports/:id"
            element={<RapportDetails />}
          />

          <Route
            path="/rapports/:id/edit"
            element={<EditRapport />}
          />

          {/* =================================================
              DEVIS
          ================================================= */}

          <Route
            path="/devis"
            element={<Devis />}
          />

          <Route
            path="/devis/create"
            element={<CreateDevis />}
          />

          <Route
            path="/devis/:id"
            element={<DevisDetails />}
          />

          <Route
            path="/devis/:id/edit"
            element={<EditDevis />}
          />

          {/* =================================================
              FACTURES
          ================================================= */}

          <Route
            path="/factures"
            element={<Factures />}
          />

          <Route
            path="/factures/create"
            element={<CreateFacture />}
          />

          <Route
            path="/factures/:id"
            element={<FactureDetails />}
          />

          <Route
            path="/factures/:id/edit"
            element={<EditFacture />}
          />

          {/* =================================================
              PAIEMENTS
          ================================================= */}

          <Route
            path="/paiements"
            element={<Paiements />}
          />

          <Route
            path="/paiements/create"
            element={<CreatePaiement />}
          />

          <Route
            path="/paiements/:id"
            element={<PaiementDetails />}
          />

          <Route
            path="/paiements/:id/edit"
            element={<EditPaiement />}
          />

          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          <Route
            path="/notifications"
            element={<Notifications />}
          />

        </Route>
      </Route>

      {/* =====================================================
          DEFAULT
      ===================================================== */}

      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

    </Routes>
  );
}
