// import { VolunteeringService } from '../../Services/volunteering-service';
// import { EichudModel } from '../../Models/EichudModel';

// import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
// import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { VolunteerModel } from '../../Models/volunteer/volunteer-module';
// import { VolunteerService } from '../../Services/volunteer-service';
// import { EichudService } from '../../Services/eichud-service';
// import { DataView } from 'primeng/dataview';
// import { DatePicker, DatePickerModule } from 'primeng/datepicker';
// import { ProjectService } from '../../Services/project-service';
// import { ProjectModule } from '../../Models/project/project-module';
// import { SubProjectService } from '../../Services/sub-project-service';
// import { SubProjectModule } from '../../Models/sub-project/sub-project-module';
// import { lastValueFrom } from 'rxjs';
// import { AsyncAction } from 'rxjs/internal/scheduler/AsyncAction';
// import { Component, inject } from '@angular/core';
// import { VolunteeringModule } from '../../Models/volunteering/volunteering/volunteering-module';
// import { NO_ERRORS_SCHEMA, SECURITY_SCHEMA } from '@angular/compiler';

// @Component({
//   selector: 'app-volunteering',
//   imports: [AsyncPipe, ReactiveFormsModule, CommonModule],
//   templateUrl: './volunteering.html',
//   styleUrl: './volunteering.scss'
// })
// export class Volunteering {
//   projectService = inject(ProjectService)
//   projectsArr: ProjectModule[] = [];
//   subProjectService = inject(SubProjectService)
//   subProjects: SubProjectModule[] = [];
//   filteredSubProjects: SubProjectModule[] = []; // מאגר ה-subProjects המותאם לפי projectCode
//   // poorManService = inject(EichudService)
//   volunteeringArr: VolunteeringModule[] = [];
//   volunteerArr: VolunteerModel[] = []//מערך מתנדבים
//   volunteeringService = inject(VolunteeringService)
//   volunteerService = inject(VolunteerService)
//   ecdService = inject(EichudService)

//   vlntrFrm = new FormGroup({
//     dateOfVolunteering: new FormControl<string | null>(null, Validators.required),

//     volunteerCode: new FormControl<number | null>(this.volunteeringService.volunteerCodeInS ? this.volunteeringService.volunteerCodeInS : null, Validators.required),
//     poorManCode: new FormControl<number | null>(this.volunteeringService.poorManCodeInS ? this.volunteeringService.poorManCodeInS : null, Validators.required),
//     matcherCode: new FormControl<number | null>(this.volunteeringService.matcherCodeInS ? this.volunteeringService.matcherCodeInS : null, Validators.required),
//     projectCode: new FormControl<number | null>(this.volunteeringService.projectCodeInS ? this.volunteeringService.projectCodeInS : null),
//     subProjectCode: new FormControl<number | null>(this.volunteeringService.subProjectCodeInS ? this.volunteeringService.subProjectCodeInS : null)

//   });
//   async ngOnInit() {
//     const today = new Date();

//     const formatted =
//       today.getFullYear() +
//       '-' +
//       String(today.getMonth() + 1).padStart(2, '0') +
//       '-' +
//       String(today.getDate()).padStart(2, '0');

//     this.vlntrFrm.patchValue({
//       dateOfVolunteering: formatted,
//       volunteerCode: this.volunteeringService.volunteerCodeInS ,
//       poorManCode: this.volunteeringService.poorManCodeInS ,
//       matcherCode: this.volunteeringService.matcherCodeInS ,
//       projectCode: this.volunteeringService.projectCodeInS ,
//       subProjectCode: this.volunteeringService.subProjectCodeInS 
//     });

//     await lastValueFrom(this.volunteerService.getAllVolunteers()).then(res => { this.volunteerService.volunteers = res });
//     await lastValueFrom(this.projectService.getAllProjects()).then(res => { this.projectsArr = res; this.projectService.projects = res });
//     await this.volunteeringService.refreshData();
//     await lastValueFrom(this.subProjectService.getAllProjects()).then(res => { this.subProjects = res; this.subProjectService.Projects = res });
//     await lastValueFrom(this.ecdService.getAllEichud()).then(res => { this.ecdService.peopleInTheEichud = res });  
//     await lastValueFrom(this.volunteeringService.getAllVolunteerings()).then(res => { this.volunteeringService.volunteerings = res ; this.volunteeringArr = res });  
//     this.filteredSubProjects = await  this.subProjectService.Projects.filter(subPro => subPro.projectCode === Number(this.volunteeringService.projectCodeInS))

//   }



//   onProjectChange(event: Event) {
//     const selectedProjectCode = (event.target as HTMLSelectElement).value;
//     this.filteredSubProjects = this.subProjectService.Projects.filter(subPro => subPro.projectCode === Number(selectedProjectCode));
//   }
 
//   addVolunteering() {
//     if (this.vlntrFrm.valid) {
//       const volunteering = {
//         dateOfVolunteering: this.vlntrFrm.value.dateOfVolunteering!,
//         volunteerCode: this.vlntrFrm.value.volunteerCode!,
//         poorManCode: this.vlntrFrm.value.poorManCode!,
//         matcherCode: this.vlntrFrm.value.matcherCode!,
//         projectCode: this.vlntrFrm.value.projectCode!,
//         subProjectCode: this.vlntrFrm.value.subProjectCode!
//       }
//       this.volunteeringService.addVolunteering(volunteering);
//       alert(this.volunteeringArr.length)
//       this.vlntrFrm.reset(); // איפוס הטופס לאחר הוספה
//     }
//   }
//   deleteVolunteering(v: VolunteeringModule) {
//     this.volunteeringService.addVolunteering(v);

//   }
//   updateVolunteering(v: VolunteeringModule) {
//     this.volunteeringService.updateVolunteering(v);

//   }
//   getVolunteering() {
//     this.volunteeringService.getAllVolunteerings().subscribe(res => { this.volunteeringArr = res })

//   }

// }










// // import { VolunteeringService } from '../../Services/volunteering-service';
// // <<<<<<< HEAD
// // import { AsyncPipe, CommonModule } from '@angular/common';
// // import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// // import { VolunteerModel } from '../../Models/volunteer/volunteer-module';
// // import { VolunteerService } from '../../Services/volunteer-service';
// // import { ProjectService } from '../../Services/project-service';
// // import { ProjectModule } from '../../Models/project/project-module';
// // import { SubProjectModule } from '../../Models/sub-project/sub-project-module';
// // import { SubProjectService } from '../../Services/sub-project-service';
// // import { lastValueFrom } from 'rxjs';
// // import { EichudService } from '../../Services/eichud-service';
// // import { EichudModel } from '../../Models/EichudModel';
// // =======
// // import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
// // import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// // import { VolunteerModel } from '../../Models/volunteer/volunteer-module';

// // import { EichudService } from '../../Services/eichud-service';
// // import { DataView } from 'primeng/dataview';
// // import { DatePicker, DatePickerModule } from 'primeng/datepicker';
// // >>>>>>> 93a781744fd55843e6664a9d5e302f489ff1febe

// // @Component({
// //   selector: 'app-volunteering',
// //   imports: [ ReactiveFormsModule, CommonModule],
// //   templateUrl: './volunteering.html',
// //   styleUrl: './volunteering.scss'
// // })
// // export class Volunteering {
// //   volunteeringArr: VolunteeringModule[] = [];//מערך התנדבויות
// //   projectsArr: ProjectModule[] = [];
// //   subProjectService = inject(SubProjectService)
// //   subProjects: SubProjectModule[] = [];
// //   filteredSubProjects: SubProjectModule[] = []; // מאגר ה-subProjects המותאם לפי projectCode
// //   // poorManService = inject(EichudService)
// //   volunteeringArr: VolunteeringModule[] = [];
// //   volunteerArr: VolunteerModel[] = []//מערך מתנדבים
// //   volunteeringService = inject(VolunteeringService)
// //   volunteerService = inject(VolunteerService)
// //   ecdService = inject(EichudService)

// //   vlntrFrm = new FormGroup({
// //     dateOfVolunteering: new FormControl<string | null>(null, Validators.required),

// //     volunteerCode: new FormControl<number | null>(this.volunteeringService.volunteerCodeInS ? this.volunteeringService.volunteerCodeInS : null, Validators.required),
// //     poorManCode: new FormControl<number | null>(this.volunteeringService.poorManCodeInS ? this.volunteeringService.poorManCodeInS : null, Validators.required),
// //     matcherCode: new FormControl<number | null>(this.volunteeringService.matcherCodeInS ? this.volunteeringService.matcherCodeInS : null, Validators.required),
// //     projectCode: new FormControl<number | null>(this.volunteeringService.projectCodeInS ? this.volunteeringService.projectCodeInS : null),
// //     subProjectCode: new FormControl<number | null>(this.volunteeringService.subProjectCodeInS ? this.volunteeringService.subProjectCodeInS : null)

// //   });
// //   async ngOnInit() {
// //     const today = new Date();

// //     const formatted =
// //       today.getFullYear() +
// //       '-' +
// //       String(today.getMonth() + 1).padStart(2, '0') +
// //       '-' +
// //       String(today.getDate()).padStart(2, '0');

// //     this.vlntrFrm.patchValue({
// //       dateOfVolunteering: formatted,
// //       volunteerCode: this.volunteeringService.volunteerCodeInS ,
// //       poorManCode: this.volunteeringService.poorManCodeInS ,
// //       matcherCode: this.volunteeringService.matcherCodeInS ,
// //       projectCode: this.volunteeringService.projectCodeInS ,
// //       subProjectCode: this.volunteeringService.subProjectCodeInS 
// //     });
// //     this.filteredSubProjects =  this.subProjectService.Projects.filter(subPro => subPro.projectCode === Number(this.volunteeringService.projectCodeInS))

// //     await this.volunteerService.getAllVolunteers().subscribe(res => { this.volunteerService.volunteers = res });
// //     await this.projectService.getAllProjects().subscribe(res => { this.projectsArr = res; this.projectService.projects = res });
// //     await this.subProjectService.getAllProjects().subscribe(res => { this.subProjects = res; this.subProjectService.Projects = res });
// //     await this.ecdService.getAllEichud().subscribe(res => { this.ecdService.peopleInTheEichud = res });  

// //   }



// //   onProjectChange(event: Event) {
// //     const selectedProjectCode = (event.target as HTMLSelectElement).value;
// //     this.filteredSubProjects = this.subProjects.filter(subPro => subPro.projectCode === Number(selectedProjectCode));
// //   }
// //   // getVolunteerName(volunteerCode: number | undefined): string {
// //   //   // alert(volunteerCode)
// //   //   if (volunteerCode === undefined) {
// //   //   return 'שם לא נמצא';
// //   //   }
// //   //   const volunteer = this.eichudPeople.find(v => v.eichudCode === volunteerCode);
// //   //   // alert( volunteer)
// //   //   return volunteer ? (volunteer.familyName+" "+volunteer.firstName) : 'שם לא נמצא';
// //   // }

// //   async ngOnInit(){
// //     await this.getVolunteering()// this.volunteeringArr = await  lastValueFrom(this.volunteerService.getAllVolunteers());
// //     this.projectsArr = await  lastValueFrom(this.projectService.getAllProjects());
// //     this.subProjects = await  lastValueFrom(this.subProjectService.getAllProjects());
// //     this.volunteerArr = await  lastValueFrom(this.volunteerService.getAllVolunteers());
// //     // this.eichudPeople = await  lastValueFrom(this.eichudService.getAllEichud());
// //     this.volunteerService.refreshData();
// //    this.ecdService.refreshData();
  
// //     //  alert(this.subProjects.length)
// //   }


// //   vlntrFrm = new FormGroup({
// //     // volunteeringCode: new FormControl<number | null>(null, Validators.required),
// //     dateOfVolunteering: new FormControl<Date | null>(null, Validators.required),
// //     volunteerCode: new FormControl<number | null>(null),
// //     poorManCode: new FormControl<number | null>(null),
// //     matcherCode: new FormControl<number | null>(null),
// //     projectCode: new FormControl<number | null>(null),
// //     subProjectCode: new FormControl<number | null>(null)

// //   });

// //   addVolunteering() {
// //     if (this.vlntrFrm.valid) {
// //       const volunteering = {


// //         dateOfVolunteering: this.vlntrFrm.value.dateOfVolunteering!,
// //         volunteerCode: this.vlntrFrm.value.volunteerCode!,
// //         poorManCode: this.vlntrFrm.value.poorManCode!,
// //         matcherCode: this.vlntrFrm.value.matcherCode!,
// //         projectCode: this.vlntrFrm.value.projectCode!,
// //         subProjectCode: this.vlntrFrm.value.subProjectCode!
// //       }
// //       this.volunteeringService.addVolunteering(volunteering);
// //       alert(volunteering)
// //     }
// //   }
// //   deleteVolunteering(v: VolunteeringModule) {
// //     this.volunteeringService.addVolunteering(v);

// //   }
// //   updateVolunteering(v: VolunteeringModule) {
// //     this.volunteeringService.updateVolunteering(v);

// //   }
// //   getVolunteering() {
// //     this.volunteeringService.getAllVolunteerings().subscribe(res => { this.volunteeringArr = res })

// //   }

// //   // getVolunteeringById(v: VolunteeringModule) {
// //   //   this.volunteeringService.getVolunteeringById(v.volunteeringCode)
// //   // }


// // }
import { VolunteeringService } from '../../Services/volunteering-service';
import { EichudModel } from '../../Models/EichudModel';

import { AsyncPipe, CommonModule, DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VolunteerModel } from '../../Models/volunteer/volunteer-module';
import { VolunteerService } from '../../Services/volunteer-service';
import { EichudService } from '../../Services/eichud-service';
import { DataView } from 'primeng/dataview';
import { DatePicker, DatePickerModule } from 'primeng/datepicker';
import { ProjectService } from '../../Services/project-service';
import { ProjectModule } from '../../Models/project/project-module';
import { SubProjectService } from '../../Services/sub-project-service';
import { SubProjectModule } from '../../Models/sub-project/sub-project-module';
import { lastValueFrom } from 'rxjs';
import { AsyncAction } from 'rxjs/internal/scheduler/AsyncAction';
import { Component, inject } from '@angular/core';
import { VolunteeringModule } from '../../Models/volunteering/volunteering/volunteering-module';
import { NO_ERRORS_SCHEMA, SECURITY_SCHEMA } from '@angular/compiler';

@Component({
  selector: 'app-volunteering',
  imports: [AsyncPipe, ReactiveFormsModule, CommonModule],
  templateUrl: './volunteering.html',
  styleUrl: './volunteering.scss'
})
export class Volunteering {
  projectService = inject(ProjectService)
  projectsArr: ProjectModule[] = [];
  subProjectService = inject(SubProjectService)
  subProjects: SubProjectModule[] = [];
  filteredSubProjects: SubProjectModule[] = []; // מאגר ה-subProjects המותאם לפי projectCode
  // poorManService = inject(EichudService)
  volunteeringArr: VolunteeringModule[] = [];
  volunteerArr: VolunteerModel[] = []//מערך מתנדבים
  volunteeringService = inject(VolunteeringService)
  volunteerService = inject(VolunteerService)
  ecdService = inject(EichudService)

  vlntrFrm = new FormGroup({
    dateOfVolunteering: new FormControl<string | null>(null, Validators.required),

    volunteerCode: new FormControl<number | null>(this.volunteeringService.volunteerCodeInS ? this.volunteeringService.volunteerCodeInS : null, Validators.required),
    poorManCode: new FormControl<number | null>(this.volunteeringService.poorManCodeInS ? this.volunteeringService.poorManCodeInS : null, Validators.required),
    matcherCode: new FormControl<number | null>(this.volunteeringService.matcherCodeInS ? this.volunteeringService.matcherCodeInS : null, Validators.required),
    projectCode: new FormControl<number | null>(this.volunteeringService.projectCodeInS ? this.volunteeringService.projectCodeInS : null),
    subProjectCode: new FormControl<number | null>(this.volunteeringService.subProjectCodeInS ? this.volunteeringService.subProjectCodeInS : null)

  });
  async ngOnInit() {
    const today = new Date();

    const formatted =
      today.getFullYear() +
      '-' +
      String(today.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(today.getDate()).padStart(2, '0');

    this.vlntrFrm.patchValue({
      dateOfVolunteering: formatted,
      volunteerCode: this.volunteeringService.volunteerCodeInS ,
      poorManCode: this.volunteeringService.poorManCodeInS ,
      matcherCode: this.volunteeringService.matcherCodeInS ,
      projectCode: this.volunteeringService.projectCodeInS ,
      subProjectCode: this.volunteeringService.subProjectCodeInS 
    });

    await lastValueFrom(this.volunteerService.getAllVolunteers()).then(res => { this.volunteerService.volunteers = res });
    await lastValueFrom(this.projectService.getAllProjects()).then(res => { this.projectsArr = res; this.projectService.projects = res });
    await this.volunteeringService.refreshData();
    await lastValueFrom(this.subProjectService.getAllProjects()).then(res => { this.subProjects = res; this.subProjectService.Projects = res });
    await lastValueFrom(this.ecdService.getAllEichud()).then(res => { this.ecdService.peopleInTheEichud = res });  
    await lastValueFrom(this.volunteeringService.getAllVolunteerings()).then(res => { this.volunteeringService.volunteerings = res ; this.volunteeringArr = res });  
    this.filteredSubProjects = await  this.subProjectService.Projects.filter(subPro => subPro.projectCode === Number(this.volunteeringService.projectCodeInS))

  }



  onProjectChange(event: Event) {
    const selectedProjectCode = (event.target as HTMLSelectElement).value;
    this.filteredSubProjects = this.subProjectService.Projects.filter(subPro => subPro.projectCode === Number(selectedProjectCode));
  }
 
  addVolunteering() {
    if (this.vlntrFrm.valid) {
      const volunteering = {
        dateOfVolunteering: this.vlntrFrm.value.dateOfVolunteering!,
        volunteerCode: this.vlntrFrm.value.volunteerCode!,
        poorManCode: this.vlntrFrm.value.poorManCode!,
        matcherCode: this.vlntrFrm.value.matcherCode!,
        projectCode: this.vlntrFrm.value.projectCode!,
        subProjectCode: this.vlntrFrm.value.subProjectCode!
      }
      this.volunteeringService.addVolunteering(volunteering);
      alert(this.volunteeringArr.length)
      this.vlntrFrm.reset(); // איפוס הטופס לאחר הוספה
    }
  }
  deleteVolunteering(v: VolunteeringModule) {
    this.volunteeringService.addVolunteering(v);

  }
  updateVolunteering(v: VolunteeringModule) {
    this.volunteeringService.updateVolunteering(v);

  }
  getVolunteering() {
    this.volunteeringService.getAllVolunteerings().subscribe(res => { this.volunteeringArr = res })

  }

}





