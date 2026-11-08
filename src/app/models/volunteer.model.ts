import { components } from './api.generated';
import { PageRequest } from './paged-result.model';

export type Volunteer = components['schemas']['VolunteerDto'];
export type VolunteerDetails = components['schemas']['VolunteerDetailsDto'];
export type CreateVolunteer = components['schemas']['CreateVolunteerDto'];
export type UpdateVolunteer = components['schemas']['UpdateVolunteerDto'];
export type UpdateVolunteerDomains = components['schemas']['UpdateVolunteerDomainsDto'];
export type VolunteerPage = components['schemas']['VolunteerDtoPagedResult'];

export type VolunteerSort = 'name' | 'code';

export interface VolunteerQuery extends PageRequest {
  search?: string;
  sort?: VolunteerSort;
}
