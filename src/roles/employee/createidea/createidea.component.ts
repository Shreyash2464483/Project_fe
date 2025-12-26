import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { IdeaService } from '../../../services/idea.service';
import { AuthService } from '../../../services/auth.service';
import { UserRole } from '../../../models/model';

@Component({
  selector: 'app-createidea',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './createidea.component.html',
  styleUrl: './createidea.component.css',
})
export class CreateideaComponent implements OnInit {
  form!: FormGroup;

  currentRole: UserRole | null = null;
  currentUserId = 0;

  constructor(
    private fb: FormBuilder,
    private ideaService: IdeaService,
    private router: Router,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(120)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: [''],
      status: ['UnderReview'],
    });
  }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.currentRole = user.role;
      this.currentUserId = user.userID;
    }
  }

  submit() {
    if (this.form.invalid) return;

    const payload: any = {
      title: this.form.value.title,
      description: this.form.value.description,
      category: this.form.value.category,
      submittedByUserID: this.currentUserId,
      submittedDate: new Date().toISOString(),
      status: 'UnderReview',
    };

    if (
      this.currentRole === UserRole.MANAGER &&
      (this.form.value.status === 'Draft' ||
        this.form.value.status === 'Approved')
    ) {
      payload.status = this.form.value.status;
    }

    this.ideaService.createIdea(payload);
    this.router.navigate(['employee/dashboard']);
  }
}