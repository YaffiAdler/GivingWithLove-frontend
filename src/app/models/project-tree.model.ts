import { components } from './api.generated';

/** A department (אגף) with its projects, as returned by GET /api/Project/tree. */
export type DepartmentNode = components['schemas']['DepartmentNodeDto'];
export type ProjectNode = components['schemas']['ProjectNodeDto'];
