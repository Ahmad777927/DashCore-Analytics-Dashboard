import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const SearchContext = createContext(null);

/**
 * Holds the open/closed state of the global search palette so that any
 * component (navbar triggers, keyboard shortcuts) can control it without
 * mounting more than one overlay.
 */
export const SearchProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  const value = useMemo(() => ({ isOpen, open, close, toggle }), [isOpen, open, close, toggle]);

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};

export const useSearch = () => {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearch must be used within a SearchProvider');
  return ctx;
};