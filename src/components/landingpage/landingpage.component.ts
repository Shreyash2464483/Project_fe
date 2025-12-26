import { TypewriterDirective } from './typewriter.directive';

import { Component, OnInit, ElementRef,NgZone,AfterViewInit,OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-landingpage',
  standalone: true,
  imports: [CommonModule, RouterModule,TypewriterDirective], // <-- NgIf, ng-template, routerLink
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.css'],
})
export class LandingpageComponent implements OnInit {
  roles = [
    {
      title: 'Employee',
      icon: '👨‍💻',
      description:
        'Submit innovative ideas and collaborate with team members to improve organizational processes.',
      features: [
        '✓ Submit your ideas',
        '✓ Vote on other ideas',
        '✓ Discuss and collaborate',
        '✓ Track idea progress',
      ],
      cta: 'Start as Employee',
      route: '/signup',
      color: '#3b82f6',
    },
    {
      title: 'Manager',
      icon: '👨‍💼',
      description:
        'Review, manage, and track ideas from your team members. Make decisions and drive innovation.',
      features: [
        '✓ Review all ideas',
        '✓ Provide feedback',
        '✓ Approve/reject ideas',
        '✓ Team management',
      ],
      cta: 'Manage as Manager',
      route: '/signup',
      color: '#8b5cf6',
    },
    {
      title: 'Administrator',
      icon: '👨‍💼',
      description:
        'Have full control over the system. Manage users, categories, and system-wide settings.',
      features: [
        '✓ Full system access',
        '✓ User management',
        '✓ Custom categories',
        '✓ Advanced analytics',
      ],
      cta: 'Manage as Admin',
      route: '/signup',
      color: '#ec4899',
    },
  ];
  constructor(private router: Router) {}

  ngOnInit(): void {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
