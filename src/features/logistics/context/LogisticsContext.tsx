import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import {
  Delivery,
  MIR,
  IR,
  CorrectiveAction,
  LogisticsMetrics,
} from '../types/logistics.types';
import {
  fetchDeliveries as fetchDeliveriesService,
  createDelivery as createDeliveryService,
  updateDelivery as updateDeliveryService,
  deleteDelivery as deleteDeliveryService,
} from '../services/logisticsService';
import {
  fetchMIRs as fetchMIRsService,
  createMIR as createMIRService,
  updateMIR as updateMIRService,
  deleteMIR as deleteMIRService,
} from '../services/mirService';
import {
  fetchIRs as fetchIRsService,
  createIR as createIRService,
  updateIR as updateIRService,
  deleteIR as deleteIRService,
  addCorrectiveAction as addCorrectiveActionService,
} from '../services/irService';

interface LogisticsContextType {
  // State
  deliveries: Delivery[];
  mirs: MIR[];
  irs: IR[];
  loading: boolean;
  error: Error | null;
  metrics: LogisticsMetrics | null;
  
  // Delivery Actions
  fetchDeliveries: () => Promise<void>;
  createDelivery: (delivery: Omit<Delivery, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateDelivery: (id: string, updates: Partial<Delivery>) => Promise<void>;
  deleteDelivery: (id: string) => Promise<void>;
  
  // MIR Actions
  fetchMIRs: () => Promise<void>;
  createMIR: (mir: Omit<MIR, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateMIR: (id: string, updates: Partial<MIR>) => Promise<void>;
  deleteMIR: (id: string) => Promise<void>;
  
  // IR Actions
  fetchIRs: () => Promise<void>;
  createIR: (ir: Omit<IR, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateIR: (id: string, updates: Partial<IR>) => Promise<void>;
  deleteIR: (id: string) => Promise<void>;
  addCorrectiveAction: (irId: string, action: Omit<CorrectiveAction, 'id'>) => Promise<void>;
  
  // Metrics
  calculateMetrics: () => void;
}

const LogisticsContext = createContext<LogisticsContextType | undefined>(undefined);

export const useLogistics = () => {
  const context = useContext(LogisticsContext);
  if (!context) {
    throw new Error('useLogistics must be used within a LogisticsProvider');
  }
  return context;
};

interface LogisticsProviderProps {
  children: ReactNode;
}

export const LogisticsProvider: React.FC<LogisticsProviderProps> = ({ children }) => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [mirs, setMIRs] = useState<MIR[]>([]);
  const [irs, setIRs] = useState<IR[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [metrics, setMetrics] = useState<LogisticsMetrics | null>(null);

  // Fetch Deliveries
  const fetchDeliveries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDeliveriesService();
      setDeliveries(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create Delivery
  const createDelivery = useCallback(async (delivery: Omit<Delivery, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const newDelivery = await createDeliveryService(delivery);
      setDeliveries(prev => [...prev, newDelivery]);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update Delivery
  const updateDelivery = useCallback(async (id: string, updates: Partial<Delivery>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedDelivery = await updateDeliveryService(id, updates);
      setDeliveries(prev => prev.map(d => d.id === id ? updatedDelivery : d));
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete Delivery
  const deleteDelivery = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteDeliveryService(id);
      setDeliveries(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch MIRs
  const fetchMIRs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMIRsService();
      setMIRs(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create MIR
  const createMIR = useCallback(async (mir: Omit<MIR, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const newMIR = await createMIRService(mir);
      setMIRs(prev => [...prev, newMIR]);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update MIR
  const updateMIR = useCallback(async (id: string, updates: Partial<MIR>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedMIR = await updateMIRService(id, updates);
      setMIRs(prev => prev.map(m => m.id === id ? updatedMIR : m));
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete MIR
  const deleteMIR = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteMIRService(id);
      setMIRs(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch IRs
  const fetchIRs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchIRsService();
      setIRs(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create IR
  const createIR = useCallback(async (ir: Omit<IR, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const newIR = await createIRService(ir);
      setIRs(prev => [...prev, newIR]);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update IR
  const updateIR = useCallback(async (id: string, updates: Partial<IR>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedIR = await updateIRService(id, updates);
      setIRs(prev => prev.map(i => i.id === id ? updatedIR : i));
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete IR
  const deleteIR = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteIRService(id);
      setIRs(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Add Corrective Action
  const addCorrectiveAction = useCallback(async (irId: string, action: Omit<CorrectiveAction, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedIR = await addCorrectiveActionService(irId, action);
      setIRs(prev => prev.map(i => i.id === irId ? updatedIR : i));
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Calculate Metrics
  const calculateMetrics = useCallback(() => {
    const totalDeliveries = deliveries.length;
    const scheduledDeliveries = deliveries.filter(d => d.status === 'scheduled').length;
    const completedDeliveries = deliveries.filter(d => d.status === 'delivered').length;
    
    const totalMIRs = mirs.length;
    const passedMIRs = mirs.filter(m => m.overallStatus === 'passed').length;
    const failedMIRs = mirs.filter(m => m.overallStatus === 'failed').length;
    
    const totalIRs = irs.length;
    const openIRs = irs.filter(i => i.status === 'open').length;
    const closedIRs = irs.filter(i => i.status === 'closed').length;
    
    // Calculate rates
    const deliveryOnTimeRate = totalDeliveries > 0
      ? (deliveries.filter(d => d.actualDate && d.actualDate <= d.scheduledDate).length / totalDeliveries) * 100
      : 0;
    
    const nonConformanceRate = totalMIRs > 0
      ? (mirs.reduce((acc, mir) => acc + mir.nonConformances.length, 0) / totalMIRs)
      : 0;
    
    const totalCorrectiveActions = irs.reduce((acc, ir) => acc + ir.correctiveActions.length, 0);
    const completedCorrectiveActions = irs.reduce((acc, ir) => 
      acc + ir.correctiveActions.filter(ca => ca.status === 'completed').length, 0);
    const correctiveActionCompletionRate = totalCorrectiveActions > 0
      ? (completedCorrectiveActions / totalCorrectiveActions) * 100
      : 0;
    
    const inspectionComplianceRate = totalMIRs > 0
      ? (passedMIRs / totalMIRs) * 100
      : 0;
    
    setMetrics({
      totalDeliveries,
      scheduledDeliveries,
      completedDeliveries,
      totalMIRs,
      passedMIRs,
      failedMIRs,
      totalIRs,
      openIRs,
      closedIRs,
      deliveryOnTimeRate,
      averageInspectionTime: 45, // Mock value for now
      nonConformanceRate,
      correctiveActionCompletionRate,
      inspectionComplianceRate,
    });
  }, [deliveries, mirs, irs]);

  // Load initial data
  useEffect(() => {
    Promise.all([
      fetchDeliveries(),
      fetchMIRs(),
      fetchIRs(),
    ]).catch(console.error);
  }, [fetchDeliveries, fetchMIRs, fetchIRs]);

  // Calculate metrics whenever data changes
  useEffect(() => {
    calculateMetrics();
  }, [calculateMetrics]);

  const value: LogisticsContextType = {
    deliveries,
    mirs,
    irs,
    loading,
    error,
    metrics,
    fetchDeliveries,
    createDelivery,
    updateDelivery,
    deleteDelivery,
    fetchMIRs,
    createMIR,
    updateMIR,
    deleteMIR,
    fetchIRs,
    createIR,
    updateIR,
    deleteIR,
    addCorrectiveAction,
    calculateMetrics,
  };

  return (
    <LogisticsContext.Provider value={value}>
      {children}
    </LogisticsContext.Provider>
  );
};