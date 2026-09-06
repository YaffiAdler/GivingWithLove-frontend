import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { ProjectService } from '../../Services/project-service';
import { ProjectModule } from '../../Models/project/project-module';
import { VolunteeringService } from '../../Services/volunteering-service';
import { VolunteeringModule } from '../../Models/volunteering/volunteering/volunteering-module';
import { SubProjectModule } from '../../Models/sub-project/sub-project-module';
import { lastValueFrom } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SubProjectService } from '../../Services/sub-project-service';
import { V } from '@angular/cdk/keycodes';
import { VolunteerModel } from '../../Models/volunteer/volunteer-module';
import { VolunteerService } from '../../Services/volunteer-service';
import { VolunteerDomainService } from '../../Services/volunteer-domain-service';
import { VolunteerDomainModule } from '../../Models/volunteering/volunteer-domain/volunteer-domain-module';

@Component({
  selector: 'app-deep-data-display',
  imports: [RouterOutlet, RouterModule, RouterLink],
  templateUrl: './deep-data-display.html',
  styleUrl: './deep-data-display.scss'
})
export class DeepDataDisplay {

  projectService = inject(ProjectService);

  project!: ProjectModule ;
  code1!: string;
  estimatedTime: number = 0;
  estimatedCost: number = 0;
  volunteeringSrv = inject(VolunteeringService)
  volunteeringArr: VolunteeringModule[] = []
  volunteeringArrToProject: VolunteeringModule[] = []
  subProjects: SubProjectModule[] = []
  subProjectService = inject(SubProjectService)
  num: number = 0
  volounteerArrPerProject: VolunteerModel[] = []
  volunteerSrv = inject(VolunteerService)
  // volunteerDomainS = inject(VolunteerDomainService)
  // vd: VolunteerDomainModule[] = []
  constructor(private route: ActivatedRoute) { }
  async ngOnInit() {
    try {
      this.subProjects = await lastValueFrom(this.subProjectService.getAllProjects());
      this.volunteeringArr = await lastValueFrom(this.volunteeringSrv.getAllVolunteerings());
    } catch (err) {
      console.error('Failed to load data', err);
    }
    // this.projectService.refreshData();
    // this.vd = await lastValueFrom(this.volunteerDomainS.getAllVolunteerDomain());
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe(params => {

      const code = params.get('code');

      if (code != null) {

        this.code1 = code;

        console.log(this.code1);

        this.getProjectById();
        // this.calcNumOfVolunteers()
      }
    });

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
        const num = this.project?.volunteerDomains?.length
        if (num != undefined)
          this.num = num;

        console.log('PROJECT:', res);

        // 🔥 חשוב: מחשבים רק אחרי שיש נתונים
        this.calcCost();
      },
      error: err => {
        console.error('שגיאה בשרת:', err);
      }
    });
  }

  calcCost = () => {
    this.estimatedCost = 0;
    this.estimatedTime = 0;
    for (let index = 0; index < this.volunteeringArr.length; index++) {
      if (this.volunteeringArr[index].projectCode == this.project?.projectCode)
        this.volunteeringArrToProject.push(this.volunteeringArr[index])
    }

    for (let index = 0; index < this.volunteeringArrToProject.length; index++) {

      if (this.project?.subProjects) {

        for (let index2 = 0; index2 < this.project.subProjects.length; index2++) {

          const volunteering = this.volunteeringArrToProject[index];
          const subProject = this.project.subProjects[index2];

          if (
            volunteering &&
            subProject &&
            volunteering.subProjectCode === subProject.subProjectCode
          ) {
            this.estimatedCost += subProject.estimatedCost ?? 0;
            this.estimatedTime += subProject.estimatedTime ?? 0;
          }
        }
      }
    }
    this.estimatedTime/=60;
  }


}