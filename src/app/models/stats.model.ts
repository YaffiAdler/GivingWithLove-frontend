import { components } from './api.generated';
import { PageRequest } from './paged-result.model';

export type OverviewStats = components['schemas']['OverviewStatsDto'];
export type VolunteerStats = components['schemas']['VolunteerStatsDto'];
export type VolunteerRankingRow = components['schemas']['VolunteerRankingRowDto'];
export type VolunteerRankingPage = components['schemas']['VolunteerRankingRowDtoPagedResult'];
export type ProjectStats = components['schemas']['ProjectStatsDto'];
export type MonthlyCount = components['schemas']['MonthlyCountDto'];
export type NamedCount = components['schemas']['NamedCountDto'];
export type WeekdayCount = components['schemas']['WeekdayCountDto'];

/**
 * Date range of every statistics endpoint, as yyyy-MM-dd. Both ends are optional and inclusive;
 * a missing end leaves that side of the range open.
 */
export interface StatsFilter {
  from?: string;
  to?: string;
}

export type VolunteerRankingSort = 'count' | 'hours' | 'lastDate';

export interface VolunteerRankingQuery extends StatsFilter, PageRequest {
  sort?: VolunteerRankingSort;
}
