import { SubProjectModule } from '../sub-project/sub-project-module';
import { VolunteerDomainModule } from '../volunteer-domain/volunteer-domain-module';
import { VolunteerModel } from '../volunteer/volunteer-module';
import { VolunteeringModule } from '../volunteering/volunteering/volunteering-module';



export class ProjectModule {
  projectCode?: number
  projectName!: string
  projectManagerCode?: number
  domainCode?: number
  inverseDomainCodeNavigation?: ProjectModule[]
  subProjects?: SubProjectModule[]
  volunteerDomains?: VolunteerDomainModule[]
  ////////////////////////
  volunteersPerProject?:VolunteerModel[]
  estimatedCost?:number=0
  estimatedTime?:number=0
  volunteeringArrToProject?:VolunteeringModule[]
  
}
