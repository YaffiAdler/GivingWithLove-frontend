import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { lastValueFrom } from 'rxjs';

import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { SubProjectModule } from '../../Models/sub-project/sub-project-module';
import { ProjectModule } from '../../Models/project/project-module';
import { SubProjectService } from '../../Services/sub-project-service';
import { ProjectService } from '../../Services/project-service';
import { ActivatedRoute } from '@angular/router';
import { VolunteerService } from '../../Services/volunteer-service';
import { VolunteeringService } from '../../Services/volunteering-service';
import { VolunteeringModule } from '../../Models/volunteering/volunteering/volunteering-module';

type Level = 'overview' | 'project' | 'subProject';

@Component({
  selector: 'app-data-display',
  imports: [RouterLink, BaseChartDirective],
  templateUrl: './data-display.html',
  styleUrl: './data-display.scss',
})
export class DataDisplay {

  // ===== service =====
  volunteeringService = inject(VolunteeringService);
  router = inject(Router);

  // ===== data =====
  data: VolunteeringModule[] = [];

  // ===== BI STATE (DRILL DOWN + FILTERS) =====
  state = signal({
    level: 'overview' as Level,
    project: null as string | null,
    subProject: null as string | null,
    from: null as Date | null,
    to: null as Date | null
  });

  // ===== load =====
  async ngOnInit() {
  this.projectCode = this.route.snapshot.paramMap.get('id');
  try {
    this.data = await lastValueFrom(this.volunteeringService.getAllVolunteerings());

    this.rebuildAll();

    this.Projects = await lastValueFrom(this.ProjectService.getAllProjects());
    this.subProjects = await lastValueFrom(this.subProjectService.getAllProjects());
    this.volunteeringArr = await lastValueFrom(this.volunteeringSrv.getAllVolunteerings());

    this.filteredProjects = this.Projects.filter(
      sp => sp.domainCode?.toString() === this.projectCode
    );

    this.filteredSubProjects = this.subProjects.filter(sp =>
      this.filteredProjects.some(fp => fp.projectCode === sp.projectCode)
    );

    this.volunteerSrv.refreshData();
    this.calcCost();
    this.calcTime();
    this.back();
  } catch (err) {
    console.error("שגיאה בטעינת הנתונים:", err);
  }

  }

  // ===== FILTERED DATA =====
  filtered = computed(() => {

    const s = this.state();

    return this.data.filter(v => {

      const d = v.dateOfVolunteering
        ? new Date(v.dateOfVolunteering)
        : null;

      if (s.from && d && d < s.from) return false;
      if (s.to && d && d > s.to) return false;

      if (s.project && v.projectCode?.toString() !== s.project) return false;
      if (s.subProject && v.subProjectCode?.toString() !== s.subProject) return false;

      return true;
    });
  });

  // ===== KPI =====
  kpiTotal = computed(() => this.filtered().length);

  kpiProjects = computed(() =>
    new Set(this.filtered().map(x => x.projectCode)).size
  );

  kpiVolunteers = computed(() =>
    new Set(this.filtered().map(x => x.volunteerCode)).size
  );

  // ===== CHARTS =====
  chartOptions: ChartConfiguration['options'] = { responsive: true };

  projectChart: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  subProjectChart: ChartConfiguration<'pie'>['data'] = { labels: [], datasets: [] };
  volunteerChart: ChartConfiguration<'doughnut'>['data'] = { labels: [], datasets: [] };
momentumChart: ChartConfiguration<'line'>['data'] = {
  labels: [],
  datasets: []
};
  // ===== BUILD ALL =====
  rebuildAll() {
    this.buildProjectChart();
    this.buildSubProjectChart();
    this.buildVolunteerChart();
  }

 // ===== PROJECTS =====
buildProjectChart() {

  const map = new Map<string, number>();

  this.filtered().forEach(v => {
    if (!v.projectCode) return;

    // MAP נשאר עם קוד
    const code = v.projectCode.toString();

    map.set(code, (map.get(code) || 0) + 1);
  });

  this.projectChart = {
    // רק בתצוגה מחליפים לשם
    labels: [...map.keys()].map(code =>
      this.Projects.find(p => p.projectCode?.toString() === code)?.projectName || code
    ),

    datasets: [{
      data: [...map.values()],
      label: 'פרויקטים',
      backgroundColor: '#42A5F5'
    }]
  };
}
  // ===== SUB PROJECTS =====
  buildSubProjectChart() {

    const map = new Map<string, number>();

    this.filtered().forEach(v => {
      if (!v.subProjectCode) return;
      map.set(v.subProjectCode.toString(), (map.get(v.subProjectCode.toString()) || 0) + 1);
    });

    this.subProjectChart = {
      labels: [...map.keys()],
      datasets: [{
        data: [...map.values()],
        backgroundColor: ['#66BB6A','#FFA726','#EF5350','#AB47BC']
      }]
    };
  }

  // ===== VOLUNTEERS =====
  buildVolunteerChart() {

    const map = new Map<string, number>();

    this.filtered().forEach(v => {
      if (!v.volunteerCode) return;
      map.set(v.volunteerCode.toString(), (map.get(v.volunteerCode.toString()) || 0) + 1);
    });

    this.volunteerChart = {
      labels: [...map.keys()],
      datasets: [{
        data: [...map.values()],
        backgroundColor: '#AB47BC'
      }]
    };
  }

  // ===== DRILL DOWN =====
  onProjectClick(e: any) {

    const i = e?.active?.[0]?.index;
    const label = this.projectChart.labels?.[i];

    if (!label) return;

    this.state.update(s => ({
      ...s,
      level: 'project',
      project: label.toString(),
    }));

    this.rebuildAll();
  }

  onSubProjectClick(e: any) {

    const i = e?.active?.[0]?.index;
    const label = this.subProjectChart.labels?.[i];

    if (!label) return;

    this.state.update(s => ({
      ...s,
      level: 'subProject',
      subProject: label.toString(),
    }));

    this.rebuildAll();
  }

  // ===== BACK =====
  back() {

    this.state.set({
      level: 'overview',
      project: null,
      subProject: null,
      from: null,
      to: null
    });

    this.rebuildAll();
  }

  // ===== DATE FILTER =====
  setDate(from: Date, to: Date) {

    this.state.update(s => ({
      ...s,
      from,
      to
    }));

    this.rebuildAll();
  }
private groupByMonth(data: VolunteeringModule[]) {

  const map = new Map<string, number>();

  data.forEach(v => {

    if (!v.dateOfVolunteering) return;

    const d = new Date(v.dateOfVolunteering);

    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;

    map.set(key, (map.get(key) || 0) + 1);
  });

  return map;
}
buildMoMChart() {

  const map = this.groupByMonth(this.filtered());

  const labels = [...map.keys()].sort();

  const current: number[] = [];
  const previous: number[] = [];

  labels.forEach((key, i) => {

    const val = map.get(key) || 0;

    current.push(val);

    const prevKey = labels[i - 1];
    previous.push(prevKey ? (map.get(prevKey) || 0) : 0);
  });

  this.momentumChart = {
    labels,
    datasets: [
      {
        label: 'חודש נוכחי',
        data: current,
        borderColor: '#42A5F5'
      },
      {
        label: 'חודש קודם',
        data: previous,
        borderColor: '#EF5350'
      }
    ]
  };
}
private groupByYear(data: VolunteeringModule[]) {

  const map = new Map<string, number>();

  data.forEach(v => {

    if (!v.dateOfVolunteering) return;

    const d = new Date(v.dateOfVolunteering);

    const key = `${d.getFullYear()}`;

    map.set(key, (map.get(key) || 0) + 1);
  });

  return map;
}
buildYoYChart() {

  const map = this.groupByYear(this.filtered());

  const years = [...map.keys()].sort();

  const current: number[] = [];
  const previous: number[] = [];

  years.forEach((y, i) => {

    current.push(map.get(y) || 0);

    const prevYear = years[i - 1];
    previous.push(prevYear ? (map.get(prevYear) || 0) : 0);
  });

  this.momentumChart = {
    labels: years,
    datasets: [
      {
        label: 'שנה נוכחית',
        data: current,
        borderColor: '#42A5F5'
      },
      {
        label: 'שנה קודמת',
        data: previous,
        borderColor: '#66BB6A'
      }
    ]
  };
}
  // ===== EXPORT CSV =====
  exportCSV() {

    const rows = this.filtered().map(v =>
      `${v.volunteeringCode},${v.projectCode},${v.subProjectCode},${v.volunteerCode},${v.dateOfVolunteering}`
    );

    const csv =
      'id,project,subProject,volunteer,date\n' + rows.join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'volunteering-report.csv';
    a.click();
  }
  




  projectsUnderDepartment: ProjectModule[] = [];
  filteredSubProjects: SubProjectModule[] = [];
  filteredProjects: ProjectModule[] = [];
  Projects: ProjectModule[] = [];
  subProjects: SubProjectModule[] = [];
  ProjectService = inject(ProjectService)
  subProjectService = inject(SubProjectService)
  projectCode!: string | null;
  projectName!: string | null;
  flag:boolean=false
  volunteeringSrv=inject(VolunteeringService)
  volunteeringArr:VolunteeringModule[]=[]
  vm:any=undefined
  volunteerSrv=inject(VolunteerService)
  estimatedTime:number=0;
  estimatedCost:number=0;
  subProject?: SubProjectModule;

constructor(private route: ActivatedRoute) { }


   
 calcCost = () => {
  
  this.estimatedCost = 0;
  for (let index = 0; index < this.volunteeringArr.length; index++) {
    const vm = this.volunteeringArr[index]?.subProjectCode;

    if (vm !== undefined) {
      const project = this.subProjects.find(
        x => x.subProjectCode === vm
      );

      if (project) {
        this.estimatedCost += Number(project.estimatedCost);
      }
    }
  }

  console.log(this.estimatedCost);
}
calcTime = () => {
  this.estimatedTime = 0;

  for (let index = 0; index < this.volunteeringArr.length; index++) {
    const vm = this.volunteeringArr[index]?.subProjectCode;

    if (vm !== undefined) {
      const project = this.subProjects.find(
        x => x.subProjectCode === vm
      );

      if (project) {
        this.estimatedTime += Number(project.estimatedTime);
      }
    }
  }
this.estimatedTime = this.estimatedTime / 60
  console.log(this.estimatedTime);
}

// allTheProjectsUnderDepartment = (x: number) => {
//   this.projectsUnderDepartment = this.Projects.filter(p => p.domainCode === x && p.projectCode!=x);
//   for (let index = 0; index < this.projectsUnderDepartment.length; index++) {
//     const element = this.projectsUnderDepartment[index];
//     // alert(element.projectName);
//   }
// }


// grouped: { [key: number]: ProjectModule[] } = {};

// this.Projects?.forEach(p => {
//   if (!this.grouped[p.domainCode!]) {
//     this.grouped[p.domainCode!] = [];
//   }
//   this.grouped[p.domainCode!].push(p);
// });

}

