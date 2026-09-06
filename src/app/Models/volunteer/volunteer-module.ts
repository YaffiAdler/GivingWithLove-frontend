import { EichudModel } from '../EichudModel';
// import { VolunteerDomain } from '../../Components/volunteer-domain/volunteer-domain';
import { VolunteerDomainModule } from '../volunteer-domain/volunteer-domain-module';

export class VolunteerModel {
  volunteerCode!: number
  positionCode!: number
  positionName?: string
  volunteerCodeNavigation?: EichudModel
  volunteerDomains?: VolunteerDomainModule[];


}
