import { Component, inject, Output, EventEmitter, Input } from '@angular/core';
import { ProjectService } from '../../Services/project-service';
import { lastValueFrom } from 'rxjs';
import { VolunteerDomainService } from '../../Services/volunteer-domain-service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, NgModel, ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { RouterModule } from '@angular/router';
import { VolunteerDomainModule } from '../../Models/volunteer-domain/volunteer-domain-module';
import { ProjectModule } from '../../Models/project/project-module';


@Component({
  
  selector: 'app-volunteer-domain',
    standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule, CommonModule, ScrollingModule, RouterModule],
  templateUrl: './volunteer-domain.html',
  styleUrl: './volunteer-domain.scss'
})
export class VolunteerDomain {
  @Input() domain!: number;
  @Input()hhh!:number;
  projectService = inject(ProjectService);
  volunteerDomainService = inject(VolunteerDomainService);

  listProject: ProjectModule[] = [];
  formBuilder = inject(FormBuilder);
  vlntrDmnFrm: FormGroup = this.formBuilder.group({
    domain: [null]

  });
  // volunteerDomains: number[] = [];
  @Output() domainsChange = new EventEmitter<number[]>();

  // קריאה זו תופעל בכל שינוי תחום
  onDomainChange() {
    this.domainsChange.emit([...this.volunteerDomainService.domains]);
  }

  async ngOnInit() {
    if(this.hhh==1)
    this.vlntrDmnFrm.patchValue({
    domain:this.domain
  });

    try {
      this.listProject = await lastValueFrom(this.projectService.getAllProjects());
    } catch (err) {
      console.error('Failed to load projects', err);
    }
    //  this.listP = await  lastValueFrom(this.positionService.getAllPositions());
    //      this.filteredList = [...this.listE];
    //      this.searchControl.valueChanges.subscribe(value => {
    //        this.applyFilter(value);
    //      });


    //      this.volunteerService.refreshData()

  }
  addDomain() {
    // this.vlntrDmnFrm.value.projectCode!
    if (this.vlntrDmnFrm.value.domain > +0) {
      this.volunteerDomainService.addDomain(this.vlntrDmnFrm.value.domain)
      // this.volunteerDomains.push(this.vlntrDmnFrm.value.domain?.value);
      this.onDomainChange();
    }
    else
      alert("מלאו קודם תחום התנדבות")
  }
}



