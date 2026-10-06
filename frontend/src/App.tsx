import React, { useState, useEffect } from 'react';
import { ActivePage, AnalysisResult, BusinessInput, BusinessMode, PresetBusiness } from './types/bizguard';
import { STARTUP_PRESETS, predictBusinessRisk, getAnalysisHistory } from './services/api';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CreateCompanyModal } from './components/CreateCompanyModal';
import { AiCfoDrawer } from './components/AiCfoDrawer';
import { CsvImportModal } from './components/CsvImportModal';
import { LedgerDailyEntry } from './types/bizguard';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { BusinessInput as BusinessInputPage } from './pages/BusinessInput';
import { CashFlowLedger } from './pages/CashFlowLedger';
import { PredictionResult } from './pages/PredictionResult';
import { SHAPExplanation } from './pages/SHAPExplanation';
import { Recommendations } from './pages/Recommendations';
import { Reports } from './pages/Reports';
import { ModelDiagnostics } from './pages/ModelDiagnostics';
import './style.css';

export function App() {
  const [activePage, setActivePage] = useState<ActivePage>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [businessMode, setBusinessMode] = useState<BusinessMode>('tech_startup');
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [companies, setCompanies] = useState<PresetBusiness[]>(() => {
    try {
      const saved = localStorage.getItem('startguard_companies');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return STARTUP_PRESETS;
  });
  const [inputFormData, setInputFormData] = useState<BusinessInput | undefined>(STARTUP_PRESETS[0].data);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isCsvImportOpen, setIsCsvImportOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    (localStorage.getItem('sg_theme') as 'light' | 'dark') || 'dark'
  );

  useEffect(() => {
    document.body.className = theme === 'light' ? 'theme-light' : '';
    localStorage.setItem('sg_theme', theme);
  }, [theme]);

  useEffect(() => {
    const initialCompany = companies[0]?.data || STARTUP_PRESETS[0].data;
    predictBusinessRisk(initialCompany).then(res => {
      setCurrentAnalysis(res);
    });
    getAnalysisHistory().then(setHistory);
  }, []);

  const handleSelectPreset = (preset: BusinessInput) => {
    setInputFormData(preset);
    predictBusinessRisk(preset).then(res => {
      setCurrentAnalysis(res);
      setHistory(prev => [res, ...prev.filter(h => h.id !== res.id)]);
    });
  };

  const handleAddCompany = (newCompany: PresetBusiness) => {
    setCompanies(prev => {
      const updated = [newCompany, ...prev.filter(c => c.data.company_name !== newCompany.data.company_name)];
      try {
        localStorage.setItem('startguard_companies', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setInputFormData(newCompany.data);
    predictBusinessRisk(newCompany.data).then(res => {
      setCurrentAnalysis(res);
      setHistory(prev => [res, ...prev.filter(h => h.id !== res.id)]);
      setActivePage('dashboard');
    });
  };

  const handleDeleteCompany = (companyName: string) => {
    setCompanies(prev => {
      const updated = prev.filter(c => c.data.company_name !== companyName);
      try {
        localStorage.setItem('startguard_companies', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // If active company was deleted, switch to the first remaining company
    const remaining = companies.filter(c => c.data.company_name !== companyName);
    if (remaining.length > 0) {
      if (currentAnalysis?.company_name === companyName) {
        handleSelectPreset(remaining[0].data);
      }
    } else {
      // If all companies were deleted, restore the base example
      setCompanies(STARTUP_PRESETS);
      handleSelectPreset(STARTUP_PRESETS[0].data);
    }
  };

  const handleUpdateCompanyMetrics = async (updatedData: BusinessInput) => {
    setInputFormData(updatedData);
    const res = await predictBusinessRisk(updatedData);
    setCurrentAnalysis(res);
    setHistory(prev => [res, ...prev.filter(h => h.id !== res.id)]);

    setCompanies(prev =>
      prev.map(c =>
        c.data.company_name === updatedData.company_name
          ? {
              ...c,
              subtitle: `${res.runway_months} mo runway · $${(updatedData.monthly_burn_rate / 1000).toFixed(0)}k/mo burn`,
              tag: res.risk_level,
              data: updatedData
            }
          : c
      )
    );
  };

  const handleSubmitAnalysis = async (data: BusinessInput) => {
    setInputFormData(data);
    const res = await predictBusinessRisk(data);
    setCurrentAnalysis(res);
    setHistory(prev => [res, ...prev.filter(h => h.id !== res.id)]);

    setCompanies(prev => {
      if (!prev.some(c => c.data.company_name.toLowerCase() === data.company_name.toLowerCase())) {
        const customPreset: PresetBusiness = {
          id: `custom_${Date.now()}`,
          title: `${data.company_name} (${data.startup_stage || 'Custom'})`,
          subtitle: `${res.runway_months} mo runway · $${(data.monthly_burn_rate / 1000).toFixed(0)}k/mo burn`,
          tag: res.risk_level,
          stage: data.startup_stage || 'Custom Stage',
          sector: (data.business_type as PresetBusiness['sector']) || 'tech_startup',
          description: `Custom venture in ${data.industry || 'Tech'}.`,
          data
        };
        const updated = [customPreset, ...prev];
        try {
          localStorage.setItem('startguard_companies', JSON.stringify(updated));
        } catch {}
        return updated;
      }
      return prev;
    });
  };

  const handleSelectHistoryItem = (item: AnalysisResult) => {
    setCurrentAnalysis(item);
    setInputFormData(item.inputs as BusinessInput);
    setActivePage('dashboard');
  };

  const handleLoginSuccess = (preset?: BusinessInput) => {
    setIsAuthenticated(true);
    if (preset) {
      handleSelectPreset(preset);
    }
    setActivePage('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActivePage('landing');
  };

  // Navbar CSV Import: ingest transactions into the active company's treasury
  const handleNavbarCsvImport = (_entries: LedgerDailyEntry[], summary: { totalInflow: number; totalOutflow: number; count: number }) => {
    if (!currentAnalysis) return;
    const net = Math.round(summary.totalInflow - summary.totalOutflow);
    const updatedData: BusinessInput = {
      ...(currentAnalysis.inputs as BusinessInput),
      cash_in_bank: currentAnalysis.inputs.cash_in_bank + net
    };
    setInputFormData(updatedData);
    predictBusinessRisk(updatedData).then(res => {
      setCurrentAnalysis(res);
      setHistory(prev => [res, ...prev.filter(h => h.id !== res.id)]);
    });
  };

  return (
    <div className="app-container">
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        isAuthenticated={isAuthenticated}
        businessMode={businessMode}
        onToggleBusinessMode={setBusinessMode}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
        onOpenCsvImport={() => setIsCsvImportOpen(true)}
      />

      <main className="main-content">
        {activePage === 'landing' && (
          <LandingPage
            setActivePage={setActivePage}
            onSelectPreset={handleSelectPreset}
          />
        )}

        {activePage === 'login' && (
          <Login
            setActivePage={setActivePage}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {activePage === 'signup' && (
          <Signup
            setActivePage={setActivePage}
            onSignupSuccess={() => handleLoginSuccess()}
          />
        )}

        {activePage === 'dashboard' && (
          <Dashboard
            currentAnalysis={currentAnalysis}
            history={history}
            companies={companies}
            setActivePage={setActivePage}
            onSelectPreset={handleSelectPreset}
            onSelectHistoryItem={handleSelectHistoryItem}
            onOpenCreateCompany={() => setIsCreateModalOpen(true)}
            onDeleteCompany={handleDeleteCompany}
          />
        )}

        {activePage === 'ledger' && (
          <CashFlowLedger
            currentAnalysis={currentAnalysis}
            businessMode={businessMode}
            onUpdateCompanyMetrics={handleUpdateCompanyMetrics}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'input' && (
          <BusinessInputPage
            initialData={inputFormData}
            companies={companies}
            setActivePage={setActivePage}
            onSubmitAnalysis={handleSubmitAnalysis}
            onOpenCreateCompany={() => setIsCreateModalOpen(true)}
          />
        )}

        {activePage === 'prediction' && (
          <PredictionResult
            result={currentAnalysis}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'shap' && (
          <SHAPExplanation
            result={currentAnalysis}
            companies={companies}
            setActivePage={setActivePage}
            onSelectCompany={handleSelectPreset}
            onOpenCreateCompany={() => setIsCreateModalOpen(true)}
          />
        )}

        {activePage === 'recommendations' && (
          <Recommendations
            result={currentAnalysis}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'reports' && (
          <Reports
            result={currentAnalysis}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'diagnostics' && (
          <ModelDiagnostics
            setActivePage={setActivePage}
          />
        )}
      </main>

      <CreateCompanyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAddCompany={handleAddCompany}
      />

      <CsvImportModal
        isOpen={isCsvImportOpen}
        onClose={() => setIsCsvImportOpen(false)}
        onImportSuccess={handleNavbarCsvImport}
      />

      <AiCfoDrawer currentAnalysis={currentAnalysis} />

      <Footer />
    </div>
  );
}

export default App;
