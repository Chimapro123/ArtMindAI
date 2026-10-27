import { Routes, Route, useLocation } from "react-router-dom";
import SiteLayout from "./components/SiteLayout";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import ScrollToTop from "./components/ScrollToTop";
import GuideWidget from "./components/GuideWidget";
import Home from "./pages/Home/Home";
import Gallery from "./pages/Gallery/Gallery";
import Painting from "./pages/Painting/Painting";
import Artists from "./pages/Artists/Artists";
import Artist from "./pages/Artist/Artist";
import Collections from "./pages/Collections/Collections";
import Collection from "./pages/Collection/Collection";
import SearchResults from "./pages/SearchResults/SearchResults";
import Guide from "./pages/Guide/Guide";
import ImageLab from "./pages/ImageLab/ImageLab";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Login from "./pages/Login/Login";
import Join from "./pages/Join/Join";
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import Dashboard from "./pages/Dashboard/Dashboard";
import Saved from "./pages/Saved/Saved";
import Profile from "./pages/Profile/Profile";
import AdminOverview from "./pages/AdminOverview/AdminOverview";
import ManagePaintings from "./pages/ManagePaintings/ManagePaintings";
import PaintingEditor from "./pages/PaintingEditor/PaintingEditor";
import NotFound from "./pages/NotFound/NotFound";

function App() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <div className="page" key={location.pathname}>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/painting/:slug" element={<Painting />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/artists/:slug" element={<Artist />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/collections/:slug" element={<Collection />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/guide"
              element={
                <ProtectedRoute>
                  <Guide />
                </ProtectedRoute>
              }
            />
            <Route
              path="/image-lab"
              element={
                <ProtectedRoute>
                  <ImageLab />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/saved"
              element={
                <ProtectedRoute>
                  <Saved />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/join" element={<Join />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminOverview />} />
            <Route path="paintings" element={<ManagePaintings />} />
            <Route path="paintings/new" element={<PaintingEditor />} />
            <Route path="paintings/:slug/edit" element={<PaintingEditor />} />
          </Route>
        </Routes>
      </div>
      <GuideWidget />
    </>
  );
}

export default App;
