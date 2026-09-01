// TelemetryContext.jsx - Central State & Robust Socket.IO Manager for BTMS

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const TelemetryContext = createContext(null);

// Determine direct backend URL in dev mode to avoid Vite WS proxy handshake aborts
const SOCKET_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:5000'
  : window.location.origin;

// Singleton socket instance preventing StrictMode double-mount connection teardowns
let socket;
const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      autoConnect: true
    });
  }
  return socket;
};

export const TelemetryProvider = ({ children }) => {
  const [telemetry, setTelemetry] = useState(null);
  const [history, setHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [connected, setConnected] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(isPaused);

  const [selectedCell, setSelectedCell] = useState("C5");
  const [simConfig, setSimConfig] = useState({
    reynolds: 550,
    concentration: 2.0,
    flowRate: 0.035,
    inletTemp: 25.0,
    dischargeCurrent: 9.6
  });

  // Keep isPausedRef in sync
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Fetch initial history snapshot via REST
  const fetchInitialData = useCallback(async () => {
    try {
      const [histRes, alertRes] = await Promise.all([
        axios.get('/api/telemetry/history?limit=45'),
        axios.get('/api/telemetry/alerts')
      ]);

      if (histRes.data && Array.isArray(histRes.data) && histRes.data.length > 0) {
        setHistory(histRes.data);
        setTelemetry(histRes.data[histRes.data.length - 1]);
      }
      if (alertRes.data) {
        setAlerts(alertRes.data);
      }
    } catch (err) {
      console.warn("Could not fetch initial telemetry REST payload:", err.message);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();

    const socketInstance = getSocket();

    const handleConnect = () => {
      console.log('⚡ Connected to BTMS Telemetry Socket');
      setConnected(true);
    };

    const handleDisconnect = () => {
      console.log('❌ Disconnected from BTMS Telemetry Socket');
      setConnected(false);
    };

    const handleTick = (data) => {
      if (isPausedRef.current) return;

      setTelemetry(data);
      setHistory((prev) => {
        const next = [...prev, data];
        return next.length > 120 ? next.slice(-120) : next;
      });
    };

    // If already connected, immediately mark connected
    if (socketInstance.connected) {
      setConnected(true);
    }

    socketInstance.on('connect', handleConnect);
    socketInstance.on('disconnect', handleDisconnect);
    socketInstance.on('telemetry:tick', handleTick);

    return () => {
      socketInstance.off('connect', handleConnect);
      socketInstance.off('disconnect', handleDisconnect);
      socketInstance.off('telemetry:tick', handleTick);
    };
  }, [fetchInitialData]);

  // Update simulator parameters
  const updateSimConfig = async (newParams) => {
    try {
      const merged = { ...simConfig, ...newParams };
      setSimConfig(merged);
      await axios.post('/api/telemetry/config', merged);
    } catch (err) {
      console.error("Failed to update simulator params:", err);
    }
  };

  // Inject anomaly
  const injectAnomaly = async (type = 'TEMP_SPIKE') => {
    try {
      const res = await axios.post('/api/telemetry/anomaly', { type });
      const alertRes = await axios.get('/api/telemetry/alerts');
      setAlerts(alertRes.data);
      return res.data;
    } catch (err) {
      console.error("Failed to inject anomaly:", err);
    }
  };

  return (
    <TelemetryContext.Provider
      value={{
        telemetry,
        history,
        alerts,
        connected,
        isPaused,
        setIsPaused,
        selectedCell,
        setSelectedCell,
        simConfig,
        updateSimConfig,
        injectAnomaly,
        refreshAlerts: async () => {
          const res = await axios.get('/api/telemetry/alerts');
          setAlerts(res.data);
        }
      }}
    >
      {children}
    </TelemetryContext.Provider>
  );
};

export const useTelemetry = () => useContext(TelemetryContext);
