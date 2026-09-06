// import { Component, inject } from '@angular/core';
import { VolunteerService } from '../../../Services/volunteer-service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VolunteerDomain } from '../../volunteer-domain/volunteer-domain';
import { EichudService } from '../../../Services/eichud-service';
import { EichudModel } from '../../../Models/EichudModel';
import { lastValueFrom } from 'rxjs';
import { PositionService } from '../../../Services/position-service';
import { PositionModel } from '../../../Models/PositionModel';
import { FormBuilder } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { VolunteeringService } from '../../../Services/volunteering-service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VolunteerModel } from '../../../Models/volunteer/volunteer-module';
import { VolunteerDetails } from '../volunteer-details/volunteer-details';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-volunteer',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ScrollingModule, RouterModule,MatIconModule],
  templateUrl: './all-volunteers.html',
  styleUrl: './all-volunteers.scss'
})
export class AllVolunteers {
  dialog = inject(MatDialog);
  volunteerService=inject(VolunteerService)
  eichudService=inject(EichudService)
  positionService=inject(PositionService)
  listE:EichudModel[]=[];
  // listP:PositionModel[]=[];
  listV:VolunteerModel[]=[];
  filteredList:VolunteerModel[] = [];
  formBuilder = inject(FormBuilder);
  volunteeringService=inject(VolunteeringService)
 router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  isD:boolean=false;
  vlntrFrm: FormGroup = this.formBuilder.group({
    name: [null, Validators.required],
    position: [null, Validators.required]
  });

  form: FormGroup = this.formBuilder.group({
    searchText: ['']
  });
    
   async ngOnInit(){

// this.listE = await  lastValueFrom(this.eichudService.getAllEichud());
// this.listP = await  lastValueFrom(this.positionService.getAllPositions());
try {
      this.listV = (await lastValueFrom(this.volunteerService.getAllVolunteers())) || [];
    } catch (err) {
      console.error('Failed to load volunteers', err);
      this.listV = [];
    }
    this.filteredList = [...this.listV];
    this.searchControl.valueChanges.pipe(takeUntilDestroyed()).subscribe(value => {
      this.applyFilter(value);
    });

    
    this.volunteerService.refreshData()

  }
  get searchControl() {
  return this.form.get('searchText') as FormControl;
}
goToVolunteering(d: any) {
  // קריאה לפונקציה
  console.log(d);

this.volunteeringService.setSelectedVolunteer(d.volunteerCodeNavigation?.eichudCode); // נניח שיש לך פונקציה כזו ב-VolunteeringService כדי לשמור את המתנדב הנבחר
  // ניווט
  this.router.navigate(['/v']);
}

goToEditVolunteer(d:any){
  this.volunteerService.setSelectedVolunteer2(d)
  this.router.navigate(['/volunteer/addvolunteer/edit', d.volunteerCode]);
}


goToVolunteerDetails(d: any) {
   if (!d || !d.volunteerCode) {
        console.error('Invalid volunteer data', d);
        return;
    }
this.isD=true
    console.log(d.volunteerCode);
    this.volunteerService.setSelectedVolunteer(d.volunteerCode);
    this.volunteerService.setSelectedVolunteer2(d)
this.dialog.open(VolunteerDetails, {
      width: '800px',   // גודל הפופאפ
      height: '600px',
      data: { volunteerCode: d.volunteerCode } // שולח את קוד המתנדב
    });

  // קריאה לפונקציה
  // console.log(d.volunteerCode);
  //  this.volunteerService.setSelectedVolunteer(d.volunteerCode);
  // // ניווט

  // this.router.navigate(['/volunteer/allvolunteers/volunteer-details']);
}
  applyFilter(searchValue: string) {
    const search = searchValue.toLowerCase().trim();

    if (!search) {
      this.filteredList = [...this.listV];
      return;
    }

    this.filteredList = this.listV.filter(e =>
      (`${e.volunteerCodeNavigation?.familyName} ${e.volunteerCodeNavigation?.firstName} ${e.volunteerCodeNavigation?.shtibel} ${e.volunteerCodeNavigation?.shver}${e.positionName}`)
        .toLowerCase()
        .includes(search)
    );
  }
  onSearchChange(searchValue: string) {
  const search = searchValue.toLowerCase().trim();
  if (!search) {
    this.filteredList = [...this.listV]; // מציג את כל המתנדבים
    return;
  }
  this.filteredList = this.listV.filter(e =>
    (`${e.volunteerCodeNavigation?.familyName} ${e.volunteerCodeNavigation?.firstName} ${e.volunteerCodeNavigation?.shtibel} ${e.volunteerCodeNavigation?.shver} ${e.volunteerCodeNavigation?.firstName +' '+ e.volunteerCodeNavigation?.familyName}`)
      .toLowerCase()
      .includes(search)
  );
}

addVolunteer(){
  if(this.vlntrFrm.valid){
    const volunteer = {
      volunteerCode: this.vlntrFrm.value.name!,
      positionCode: this.vlntrFrm.value.position!
    }
    this.volunteerService.addVolunteer(volunteer);
  }


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
}
