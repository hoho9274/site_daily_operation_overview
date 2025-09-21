import React, { createContext, useContext, useReducer, useCallback } from 'react';
import {
  Document,
  RFI,
  DesignIssue,
  DashboardStats,
  DocumentFilters,
  RFIFilters,
  IssueFilters,
  RFIStatus,
  IssueStatus,
  Priority,
  Severity,
} from '../types';
import { mockData } from '../services/mockData';

interface DesignCoordinationState {
  documents: {
    items: Document[];
    loading: boolean;
    error: string | null;
    filters: DocumentFilters;
  };
  rfis: {
    items: RFI[];
    loading: boolean;
    error: string | null;
    filters: RFIFilters;
  };
  issues: {
    items: DesignIssue[];
    loading: boolean;
    error: string | null;
    filters: IssueFilters;
  };
  dashboard: {
    stats: DashboardStats | null;
    loading: boolean;
    error: string | null;
  };
}

type DesignCoordinationAction =
  | { type: 'SET_DOCUMENTS'; payload: Document[] }
  | { type: 'ADD_DOCUMENT'; payload: Document }
  | { type: 'SET_DOCUMENT_FILTERS'; payload: DocumentFilters }
  | { type: 'SET_RFIS'; payload: RFI[] }
  | { type: 'ADD_RFI'; payload: RFI }
  | { type: 'UPDATE_RFI'; payload: RFI }
  | { type: 'SET_RFI_FILTERS'; payload: RFIFilters }
  | { type: 'SET_ISSUES'; payload: DesignIssue[] }
  | { type: 'ADD_ISSUE'; payload: DesignIssue }
  | { type: 'UPDATE_ISSUE'; payload: DesignIssue }
  | { type: 'SET_ISSUE_FILTERS'; payload: IssueFilters }
  | { type: 'SET_DASHBOARD_STATS'; payload: DashboardStats }
  | { type: 'SET_LOADING'; payload: { entity: string; loading: boolean } }
  | { type: 'SET_ERROR'; payload: { entity: string; error: string | null } };

const initialState: DesignCoordinationState = {
  documents: {
    items: [],
    loading: false,
    error: null,
    filters: {},
  },
  rfis: {
    items: [],
    loading: false,
    error: null,
    filters: {},
  },
  issues: {
    items: [],
    loading: false,
    error: null,
    filters: {},
  },
  dashboard: {
    stats: null,
    loading: false,
    error: null,
  },
};

const designCoordinationReducer = (
  state: DesignCoordinationState,
  action: DesignCoordinationAction
): DesignCoordinationState => {
  switch (action.type) {
    case 'SET_DOCUMENTS':
      return {
        ...state,
        documents: { ...state.documents, items: action.payload },
      };
    case 'ADD_DOCUMENT':
      return {
        ...state,
        documents: {
          ...state.documents,
          items: [...state.documents.items, action.payload],
        },
      };
    case 'SET_DOCUMENT_FILTERS':
      return {
        ...state,
        documents: { ...state.documents, filters: action.payload },
      };
    case 'SET_RFIS':
      return {
        ...state,
        rfis: { ...state.rfis, items: action.payload },
      };
    case 'ADD_RFI':
      return {
        ...state,
        rfis: {
          ...state.rfis,
          items: [...state.rfis.items, action.payload],
        },
      };
    case 'UPDATE_RFI':
      return {
        ...state,
        rfis: {
          ...state.rfis,
          items: state.rfis.items.map((rfi) =>
            rfi.id === action.payload.id ? action.payload : rfi
          ),
        },
      };
    case 'SET_RFI_FILTERS':
      return {
        ...state,
        rfis: { ...state.rfis, filters: action.payload },
      };
    case 'SET_ISSUES':
      return {
        ...state,
        issues: { ...state.issues, items: action.payload },
      };
    case 'ADD_ISSUE':
      return {
        ...state,
        issues: {
          ...state.issues,
          items: [...state.issues.items, action.payload],
        },
      };
    case 'UPDATE_ISSUE':
      return {
        ...state,
        issues: {
          ...state.issues,
          items: state.issues.items.map((issue) =>
            issue.id === action.payload.id ? action.payload : issue
          ),
        },
      };
    case 'SET_ISSUE_FILTERS':
      return {
        ...state,
        issues: { ...state.issues, filters: action.payload },
      };
    case 'SET_DASHBOARD_STATS':
      return {
        ...state,
        dashboard: { ...state.dashboard, stats: action.payload },
      };
    case 'SET_LOADING':
      return {
        ...state,
        [action.payload.entity]: {
          ...state[action.payload.entity as keyof DesignCoordinationState],
          loading: action.payload.loading,
        },
      };
    case 'SET_ERROR':
      return {
        ...state,
        [action.payload.entity]: {
          ...state[action.payload.entity as keyof DesignCoordinationState],
          error: action.payload.error,
        },
      };
    default:
      return state;
  }
};

interface DesignCoordinationContextType {
  state: DesignCoordinationState;
  actions: {
    loadDocuments: () => void;
    loadRFIs: () => void;
    loadIssues: () => void;
    loadDashboardStats: () => void;
    createRFI: (rfi: Partial<RFI>) => void;
    updateRFI: (id: string, updates: Partial<RFI>) => void;
    createIssue: (issue: Partial<DesignIssue>) => void;
    updateIssue: (id: string, updates: Partial<DesignIssue>) => void;
    uploadDocument: (document: Partial<Document>) => void;
    setDocumentFilters: (filters: DocumentFilters) => void;
    setRFIFilters: (filters: RFIFilters) => void;
    setIssueFilters: (filters: IssueFilters) => void;
  };
}

const DesignCoordinationContext = createContext<DesignCoordinationContextType | null>(
  null
);

export const useDesignCoordination = () => {
  const context = useContext(DesignCoordinationContext);
  if (!context) {
    throw new Error(
      'useDesignCoordination must be used within DesignCoordinationProvider'
    );
  }
  return context;
};

interface DesignCoordinationProviderProps {
  children: React.ReactNode;
}

export const DesignCoordinationProvider: React.FC<DesignCoordinationProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(designCoordinationReducer, initialState);

  const loadDocuments = useCallback(() => {
    dispatch({ type: 'SET_LOADING', payload: { entity: 'documents', loading: true } });
    setTimeout(() => {
      dispatch({ type: 'SET_DOCUMENTS', payload: mockData.documents });
      dispatch({ type: 'SET_LOADING', payload: { entity: 'documents', loading: false } });
    }, 500);
  }, []);

  const loadRFIs = useCallback(() => {
    dispatch({ type: 'SET_LOADING', payload: { entity: 'rfis', loading: true } });
    setTimeout(() => {
      dispatch({ type: 'SET_RFIS', payload: mockData.rfis });
      dispatch({ type: 'SET_LOADING', payload: { entity: 'rfis', loading: false } });
    }, 500);
  }, []);

  const loadIssues = useCallback(() => {
    dispatch({ type: 'SET_LOADING', payload: { entity: 'issues', loading: true } });
    setTimeout(() => {
      dispatch({ type: 'SET_ISSUES', payload: mockData.issues });
      dispatch({ type: 'SET_LOADING', payload: { entity: 'issues', loading: false } });
    }, 500);
  }, []);

  const loadDashboardStats = useCallback(() => {
    dispatch({ type: 'SET_LOADING', payload: { entity: 'dashboard', loading: true } });
    setTimeout(() => {
      const stats: DashboardStats = {
        totalDocuments: mockData.documents.length,
        totalRFIs: mockData.rfis.length,
        openRFIs: mockData.rfis.filter(rfi => rfi.status === RFIStatus.OPEN || rfi.status === RFIStatus.IN_REVIEW).length,
        totalIssues: mockData.issues.length,
        openIssues: mockData.issues.filter(issue => issue.status === IssueStatus.OPEN || issue.status === IssueStatus.IN_PROGRESS).length,
        criticalItems: mockData.rfis.filter(rfi => rfi.priority === Priority.CRITICAL).length + 
                      mockData.issues.filter(issue => issue.severity === Severity.CRITICAL).length,
        avgResponseTime: 3.5,
        recentActivities: mockData.activities,
      };
      dispatch({ type: 'SET_DASHBOARD_STATS', payload: stats });
      dispatch({ type: 'SET_LOADING', payload: { entity: 'dashboard', loading: false } });
    }, 500);
  }, []);

  const createRFI = useCallback((rfi: Partial<RFI>) => {
    const newRFI: RFI = {
      id: `rfi-${Date.now()}`,
      projectId: 'project-1',
      rfiNumber: `RFI-2025-${String(state.rfis.items.length + 1).padStart(3, '0')}`,
      title: rfi.title || '',
      description: rfi.description,
      status: RFIStatus.OPEN,
      priority: rfi.priority || Priority.MEDIUM,
      createdBy: 'current-user',
      createdByName: 'John Doe',
      assignedTo: rfi.assignedTo,
      dueDate: rfi.dueDate,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_RFI', payload: newRFI });
  }, [state.rfis.items.length]);

  const updateRFI = useCallback((id: string, updates: Partial<RFI>) => {
    const rfi = state.rfis.items.find(r => r.id === id);
    if (rfi) {
      const updatedRFI = {
        ...rfi,
        ...updates,
        updatedAt: new Date(),
      };
      dispatch({ type: 'UPDATE_RFI', payload: updatedRFI });
    }
  }, [state.rfis.items]);

  const createIssue = useCallback((issue: Partial<DesignIssue>) => {
    const newIssue: DesignIssue = {
      id: `issue-${Date.now()}`,
      projectId: 'project-1',
      issueNumber: `ISS-2025-${String(state.issues.items.length + 1).padStart(3, '0')}`,
      title: issue.title || '',
      description: issue.description,
      type: issue.type,
      severity: issue.severity || Severity.MEDIUM,
      status: IssueStatus.OPEN,
      costImpact: issue.costImpact,
      scheduleImpact: issue.scheduleImpact,
      assignedTo: issue.assignedTo,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_ISSUE', payload: newIssue });
  }, [state.issues.items.length]);

  const updateIssue = useCallback((id: string, updates: Partial<DesignIssue>) => {
    const issue = state.issues.items.find(i => i.id === id);
    if (issue) {
      const updatedIssue = {
        ...issue,
        ...updates,
        updatedAt: new Date(),
      };
      dispatch({ type: 'UPDATE_ISSUE', payload: updatedIssue });
    }
  }, [state.issues.items]);

  const uploadDocument = useCallback((document: Partial<Document>) => {
    const newDocument: Document = {
      id: `doc-${Date.now()}`,
      projectId: 'project-1',
      name: document.name || '',
      type: document.type || DocumentType.PDF,
      discipline: document.discipline,
      fileUrl: document.fileUrl || '',
      fileSize: document.fileSize || 0,
      version: 1,
      uploadedBy: 'current-user',
      uploadedByName: 'John Doe',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_DOCUMENT', payload: newDocument });
  }, []);

  const setDocumentFilters = useCallback((filters: DocumentFilters) => {
    dispatch({ type: 'SET_DOCUMENT_FILTERS', payload: filters });
  }, []);

  const setRFIFilters = useCallback((filters: RFIFilters) => {
    dispatch({ type: 'SET_RFI_FILTERS', payload: filters });
  }, []);

  const setIssueFilters = useCallback((filters: IssueFilters) => {
    dispatch({ type: 'SET_ISSUE_FILTERS', payload: filters });
  }, []);

  const value: DesignCoordinationContextType = {
    state,
    actions: {
      loadDocuments,
      loadRFIs,
      loadIssues,
      loadDashboardStats,
      createRFI,
      updateRFI,
      createIssue,
      updateIssue,
      uploadDocument,
      setDocumentFilters,
      setRFIFilters,
      setIssueFilters,
    },
  };

  return (
    <DesignCoordinationContext.Provider value={value}>
      {children}
    </DesignCoordinationContext.Provider>
  );
};