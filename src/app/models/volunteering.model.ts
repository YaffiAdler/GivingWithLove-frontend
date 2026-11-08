import { components } from './api.generated';
import { PageRequest } from './paged-result.model';

export type Volunteering = components['schemas']['VolunteeringDto'];
export type CreateVolunteering = components['schemas']['CreateVolunteeringDto'];
export type UpdateVolunteering = components['schemas']['UpdateVolunteeringDto'];
export type VolunteeringPage = components['schemas']['VolunteeringDtoPagedResult'];

export type VolunteeringSort = 'date' | 'volunteer' | 'project';

export interface VolunteeringQuery extends PageRequest {
  sort?: VolunteeringSort;
  volunteerCode?: number;
  projectCode?: number;
  /** Date filter start, yyyy-MM-dd. */
  from?: string;
  /** Date filter end, yyyy-MM-dd. */
  to?: string;
}
