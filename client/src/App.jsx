// App.jsx - Main Application Layout with Tab Navigation and Global State

import React, { useState } from 'react';
import { TelemetryProvider } from './context/TelemetryContext';
import Navbar from './components/Navbar';
import SafetyBanner from './components/SafetyBanner';
import Footer from './components/Footer';

// 5 Core Route Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AIPrediction from './pages/AIPrediction';
import DigitalTwin from './pages/DigitalTwin';
import ReportsAnalytics from './pages/ReportsAnalytics';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <TelemetryProvider>
      <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 selection:bg-lime selection:text-zinc-950">
        {/* Global Navigation Bar */}
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Global Safety Alert Banner */}
        <SafetyBanner />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28">
          {activeTab === 'home' && <Home setActiveTab={setActiveTab} />}
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'ai' && <AIPrediction />}
          {activeTab === 'twin' && <DigitalTwin />}
          {activeTab === 'reports' && <ReportsAnalytics />}
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </TelemetryProvider>
  );
}

export default App;
