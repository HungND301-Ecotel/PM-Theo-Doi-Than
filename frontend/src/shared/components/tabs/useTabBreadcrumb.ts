import { useMemo } from 'react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
  onClick?: () => void;
}

/**
 * Hook to sync breadcrumb with router
 * @example
 * const breadcrumbs = useTabBreadcrumb(location.pathname);
 * return <TabBreadcrumb items={breadcrumbs} />;
 */
export const useTabBreadcrumb = (pathname: string): BreadcrumbItem[] => {
  return useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const path = '/' + segments.slice(0, index + 1).join('/');
      return {
        label: segment.charAt(0).toUpperCase() + segment.slice(1),
        path,
      };
    });
  }, [pathname]);
};
