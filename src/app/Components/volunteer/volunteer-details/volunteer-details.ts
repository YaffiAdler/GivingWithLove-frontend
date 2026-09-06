// import { Component, inject, OnInit } from '@angular/core';
// import { VolunteerModel } from '../../../Models/volunteer/volunteer-module';
// import { VolunteeringModule } from '../../../Models/volunteering/volunteering/volunteering-module';
// import { VolunteeringService } from '../../../Services/volunteering-service';
// import { VolunteerService } from '../../../Services/volunteer-service';
// import { AsyncPipe, CommonModule } from '@angular/common';
// import { ReactiveFormsModule } from '@angular/forms';
// import { RouterModule } from '@angular/router';
// import { ScrollingModule } from '@angular/cdk/scrolling';
// import { VolunteerDomain } from '../../volunteer-domain/volunteer-domain';
// import { ChartModule } from 'primeng/chart';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { MatIconModule } from '@angular/material/icon';
// import { lastValueFrom } from 'rxjs';

// import { I } from '@angular/cdk/keycodes';
// @Component({
//   selector: 'app-volunteer-details',
//   templateUrl: './volunteer-details.html',
//     standalone: true,

//   imports: [
//     ReactiveFormsModule,
//     CommonModule,
//     ScrollingModule,
//     RouterModule,
//     ChartModule,
//     MatIconModule 
//   ],
//   styleUrls: ['./volunteer-details.scss']
// })
// export class VolunteerDetails implements OnInit {
//   // dialogRef!: MatDialogRef<VolunteerDetails>;
//   constructor(
//   private volunteerService: VolunteerService,
//   private volunteeringService: VolunteeringService,
//   public dialogRef: MatDialogRef<VolunteerDetails>
// ) {}
  
// data=inject(MAT_DIALOG_DATA) as { volunteerCode: string };
//   // constructor(
//   //   private volunteerService: VolunteerService,
//   //   private volunteeringService: VolunteeringService,
    
//   //   @Inject(MAT_DIALOG_DATA) public data: { volunteerCode: string }
//   // ) {}

//   volunteer!: VolunteerModel;
//   volunteerings: VolunteeringModule[] = [];

//   // נתונים ל-PrimeNG Pie Chart
//   public pieChartDataForPrime: any;
//   public pieChartOptions: any = { responsive: true };



//   close() {
//     console.log("CLOSE DI");  
//     this.dialogRef.close();
//   }




// public barChartDataForPrime: any;
//   public barChartOptionsForPrime: any = {
//     responsive: true,
//     plugins: {
//       legend: { display: true, position: 'top' }
//     }
//   };
// // ...existing code...

// async ngOnInit() {
//   const volunteerCode = this.data.volunteerCode;
//   console.log(volunteerCode + " in volunteer details");

//   if (!volunteerCode) {
//     console.error('volunteerCode not set yet');
//     return;
//   }

//   // שליפת מתנדב
//   if (this.volunteerService.volunteers.length !== 0) {
//     console.log("Finding volunteer in list:", volunteerCode);
//     this.volunteer = this.volunteerService.volunteers.find(v => v.volunteerCode === Number(volunteerCode))!;
//   } else {
//     console.log("Finding volunteer from API:", volunteerCode);
//     this.volunteer = await lastValueFrom(this.volunteerService.getVolunteerById(Number(volunteerCode)));
//   }

//   if (!this.volunteer) {
//     console.error('Volunteer not found for code', volunteerCode);
//     return;
//   }

//   // שליפת התנדבויות
//   if (this.volunteeringService.volunteerings.length !== 0) {
//     console.log("Filtering volunteerings from list for code:", volunteerCode);
//     this.volunteerings = this.volunteeringService.volunteerings
//       .filter(v => v.volunteerCode === Number(volunteerCode))
//       .sort((a, b) => new Date(a.dateOfVolunteering).getTime() - new Date(b.dateOfVolunteering).getTime());
//   } else {
//     console.log("Fetching all volunteerings for code from API:", volunteerCode);
//     const allVols = await lastValueFrom(this.volunteeringService.getAllVolunteerings());
//     this.volunteerings = allVols
//       .filter(v => v.volunteerCode === Number(volunteerCode))
//       .sort((a, b) => new Date(a.dateOfVolunteering).getTime() - new Date(b.dateOfVolunteering).getTime());
//   }

//   this.processPieChart();
//   this.processBarChart();
// }

//   // constructor(
//   //   private volunteerService: VolunteerService,
//   //   private volunteeringService: VolunteeringService
//   // ) {}

// //  async ngOnInit() {
// // const volunteerCode = this.data.volunteerCode; // משתמשים בנתונים שהתקבלו
// // console.log(volunteerCode + " in volunteer details");

// // // const volunteerCode = this.volunteerService.volunteerCodeInS;

// //     if (!volunteerCode) {
      
// //         console.error('volunteerCode not set yet');
// //         return;
// //     }
// //     if(this.volunteerService.volunteers.length!==0){
// //       console.log("Finding volunteer in list:", volunteerCode);
      
// //       this.volunteer = this.volunteerService.volunteers.find(v => v.volunteerCode === Number(volunteerCode))!;
// //     }
// // else{
// //     console.log("Finding volunteer from API:", volunteerCode);
// //    await this.volunteerService.getVolunteerById(Number(volunteerCode)).subscribe(res => {
// //         this.volunteer = res;
// //     });
// // }
// //     if (!this.volunteer) {
// //       console.error('Volunteer not found for code', volunteerCode);
// //       return;
// //     }

// //     if(this.volunteeringService.volunteerings.length!==0){
// //       console.log("Filtering volunteerings from list for code:", volunteerCode);
      
// //       this.volunteerings = this.volunteeringService.volunteerings
// //             .filter(v => v.volunteerCode === Number(volunteerCode))
// //             .sort((a, b) => new Date(a.dateOfVolunteering).getTime() - new Date(b.dateOfVolunteering).getTime());
      
// //        this.processPieChart();
// //         this.processBarChart();
// //     }
// //     else{
// //       console.log("Fetching all volunteerings for code from API:", volunteerCode);

// //    await this.volunteeringService.getAllVolunteerings().subscribe(allVols => {
// //         this.volunteerings = allVols
// //             .filter(v => v.volunteerCode === Number(volunteerCode))
// //             .sort((a, b) => new Date(a.dateOfVolunteering).getTime() - new Date(b.dateOfVolunteering).getTime());

// //     // const volunteerCode = this.volunteerService.volunteerCodeInS;
// //     // if (!volunteerCode) return;

// //     // this.volunteerService.getVolunteerById(volunteerCode).subscribe(res => {
// //     //   this.volunteer = res;
// //     // });

// //     // this.volunteeringService.getAllVolunteerings().subscribe(allVols => {
// //     //   this.volunteerings = allVols
// //     //     .filter(v => v.volunteerCode === volunteerCode)
// //     //     .sort((a, b) => new Date(a.dateOfVolunteering).getTime() - new Date(b.dateOfVolunteering).getTime());
// //  this.processPieChart();
// //         this.processBarChart();
// //     });}
        
// //   }

//   processPieChart() {

    
//     console.log(this.dialogRef);
    
//     const domainMap: { [key: string]: number } = {};



    
//     if (this.volunteer.volunteerDomains) {
//       this.volunteer.volunteerDomains.forEach(d => {
//         const name = d?.volunteerDomainsCode || 'לא מוגדר';
//         domainMap[name] = (domainMap[name] || 0) + 1;
//       });
//     }

//     this.pieChartDataForPrime = {
//       labels: Object.keys(domainMap),
//       datasets: [
//         {
//           data: Object.values(domainMap),
//          backgroundColor: [
//   '#00e5ff',
//   '#00bcd4',
//   '#26c6da',
//   '#4dd0e1',
//   '#80deea',
//   '#0097a7',
//   '#4fc3f7'
// ],
// borderColor: '#071a22',
// borderWidth: 2,
// hoverOffset: 12
//         }
//       ]
//     };
//   }
//    processBarChart() {
//     console.log("Processing bar chart with volunteerings:", this.volunteerings);
    
//     const monthMap: { [key: string]: number } = {};
//     this.volunteerings.forEach(v => {
//       const month = new Date(v.dateOfVolunteering).toLocaleString('default', { month: 'short', year: 'numeric' });
//       monthMap[month] = (monthMap[month] || 0) + 1;
//     });

//     this.barChartDataForPrime = {
//       labels: Object.keys(monthMap).sort((a, b) => new Date(a).getTime() - new Date(b).getTime()),
//       datasets: [
//         {
//           label: 'התנדבויות לפי חודשים',
//           data: Object.values(monthMap),
//           backgroundColor: '#42A5F5'
//         }
//       ]
//     };
  
// }
// }

import { Component, inject, OnInit } from '@angular/core';
import { VolunteerModel } from '../../../Models/volunteer/volunteer-module';
import { VolunteeringModule } from '../../../Models/volunteering/volunteering/volunteering-module';
import { VolunteeringService } from '../../../Services/volunteering-service';
import { VolunteerService } from '../../../Services/volunteer-service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ChartModule } from 'primeng/chart';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-volunteer-details',
  templateUrl: './volunteer-details.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ScrollingModule,
    RouterModule,
    ChartModule,
    MatIconModule
  ],
  styleUrls: ['./volunteer-details.scss']
})
export class VolunteerDetails implements OnInit {

  // ===== injectים אחידים =====
  private volunteerService = inject(VolunteerService);
  private volunteeringService = inject(VolunteeringService);
  private dialogRef = inject(MatDialogRef<VolunteerDetails>);
  data = inject(MAT_DIALOG_DATA) as { volunteerCode: string };

  // ===== data =====
  volunteer!: VolunteerModel;
  volunteerings: VolunteeringModule[] = [];

  pieChartDataForPrime: any;
  pieChartOptions: any = { responsive: true };

  barChartDataForPrime: any;
  barChartOptionsForPrime: any = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' }
    }
  };

  // ===== lifecycle =====
  async ngOnInit() {
    const volunteerCode = this.data.volunteerCode;

    if (!volunteerCode) return;

    // ===== volunteer =====
    if (this.volunteerService.volunteers.length !== 0) {
      this.volunteer = this.volunteerService.volunteers
        .find(v => v.volunteerCode === Number(volunteerCode))!;
    } else {
      try {
        this.volunteer = await lastValueFrom(
          this.volunteerService.getVolunteerById(Number(volunteerCode))
        );
      } catch (err) {
        console.error('Failed to load volunteer', err);
      }
    }

    if (!this.volunteer) return;

    // ===== volunteerings =====
    if (this.volunteeringService.volunteerings.length !== 0) {
      this.volunteerings = this.volunteeringService.volunteerings
        .filter(v => v.volunteerCode === Number(volunteerCode))
        .sort((a, b) =>
          new Date(a.dateOfVolunteering).getTime() -
          new Date(b.dateOfVolunteering).getTime()
        );
    } else {
      let all: VolunteeringModule[] = [];
      try {
        all = await lastValueFrom(
          this.volunteeringService.getAllVolunteerings()
        );
      } catch (err) {
        console.error('Failed to load volunteerings', err);
      }

      this.volunteerings = all
        .filter(v => v.volunteerCode === Number(volunteerCode))
        .sort((a, b) =>
          new Date(a.dateOfVolunteering).getTime() -
          new Date(b.dateOfVolunteering).getTime()
        );
    }

    this.processPieChart();
    this.processBarChart();
  }

  // ===== close dialog =====
  close() {
    this.dialogRef.close();
  }

  // ===== pie chart =====
  processPieChart() {
    const domainMap: { [key: string]: number } = {};

    if (this.volunteer.volunteerDomains) {
      this.volunteer.volunteerDomains.forEach(d => {
        const name = d?.volunteerDomainsCode || 'לא מוגדר';
        domainMap[name] = (domainMap[name] || 0) + 1;
      });
    }

    this.pieChartDataForPrime = {
      labels: Object.keys(domainMap),
      datasets: [
        {
          data: Object.values(domainMap),
          backgroundColor: [
            '#00e5ff',
            '#00bcd4',
            '#26c6da',
            '#4dd0e1',
            '#80deea',
            '#0097a7',
            '#4fc3f7'
          ],
          borderColor: '#071a22',
          borderWidth: 2,
          hoverOffset: 12
        }
      ]
    };
  }

  // ===== bar chart =====
  processBarChart() {
    const monthMap: { [key: string]: number } = {};

    this.volunteerings.forEach(v => {
      const month = new Date(v.dateOfVolunteering)
        .toLocaleString('default', { month: 'short', year: 'numeric' });

      monthMap[month] = (monthMap[month] || 0) + 1;
    });

    this.barChartDataForPrime = {
      labels: Object.keys(monthMap),
      datasets: [
        {
          label: 'התנדבויות לפי חודשים',
          data: Object.values(monthMap),
          backgroundColor: '#42A5F5'
        }
      ]
    };
  }
}
