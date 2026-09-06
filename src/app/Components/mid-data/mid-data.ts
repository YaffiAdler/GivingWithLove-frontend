import { Component, Inject, inject } from '@angular/core';
import { ProjectModule } from '../../Models/project/project-module';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjectService } from '../../Services/project-service';
import { VolunteeringModule } from '../../Models/volunteering/volunteering/volunteering-module';
import { VolunteerService } from '../../Services/volunteer-service';
import { VolunteeringService } from '../../Services/volunteering-service';
// import { SubProject } from '../SUBPROJECTS/sub-project/sub-project';
import { SubProjectModule } from '../../Models/sub-project/sub-project-module';
import { lastValueFrom } from 'rxjs';
import { SubProjectService } from '../../Services/sub-project-service';
import { VolunteerDomainService } from '../../Services/volunteer-domain-service';
import { VolunteerDomainModule } from '../../Models/volunteer-domain/volunteer-domain-module';

@Component({
  selector: 'app-mid-data',
  imports: [RouterLink],
  templateUrl: './mid-data.html',
  styleUrl: './mid-data.scss'
})
export class MidData {
  code1: string | null = null;
  project!: ProjectModule;
  projectService = inject(ProjectService);
  projectsArr: ProjectModule[] = []
  estimatedTime: number = 0;
  estimatedCost: number = 0;
  volunteeringSrv = inject(VolunteeringService)
  volunteeringArr: VolunteeringModule[] = []
  volunteeringArrToProject: VolunteeringModule[] = []
  subProjectService = inject(SubProjectService)
  subProjects: SubProjectModule[] = []
  vm: any = undefined
  volunteerSrv = inject(VolunteerService)
  //
  volunteerDomainS = inject(VolunteerDomainService)
  volunteerDomainArrPerBigProject: VolunteerDomainModule[]=[]

  constructor(private route: ActivatedRoute) { }

  async ngOnInit() {
    try {
      this.subProjects = await lastValueFrom(this.subProjectService.getAllProjects());
      this.volunteeringArr = await lastValueFrom(this.volunteeringSrv.getAllVolunteerings());
    } catch (err) {
      console.error('Failed to load data', err);
    }

    const code = this.route.snapshot.paramMap.get('code');

    if (code != null) {
      this.code1 = code;
    }

    await this.getProjectById();
  }


  getProjectById() {
    const projectId = Number(this.code1);

    if (isNaN(projectId)) {
      console.error("קוד פרויקט לא חוקי:", this.code1);
      return;
    }

    this.projectService.getProjectById(projectId).subscribe({
      next: res => {
        this.project = res;

        console.log('PROJECT:', res);

        // 🔥 חשוב: מחשבים רק אחרי שיש נתונים
        this.calc();
      },
      error: err => {
        console.error('שגיאה בשרת:', err);
      }
    });
  }

  calc = () => {
    this.volunteerDomainArrPerBigProject = [];
    this.estimatedCost = 0;
    this.estimatedTime = 0;
    for (let index = 0; index < this.volunteeringArr.length; index++) {
      if (this.project && this.project.inverseDomainCodeNavigation) {
        for (let index1 = 0; index1 < this.project.inverseDomainCodeNavigation?.length; index1++)
          if (this.volunteeringArr[index].projectCode == this.project.inverseDomainCodeNavigation[index1].projectCode)
            this.volunteeringArrToProject.push(this.volunteeringArr[index])
      }
    }
    console.log(this.volunteeringArrToProject);
    for (let index = 0; index < this.volunteeringArrToProject.length; index++) {
      const Sproject = this.subProjects.find(
        x => x.subProjectCode === this.volunteeringArrToProject[index].subProjectCode
      );
      if (Sproject) {
        if (Sproject?.estimatedCost)
          this.estimatedCost += Sproject?.estimatedCost
        if (Sproject?.estimatedTime)
          this.estimatedTime += (Sproject?.estimatedTime)/60
      }
    }
    if (this.project && this.project.inverseDomainCodeNavigation) {
      for (var i = 0; i < this.project.inverseDomainCodeNavigation?.length; i++) {
        this.volunteerDomainArrPerBigProject.push(...(this.project.inverseDomainCodeNavigation[i].volunteerDomains ?? []))
      }
    }
  }



}
