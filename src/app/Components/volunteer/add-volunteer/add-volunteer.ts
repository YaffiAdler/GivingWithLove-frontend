// import { Component, inject } from '@angular/core';
// import { Component, inject } from '@angular/core';
import { VolunteerService } from '../../../Services/volunteer-service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { VolunteerDomain } from '../../volunteer-domain/volunteer-domain';
import { EichudService } from '../../../Services/eichud-service';
import { EichudModel } from '../../../Models/EichudModel';
import { forkJoin, lastValueFrom } from 'rxjs';
import { PositionService } from '../../../Services/position-service';
import { PositionModel } from '../../../Models/PositionModel';
import { FormBuilder } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VolunteerDomain } from '../../volunteer-domain/volunteer-domain';
import { VolunteerDomainService } from '../../../Services/volunteer-domain-service';
import { VolunteerDomainModule } from '../../../Models/volunteer-domain/volunteer-domain-module';
import { ProjectService } from '../../../Services/project-service';
import { ProjectModule } from '../../../Models/project/project-module';
import { Volunteer } from '../volunteer';
import { T } from '@angular/cdk/keycodes';
import { VolunteerModel } from '../../../Models/volunteer/volunteer-module';
import { Component, inject, Input } from '@angular/core';

// domainList
@Component({
  selector: 'app-add-volunteer',
  imports: [AsyncPipe, ReactiveFormsModule, CommonModule, ScrollingModule, RouterModule, VolunteerDomain],
  templateUrl: './add-volunteer.html',
  styleUrls: ['./add-volunteer.scss']
})
export class AddVolunteer {
  volunteerService = inject(VolunteerService)
  volunteerDomainService = inject(VolunteerDomainService)
  eichudService = inject(EichudService)
  positionService = inject(PositionService)
  projectService = inject(ProjectService);
  listE: EichudModel[] = [];
  listP: PositionModel[] = [];
  listProject: ProjectModule[] = [];
  filteredList: EichudModel[] = [];
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  domainList: number[] = []
  domainList2: VolunteerDomainModule[] = []
  volunteerDomains: VolunteerDomainModule[] = [];
  volun!:VolunteerModel
  isE:boolean=false
  // p!:VolunteerModel
  randomIntFromInterval: (min: number, max: number) => number = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
// domain6:VolunteerDomainModule()=VolunteerDomainModule();
  // listProject: { projectCode: string, projectName: string }[] = []; // לדוגמה

  // vlntrDmnFrm: FormGroup = this.formBuilder.group({
  //   domain: [null]
  // });

  vlntrFrm: FormGroup = this.formBuilder.group({
    name: [null, Validators.required],
    position: [null, Validators.required],
    volunteerDomains: [null]

  });

  form: FormGroup = this.formBuilder.group({
    searchText: ['']
  });
  isLoading = true;
  constructor(private route: ActivatedRoute) {}
  async ngOnInit() {
    console.log(this.volunteerService.volunteerInS);
    
    const id = this.route.snapshot.paramMap.get('id');

  if (id) {
    // מצב עריכה
    this.isE=true;
    if(this.volunteerService.volunteerInS){
    this.volun=this.volunteerService.volunteerInS
  // this.p=this.volunteerService.volunteerInS
}
  } else {
    // מצב הוספה
    this.isE=false;
  }
  if (this.isE && this.volun) {

  // POSITION - ערך ברירת מחדל
  this.vlntrFrm.patchValue({
    position: this.volun.positionCode
  });
 this.volunteerDomainService.setDomains(
    this.volun.volunteerDomains?.map(d => d.projectCode) ?? []
  );
  // DOMAINS - ערכים ברירת מחדל (מספרים)
  this.vlntrFrm.patchValue({
    volunteerDomains: this.volun.volunteerDomains?.map(d => d.projectCode) ?? []
  });
}
    this.isLoading = true;
     await lastValueFrom(this.eichudService.getAllEichud()).then(res => { this.listE = res; this.eichudService.peopleInTheEichud = res });
     await lastValueFrom(this.positionService.getAllPositions()).then(res => { this.listP = res; this.positionService.positions = res });
    await lastValueFrom(this.projectService.getAllProjects()).then(res => { this.listProject = res; this.projectService.projects = res });
    if(this.listE){
      this.filteredList = [...this.listE];
        this.isLoading = false;}
    
    // forkJoin({
    //   eichudList: this.eichudService.getAllEichud(),
    //   positionList: this.positionService.getAllPositions(),
    //   projectList: this.projectService.getAllProjects()
    // }).subscribe({
    //   next: ({ eichudList, positionList, projectList }) => {
    //     this.listE = eichudList;
    //     this.listP = positionList;
    //     this.listProject = projectList;
    //     this.filteredList = [...this.listE];
    //     this.isLoading = false;
    //   },
    //   error: (err) => {
    //     alert('שגיאה בטעינת נתונים');
    //     this.isLoading = false;
    //   }
    // });


    // this.volunteerService.refreshData()

  }
  edit(){
      // this.domainList2.push(this.vlntrDmnFrm.value.projectCode!);
    // ניקוי רשימת התחומים: מסנן ריקים וכפילויות
    const cleanDomains = this.volunteerDomainService.domains
      .map(domain => domain)
      .filter((domain, idx, arr) => domain && arr.indexOf(domain) === idx);
      // alert("ggg")
      console.log(cleanDomains);
      

//       for (let index = 0; index < cleanDomains.length; index++) {
//         // const domainModule = new VolunteerDomainModule();
//         const domain = new VolunteerDomainModule();
//         domain = {
//       projectCode: cleanDomains[index]!,
//       volunteerCode: this.vlntrFrm.value.name!,
//       volunteerDomainCode: index*10
//        }
// this.domainList2[index] = domain;

for (let index = 0; index < cleanDomains.length; index++) {
  const domain = new VolunteerDomainModule();
  domain.projectCode = cleanDomains[index]!;
  domain.volunteerCode = this.volun.volunteerCode;
 // או כל לוגיקה אחרת ליצירת קוד ייחודי
  this.domainList2[index] = domain;
}
// volunteerDomainsCode!:number

// volunteerCode !:number

// projectCode !:number

//  volunteer = {
//         volunteerCode: this.vlntrFrm.value.name!,
//         positionCode: this.vlntrFrm.value.position!,
//         volunteerDomains: this.domainList2
//       }     
      // }

    
      const volunteer = {
        volunteerCode:this.volun.volunteerCode,
        positionCode: this.vlntrFrm.value.position!,
        volunteerDomains: this.domainList2
      }
       console.log(this.volunteerService.updateVolunteer(volunteer));
      this.router.navigate(['/volunteer']);
        // this.volunteerService.addVolunteer(volunteer);
   


  }


  addVolunteer() {
    // this.domainList2.push(this.vlntrDmnFrm.value.projectCode!);
    // ניקוי רשימת התחומים: מסנן ריקים וכפילויות
    const cleanDomains = this.volunteerDomainService.domains
      .map(domain => domain)
      .filter((domain, idx, arr) => domain && arr.indexOf(domain) === idx);
      //  alert("ggg")
      console.log(cleanDomains);

//       for (let index = 0; index < cleanDomains.length; index++) {
//         // const domainModule = new VolunteerDomainModule();
//         const domain = new VolunteerDomainModule();
//         domain = {
//       projectCode: cleanDomains[index]!,
//       volunteerCode: this.vlntrFrm.value.name!,
//       volunteerDomainCode: index*10
//        }
// this.domainList2[index] = domain;

for (let index = 0; index < cleanDomains.length; index++) {
  const domain = new VolunteerDomainModule();
  domain.projectCode = cleanDomains[index]!;
  domain.volunteerCode = this.vlntrFrm.value.name!;
 // או כל לוגיקה אחרת ליצירת קוד ייחודי
  this.domainList2[index] = domain;
}
// volunteerDomainsCode!:number

// volunteerCode !:number

// projectCode !:number

//  volunteer = {
//         volunteerCode: this.vlntrFrm.value.name!,
//         positionCode: this.vlntrFrm.value.position!,
//         volunteerDomains: this.domainList2
//       }     
      // }

    if (this.vlntrFrm.valid) {
      const volunteer = {
        volunteerCode: this.vlntrFrm.value.name!,
        positionCode: this.vlntrFrm.value.position!,
        volunteerDomains: this.domainList2
      }
       console.log(this.volunteerService.addVolunteer(volunteer));
      this.router.navigate(['/volunteer']);
        // this.volunteerService.addVolunteer(volunteer);
    }

  }
  // addDomain(projectCode: string) {
  //     if (!this.domainsArray.value.includes(projectCode)) {
  //       this.domainsArray.push(new FormControl(projectCode));
  //     }
  //   }
  addVolunteerAndDomains() {
    // if (this.vlntrFrm.invalid) return;

    // // ניקוי רשימת התחומים: מסנן ריקים וכפילויות
    // const cleanDomains = this.domainList
    //   .map(domain => domain.trim())
    //   .filter((domain, idx, arr) => domain && arr.indexOf(domain) === idx);

    // if (cleanDomains.length === 0) {
    //   alert('יש להזין לפחות תחום אחד');
    //   return;
    // }

    // const volunteer = {
    //   volunteerCode: this.vlntrFrm.value.name!,
    //   positionCode: this.vlntrFrm.value.position!
    // };

    // this.volunteerService.addVolunteer(volunteer).subscribe({
    //   next: () => {
    //     const volunteerCode = volunteer.volunteerCode;
    //     const domainRequests = cleanDomains.map(domain => {
    //       const domainObj = new VolunteerDomainModule();
    //       domainObj.volunteerCode = volunteerCode;
    //       domainObj.projectCode = Number(domain);
    //       return this.volunteerDomainService.addVolunteerDomain(domainObj);
    //     });

    //     forkJoin(domainRequests).subscribe({
    //       next: (results: any) => {
    //         alert('המתנדב וכל התחומים נשמרו בהצלחה!');
    //         this.vlntrFrm.reset();
    //         this.domainList = [];
    //       },
    //       error: (err: any) => {
    //         alert('שגיאה בשמירת התחומים');
    //         console.error('שגיאה בשמירת התחומים', err);
    //       }
    //     });
    //   },
    //   error: (err: any) => {
    //     alert('שגיאה בשמירת המתנדב');
    //     console.error('שגיאה בששמירת המתנדב', err);
    //   }
    // });
  }

  // saveVolunteer() {
  //   if (this.vlntrFrm.valid) {
  //     const volunteerData = this.vlntrFrm.value;
  //     // volunteerData = { name, position, domains: [...] }
  //     this.volunteerService.addVolunteer(volunteerData);
  //   }
  // }

  get searchControl() {
    return this.form.get('searchText') as FormControl;
  }

  applyFilter(searchValue: string) {
    const search = searchValue.toLowerCase().trim();

    if (!search) {
      this.filteredList = [...this.listE];
      return;
    }
    console.log(this.filteredList);
    

    this.filteredList = this.listE.filter(e =>
      (`${e.familyName} ${e.firstName} ${e.shtibel} ${e.shver}`)
        .toLowerCase()
        .includes(search)
    );
  }
  onSearchChange(searchValue: string) {
    const search = searchValue.toLowerCase().trim();
    if (!search) {
      this.filteredList = [...this.listE]; // מציג את כל המתנדבים
      return;
    }
    console.log(this.filteredList);
    
    this.filteredList = this.listE.filter(e =>
      (`${e.familyName} ${e.firstName} ${e.shtibel} ${e.shver} ${e.firstName + ' ' + e.familyName}`)
        .toLowerCase()
        .includes(search)
    );
  }


  selectVolunteer(vol: EichudModel) {
    // מעדכן את ה-FormControl של המתנדב
    this.vlntrFrm.patchValue({ name: vol.eichudCode });
    // מעדכן גם את תיבת החיפוש כדי להראות למשתמש מה נבחר
    this.searchControl.setValue(`${vol.familyName} ${vol.firstName}`, { emitEvent: false });
  }
  calculateViewportHeight(): number {
    const itemHeight = 40; // אותו itemSize
    const maxHeight = 300; // גובה מקסימלי של התיבה
    const minHeight = 40;  // גובה מינימלי אם יש רק פריט אחד

    // מספר פריטים בפועל
    const itemCount = this.filteredList.length;

    // הגובה: פריטים * גובה פריט, מוגבל למקסימום ולמינימום
    return Math.min(maxHeight, Math.max(minHeight, itemCount * itemHeight));
  }












  // listProject: ProjectModule[] = [];
  //  formBuilder = inject(FormBuilder);

  // @Output() domainsChange = new EventEmitter<string[]>();

  // קריאה זו תופעל בכל שינוי תחום
  // onDomainChange() {
  //   this.domainsChange.emit([...this.volunteerDomains]);
  // }

//   async addDomain() {
//     this.listProject = await lastValueFrom(this.projectService.getAllProjects());
// // this.volunteerDomainService.add
//     this.domainList.push("{}");
//     // const domain = {
//     //   projectCode: this.vlntrDmnFrm.value.projectCode!,
//     //   volunteerCode: this.vlntrFrm.value.name!,
//     //   volunteerDomainCode: this.vlntrDmnFrm.value.volunteerDomainCode ?? 111
//     // }
//     // this.volunteerService.volunteer.addVolunteerDomain(domain);
//     // this.domainList2.push(this.vlntrDmnFrm.value.projectCode!);
//     // this.onDomainChange();
//   }
}

