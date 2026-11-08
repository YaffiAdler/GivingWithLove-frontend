import { components } from './api.generated';
import { PageRequest } from './paged-result.model';

export type Eichud = components['schemas']['EichudDto'];
export type CreateEichud = components['schemas']['CreateEichudDto'];
export type UpdateEichud = components['schemas']['UpdateEichudDto'];
export type EichudPage = components['schemas']['EichudDtoPagedResult'];

export type EichudSort = 'name' | 'code';

export interface EichudQuery extends PageRequest {
  search?: string;
  sort?: EichudSort;
}
