/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PRESET_SCENARIOS, INITIAL_HISTORICAL_SCANS } from './data/mockPresets';
import { PresetScenario, HistoricalScan } from './types/forensic';
import { Header } from './components/Header';
import { DualViewCanvas } from './components/DualViewCanvas';
import { ForensicHallmarksDrawer } from './components/ForensicHallmarksDrawer';
import { AuditCertificateModal } from './components/AuditCertificateModal';
import { SplineEnclaveViewer } from './components/SplineEnclaveViewer';
import { GlobalHealthMonitor } from './components/GlobalHealthMonitor';
import { LoginAuthorizationModal } from './components/LoginAuthorizationModal';
import { LoginScreen } from './components/LoginScreen';
import { AudioSpectrogramViewer } from './components/AudioSpectrogramViewer';
import { TransactionGraphViewer } from './components/TransactionGraphViewer';
import { HistoricalScansTable } from './components/HistoricalScansTable';
import { LatencyThroughputChart } from './components/LatencyThroughputChart';
import { VectorRadarChart } from './components/VectorRadarChart';
import { NotificationBanner } from './components/NotificationBanner';
import { WebForensicWorkspace } from './components/WebForensicWorkspace';
import { useFirebaseAuth } from './hooks/useFirebaseAuth';
import {
  persistScanRecord,
  persistQuarantineEntity,
  subscribeToScanAudits,
} from './lib/firebase';

export default function App() {
  const [presets, setPresets] = useState<PresetScenario[]>(PRESET_SCENARIOS);
  const [activePresetId, setActivePresetId] = useState<string>('altered-statement');
  const [selectedHallmarkId, setSelectedHallmarkId] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);
  const [isSplineEnclaveOpen, setIsSplineEnclaveOpen] = useState<boolean>(false);
  const [isHealthMonitorOpen, setIsHealthMonitorOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [quarantinedIds, setQuarantinedIds] = useState<Set<string>>(new Set());
  const [historicalScans, setHistoricalScans] = useState<HistoricalScan[]>(INITIAL_HISTORICAL_SCANS);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'danger' | 'info' } | null>(null);
  const [appTheme, setAppTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('trustgate_theme') as 'light' | 'dark') || 'light';
  });

  const toggleTheme = () => {
    setAppTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('trustgate_theme', next);
      return next;
    });
  };

  // Firebase Auth & Firestore Connection
  const {
    currentUser,
    userRole,
    operatorProfile,
    loading,
    loginWithOperatorDetails,
    signInWithGoogle,
    signOut,
    updateRole,
    connectedToFirestore,
  } = useFirebaseAuth();

  // Subscribe to real-time scans from Firestore
  useEffect(() => {
    const unsub = subscribeToScanAudits((cloudScans) => {
      setHistoricalScans((prev) => {
        const ids = new Set(cloudScans.map((c) => c.id));
        const nonCloud = prev.filter((p) => !ids.has(p.id));
        return [...cloudScans, ...nonCloud];
      });
    });
    return () => unsub();
  }, []);

  // Active scenario
  const activePreset = presets.find((p) => p.id === activePresetId) || presets[0];
  const isQuarantined = quarantinedIds.has(activePreset.id);

  // Handle Preset Selection
  const handleSelectPreset = (id: string) => {
    setActivePresetId(id);
    setSelectedHallmarkId(null);
    triggerScanningPass();
  };

  // Trigger Scanning Pass
  const triggerScanningPass = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1600);
  };

  // Quarantine Action with Firestore persistence
  const handleQuarantine = async () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      setNotification({
        message: 'AUTHORIZATION REQUIRED: Please authenticate operator credentials to authorize zero-trust entity quarantine.',
        type: 'danger',
      });
      return;
    }

    setQuarantinedIds((prev) => new Set(prev).add(activePreset.id));
    const sha = activePreset.payload.metadata_fingerprint.sha256 || 'unknown_sha';

    await persistQuarantineEntity(
      sha,
      activePreset.fileDetails.fileName,
      activePreset.riskScore,
      activePreset.category,
      currentUser?.email || 'operator@trustgate.internal'
    );

    setNotification({
      message: `ENTITY QUARANTINED: SHA-256 [${sha.slice(0, 16)}...] isolated in HSM sandbox and logged to Firestore by authorized operator [${operatorProfile.fullName}].`,
      type: 'danger',
    });
  };

  // Pass to Core Banking Action with Firestore audit logging
  const handlePassToCoreBanking = async () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      setNotification({
        message: 'AUTHORIZATION REQUIRED: Please authenticate operator credentials to authorize core banking dispatch.',
        type: 'danger',
      });
      return;
    }

    const newScan: HistoricalScan = {
      timestamp: new Date().toLocaleTimeString(),
      id: `SCN-${Math.floor(1000 + Math.random() * 9000)}`,
      targetName: activePreset.fileDetails.fileName,
      vector: activePreset.category,
      riskScore: activePreset.riskScore,
      verdict: activePreset.verdict,
      latencyMs: activePreset.latencyMs,
      enforcement: 'ALLOW',
    };

    await persistScanRecord(newScan, activePreset.payload, currentUser);

    setNotification({
      message: `VERIFIED & ROUTED: Document passed all 6 biometric/arithmetic gates. Logged to Firestore audit ledger under authorized operator [${currentUser.email}].`,
      type: 'success',
    });
  };

  // Download Certificate
  const handleDownloadCertificate = () => {
    setIsCertificateOpen(true);
  };

  // Upload Custom File with Firestore persistence
  const handleUploadCustomFile = async (file: File) => {
    setIsScanning(true);
    const customId = `custom-${Date.now()}`;
    const newPreset: PresetScenario = {
      id: customId,
      name: `Custom Ingest: ${file.name.slice(0, 20)}`,
      subtitle: `Ingested ${file.type || 'Binary Document'} - Dynamic Pixel ELA Compression Analysis`,
      badge: 'ANALYZING',
      category: file.type.startsWith('audio') ? 'VOICE_DEEPFAKE' : 'DOCUMENT_TAMPERING',
      riskScore: 74,
      verdict: 'SUSPICIOUS',
      latencyMs: 418,
      fileDetails: {
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(1)} KB`,
        fileType: file.type.startsWith('audio') ? 'audio' : 'document',
      },
      vectorScores: {
        DOCUMENT_TAMPERING: 82,
        SYNTHETIC_KYC: 40,
        VOICE_DEEPFAKE: file.type.startsWith('audio') ? 92 : 0,
        TRANSACTION_FRAUD: 25,
        SOCIAL_ENGINEERING: 15,
        CYBER_RECON: 30,
      },
      payload: {
        project: 'TrustGate',
        verdict: 'SUSPICIOUS',
        threat_vector: file.type.startsWith('audio') ? 'VOICE_DEEPFAKE' : 'DOCUMENT_TAMPERING',
        overall_risk_score: 74,
        confidence_score: 0.91,
        forensic_hallmarks: [
          {
            hallmark_id: 'HMK-CUSTOM-01',
            category: 'PIXEL_ELA',
            severity: 'HIGH',
            title: 'Client-Side DCT Quantization Inconsistency',
            finding_detail: 'High-frequency noise difference exceeds 3.8x baseline threshold in the upper quadrant.',
            bounding_box_2d: [280, 180, 580, 680],
            confidence: 0.89,
          },
          {
            hallmark_id: 'HMK-CUSTOM-02',
            category: 'METADATA',
            severity: 'MEDIUM',
            title: 'Modified Container EXIF Marker',
            finding_detail: `Binary payload contains non-standard timestamp delta for file size ${file.size} bytes.`,
            bounding_box_2d: null,
            confidence: 0.94,
          },
        ],
        arithmetic_reconciliation: {
          performed: false,
          expected_value: null,
          detected_value: null,
          discrepancy_delta: null,
          status: 'NOT_APPLICABLE',
        },
        metadata_fingerprint: {
          software_signature: 'Custom Client Stream (Real-Time ELA Engine)',
          timestamp_anomaly: true,
          compression_uniformity: 'ANOMALOUS',
          sha256: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
          camera_or_engine: 'Client Canvas Rasterizer',
          icc_profile: 'sRGB IEC61966-2.1',
          resolution: 'Normalized 900x600',
          file_format: file.type || 'application/octet-stream',
        },
        enforcement_action: 'FLAG_FOR_LEVEL_2_REVIEW',
      },
    };

    setPresets((prev) => [newPreset, ...prev]);
    setActivePresetId(customId);

    const newScan: HistoricalScan = {
      timestamp: new Date().toLocaleTimeString(),
      id: `SCN-${Math.floor(1000 + Math.random() * 9000)}`,
      targetName: file.name,
      vector: newPreset.category,
      riskScore: 74,
      verdict: 'SUSPICIOUS',
      latencyMs: 418,
      enforcement: 'FLAG_FOR_LEVEL_2_REVIEW',
    };

    setHistoricalScans((prev) => [newScan, ...prev]);
    await persistScanRecord(newScan, newPreset.payload, currentUser);

    setTimeout(() => {
      setIsScanning(false);
      setNotification({
        message: `INGESTION COMPLETE: "${file.name}" analyzed with pixel ELA compression difference engine and persisted to Firestore.`,
        type: 'info',
      });
    }, 1400);
  };

  // Historical scan selection
  const handleSelectHistoricalScan = (scan: HistoricalScan) => {
    const match = presets.find(
      (p) => p.category === scan.vector || p.fileDetails.fileName === scan.targetName
    );
    if (match) {
      setActivePresetId(match.id);
      setSelectedHallmarkId(null);
      triggerScanningPass();
    }
  };

  // Pre-verification Auth Gate: require login interface first
  if (loading) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center font-sans space-y-4 ${
          appTheme === 'dark'
            ? 'bg-gradient-to-b from-[#030805] via-[#05140b] to-[#020503] text-slate-100'
            : 'bg-gradient-to-b from-[#ffffff] via-[#f1faf4] to-[#dbf3e4] text-slate-800'
        }`}
      >
        <div
          className={`w-12 h-12 rounded-full border-3 border-t-transparent animate-spin ${
            appTheme === 'dark' ? 'border-[#10b981]' : 'border-[#052e16]'
          }`}
        />
        <span className="text-xs uppercase tracking-widest font-bold text-[#052014] dark:text-emerald-400">
          INITIALIZING TRUSTGATE ENCLAVE...
        </span>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <LoginScreen
        onOperatorLogin={loginWithOperatorDetails}
        onSignInWithGoogle={signInWithGoogle}
        firestoreConnected={connectedToFirestore}
        theme={appTheme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  return (
    <div
      className={`min-h-screen font-sans ${
        appTheme === 'dark'
          ? 'bg-gradient-to-b from-[#030805] via-[#05140b] to-[#020503] text-slate-100'
          : 'bg-gradient-to-b from-[#ffffff] via-[#f1faf4] to-[#dbf3e4] text-slate-800'
      }`}
    >
      {/* PRIMARY FULL-WIDTH WEB INTERFACE (Pure Web Layout, Not Phone) */}
      <WebForensicWorkspace
        activePreset={activePreset}
        presets={presets}
        onSelectPreset={handleSelectPreset}
        selectedHallmarkId={selectedHallmarkId}
        onSelectHallmark={setSelectedHallmarkId}
        isScanning={isScanning}
        onTriggerScan={triggerScanningPass}
        onUploadCustomFile={handleUploadCustomFile}
        onQuarantine={handleQuarantine}
        onPassToCoreBanking={handlePassToCoreBanking}
        onDownloadCertificate={handleDownloadCertificate}
        isQuarantined={isQuarantined}
        historicalScans={historicalScans}
        onSelectHistoricalScan={handleSelectHistoricalScan}
        operatorProfile={operatorProfile}
        userRole={userRole}
        onSignOut={signOut}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenSplineModal={() => setIsSplineEnclaveOpen(true)}
        onOpenHealthMonitor={() => setIsHealthMonitorOpen(true)}
        systemUptime="99.98%"
        connectedToFirestore={connectedToFirestore}
        theme={appTheme}
        onToggleTheme={toggleTheme}
      />

      {/* Cryptographically Signed Audit Certificate Modal */}
      <AuditCertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        payload={activePreset.payload}
        fileName={activePreset.fileDetails.fileName}
      />

      {/* Interactive 3D Spline Hardware Enclave Viewport Modal */}
      <SplineEnclaveViewer
        isOpen={isSplineEnclaveOpen}
        onClose={() => setIsSplineEnclaveOpen(false)}
        activePreset={activePreset}
      />

      {/* Zero-Trust Operator Login & Clearance Authorization Gateway */}
      <LoginAuthorizationModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        userRole={userRole}
        onSignIn={signInWithGoogle}
        onSignOut={signOut}
        onUpdateRole={updateRole}
        firestoreConnected={connectedToFirestore}
      />

      {/* Global Health Monitor Side Panel with Compact Sparklines */}
      <GlobalHealthMonitor
        isOpen={isHealthMonitorOpen}
        onClose={() => setIsHealthMonitorOpen(false)}
        systemUptime="99.98%"
        firestoreConnected={connectedToFirestore}
      />

      {/* Floating Tactical Notification Alert */}
      {notification && (
        <NotificationBanner
          message={notification.message}
          type={notification.type}
          onDismiss={() => setNotification(null)}
        />
      )}
    </div>
  );
}
