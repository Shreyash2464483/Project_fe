import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdeaService } from '../../../services/idea.service';
import { UserService } from '../../../services/user.service';
import { CategoryService } from '../../../services/category.service';
import { Chart, registerables } from 'chart.js';
import { Idea } from '../../../models/model';

Chart.register(...registerables);

@Component({
  selector: 'app-reports',
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
  standalone: true,
})
export class ReportsComponent implements OnInit, AfterViewInit {

  departmentReports: {
    department: string;
    ideasSubmitted: number;
    approvedIdeas: number;
    participationCount: number;
  }[] = [];

  categoryReports: {
    category: string;
    ideasSubmitted: number;
    approvedIdeas: number;
  }[] = [];


  totalIdeas = 0;
  totalApproved = 0;
  totalUsers = 0;
  approvalRate = 0;

  departmentChart: Chart | null = null;
  categoryChart: Chart | null = null;
  approvalRateChart: Chart | null = null;
  ideaStatusChart: Chart | null = null;

  constructor(
    private ideaService: IdeaService,
    private userService: UserService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.generateReports();
  }

  ngAfterViewInit(): void {

  }

  generateReports(): void {

    this.ideaService.getAllIdeas().subscribe((ideas) => {
      this.totalIdeas = ideas.length;
      this.totalApproved = ideas.filter((i) => i.status === 'Approved').length;
      this.approvalRate = this.totalIdeas > 0
        ? Math.round((this.totalApproved / this.totalIdeas) * 100)
        : 0;


      this.initializeIdeaStatusChart(ideas);

      this.userService.getAllUsers().subscribe((users) => {
        this.totalUsers = users.length;
        const departments = [...new Set(users.map((u) => u.department).filter((d) => d))];

        this.departmentReports = departments.map((dept) => {
          const deptUsers = users.filter((u) => u.department === dept);
          const deptUserIds = deptUsers.map((u) => u.userID);
          const deptIdeas = ideas.filter((i) => deptUserIds.includes(i.submittedByUserID));
          const deptApproved = deptIdeas.filter((i) => i.status === 'Approved');

          return {
            department: dept!,
            ideasSubmitted: deptIdeas.length,
            approvedIdeas: deptApproved.length,
            participationCount: deptUsers.filter((u) =>
              ideas.some((idea) => idea.submittedByUserID === u.userID)
            ).length,
          };
        }).sort((a, b) => b.ideasSubmitted - a.ideasSubmitted);


        setTimeout(() => {
          this.initializeDepartmentChart();
          this.initializeApprovalRateChart();
        }, 100);
      });


      this.categoryService.getAllCategories().subscribe((categories) => {
        this.categoryReports = categories.map((cat) => {
          const catIdeas = ideas.filter((i) => i.categoryID === cat.categoryID);
          const catApproved = catIdeas.filter((i) => i.status === 'Approved');

          return {
            category: cat.name,
            ideasSubmitted: catIdeas.length,
            approvedIdeas: catApproved.length,
          };
        }).filter(r => r.ideasSubmitted > 0)
          .sort((a, b) => b.ideasSubmitted - a.ideasSubmitted);


        setTimeout(() => {
          this.initializeCategoryChart();
        }, 100);
      });
    });
  }

  initializeDepartmentChart(): void {
    const ctx = document.getElementById('departmentChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.departmentChart) {
      this.departmentChart.destroy();
    }

    this.departmentChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.departmentReports.map(r => r.department),
        datasets: [
          {
            label: 'Ideas Submitted',
            data: this.departmentReports.map(r => r.ideasSubmitted),
            backgroundColor: '#3b82f6',
            borderRadius: 6,
          },
          {
            label: 'Approved Ideas',
            data: this.departmentReports.map(r => r.approvedIdeas),
            backgroundColor: '#10b981',
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: { size: 12, weight: 'bold' },
              usePointStyle: true,
              padding: 20,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              font: { size: 11 },
            },
          },
          x: {
            ticks: {
              font: { size: 11 },
            },
          },
        },
      },
    });
  }

  initializeCategoryChart(): void {
    const ctx = document.getElementById('categoryChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.categoryChart) {
      this.categoryChart.destroy();
    }

    this.categoryChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.categoryReports.map(r => r.category),
        datasets: [
          {
            data: this.categoryReports.map(r => r.ideasSubmitted),
            backgroundColor: [
              '#3b82f6',
              '#10b981',
              '#f59e0b',
              '#ef4444',
              '#8b5cf6',
              '#ec4899',
              '#14b8a6',
              '#f97316',
            ],
            borderColor: '#ffffff',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              font: { size: 12, weight: 500 },
              usePointStyle: true,
              padding: 20,
            },
          },
        },
      },
    });
  }

  initializeApprovalRateChart(): void {
    const ctx = document.getElementById('approvalRateChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.approvalRateChart) {
      this.approvalRateChart.destroy();
    }

    this.approvalRateChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.departmentReports.map(r => r.department),
        datasets: [
          {
            label: 'Approval Rate (%)',
            data: this.departmentReports.map(r =>
              r.ideasSubmitted > 0
                ? Math.round((r.approvedIdeas / r.ideasSubmitted) * 100)
                : 0
            ),
            backgroundColor: '#8b5cf6',
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              font: { size: 11 },
              callback: function (value) {
                return value + '%';
              },
            },
          },
          x: {
            ticks: {
              font: { size: 11 },
            },
          },
        },
        plugins: {
          legend: {
            labels: {
              font: { size: 12, weight: 'bold' },
            },
          },
        },
      },
    });
  }

  initializeIdeaStatusChart(ideas: Idea[]): void {
    const ctx = document.getElementById('ideaStatusChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (this.ideaStatusChart) {
      this.ideaStatusChart.destroy();
    }

    const approved = this.totalApproved;
    const pending = this.totalIdeas - this.totalApproved;

    this.ideaStatusChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Approved', 'Pending'],
        datasets: [
          {
            data: [approved, pending],
            backgroundColor: ['#10b981', '#f59e0b'],
            borderColor: '#ffffff',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { size: 12, weight: 500 },
              usePointStyle: true,
              padding: 20,
            },
          },
        },
      },
    });
  }

  getApprovalRate(approved: number, total: number): number {
    return total > 0 ? Math.round((approved / total) * 100) : 0;
  }
}
