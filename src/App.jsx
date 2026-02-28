import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { MusicProvider } from "./context/MusicContext";
import { PhotoProvider } from "./context/PhotoContext";
import PinGate from "./components/PinGate";
import Navbar from "./components/Navbar";
import MusicPlayer from "./components/MusicPlayer";
import FloatingParticles from "./components/FloatingParticles";
import DailyMomentPopup from "./components/DailyMomentPopup";
import Home from "./pages/Home";
import FamilyProfiles from "./pages/FamilyProfiles";
import Gallery from "./pages/Gallery";
import Timeline from "./pages/Timeline";
import Favorites from "./pages/Favorites";
import Upload from "./pages/Upload";
import Surprise from "./pages/Surprise";
import ManageSongs from "./pages/ManageSongs";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PinGate>
          <ThemeProvider>
            <PhotoProvider>
              <MusicProvider>
                <FloatingParticles />
                <Navbar />
                <main className="relative z-10">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/family" element={<FamilyProfiles />} />
                    <Route path="/family/:memberId" element={<FamilyProfiles />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/timeline" element={<Timeline />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/upload" element={<Upload />} />
                    <Route path="/songs" element={<ManageSongs />} />
                    <Route path="/surprise" element={<Surprise />} />
                  </Routes>
                </main>
                <MusicPlayer />
                <DailyMomentPopup />
              </MusicProvider>
            </PhotoProvider>
          </ThemeProvider>
        </PinGate>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
