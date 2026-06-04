"use client";

import { useEffect } from 'react';

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // On mobile: hide ticker/nav/footer so search feels like a full-screen overlay
    document.body.classList.add('search-page-active');
    return () => document.body.classList.remove('search-page-active');
  }, []);

  return <>{children}</>;
}
