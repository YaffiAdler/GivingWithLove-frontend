import { Component, inject } from '@angular/core';
import { Volunteer } from '../volunteer/volunteer';
import { VolunteerService } from '../../Services/volunteer-service';
import { UserModel } from '../../Models/user/user-model/user-model';
import { PositionService } from '../../Services/position-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EichudService } from '../../Services/eichud-service';
import { VolunteerModel } from '../../Models/volunteer/volunteer-module';
import { EichudModel } from '../../Models/EichudModel';
import { VolunteeringService } from '../../Services/volunteering-service';
import { forkJoin, lastValueFrom } from 'rxjs';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-log-in',
  imports: [ReactiveFormsModule],
  templateUrl: './log-in.html',
  styleUrl: './log-in.scss',
})
export class LogIn {
  constructor(private router: Router) { }
  error: boolean = true
  volunteerSrv: VolunteerService = inject(VolunteerService)
  volunteeringSrv: VolunteeringService = inject(VolunteeringService)
  volunteerArr:VolunteerModel[]=[]
  user?:VolunteerModel;
  positoinSrv: PositionService = inject(PositionService)
  eichudSrv: EichudService = inject(EichudService)
  eichudArr:EichudModel[]=[]
  person?:EichudModel
  lgFrm: FormGroup = new FormGroup({
  userName: new FormControl("אנונימי", [Validators.required]),
  password: new FormControl(1, [Validators.required]),
  position: new FormControl("זמני", [Validators.required])
  })
async ngOnInit() {
  try {
    // טען את כל המתנדבים
    this.volunteerSrv.volunteers = await lastValueFrom(this.volunteerSrv.getAllVolunteers());

    // טען את כל אנשי האיחוד
    this.eichudSrv.peopleInTheEichud = await lastValueFrom(this.eichudSrv.getAllEichud());

    // טען את כל התפקידים
    this.positoinSrv.positions = await lastValueFrom(this.positoinSrv.getAllPositions());
  } catch (err) {
    console.error('Failed to load login data', err);
  }
}
  
  enter() {
    let u = new UserModel()
    console.log(this.volunteerSrv.volunteers);
    u.userName = this.lgFrm.controls['userName'].value;
    u.password = this.lgFrm.controls['password'].value;

      this.user = this.volunteerSrv.volunteers.find(x => x.volunteerCodeNavigation?.eichudCode === u.password)
      this.person = this.eichudSrv.peopleInTheEichud.find(x =>x.eichudCode == u.password)

      if (((this.person?.familyName)?.trim() + " " + (this.person?.firstName)?.trim()) != u.userName) {
      this.error = false
    }
    else {
     if(this.user == undefined)
        this.volunteerSrv.currentUser = undefined
     else{
      u.position = this.user.positionCode
      let nameOfPosition = this.positoinSrv.positions.find(x => x.positionCode == u.position)?.positionName
      this.volunteerSrv.userPosition = nameOfPosition
      this.volunteerSrv.setCurrentUser(u.password)
      this.lgFrm.controls['userName'].setValue(null);
      this.lgFrm.controls['password'].setValue(null);
      this.volunteeringSrv.setSelectedMatcher(Number(u.password))
      this.router.navigate(['/home'])
    }}
  }
}
