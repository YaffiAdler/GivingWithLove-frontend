import { environment } from '../../environments/environment';

/**
 * Builds a backend API URL, e.g. `apiUrl('Volunteer')` → `<apiUrl>/api/Volunteer`
 * and `apiUrl('Volunteer', 5)` → `<apiUrl>/api/Volunteer/5`.
 * Centralized so every service uses the same `api/<Resource>/{id}` route shape
 * and no caller has to remember the separating slash.
 */
export function apiUrl(resource: string, id?: number | string): string {
  const resourceUrl = `${environment.apiUrl}/api/${resource}`;
  return id === undefined ? resourceUrl : `${resourceUrl}/${id}`;
}
