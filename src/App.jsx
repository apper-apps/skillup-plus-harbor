import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Components
import Header from "@/components/organisms/Header";

// Pages
import HomePage from "@/components/pages/HomePage";
import MembershipPage from "@/components/pages/MembershipPage";
import MasterPage from "@/components/pages/MasterPage";
import InsightsPage from "@/components/pages/InsightsPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Header />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/membership" element={<MembershipPage />} />
            <Route path="/membership/:courseId" element={<MembershipPage />} />
            <Route path="/master" element={<MasterPage />} />
            <Route path="/master/:courseId" element={<MasterPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/insights/:articleId" element={<InsightsPage />} />
          </Routes>
        </main>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;