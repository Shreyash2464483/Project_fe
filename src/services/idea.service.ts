import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Idea, Comment, Vote, Review } from '../models/model';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class IdeaService {
  private ideas$ = new BehaviorSubject<Idea[]>([]);
  private apiUrl = 'https://localhost:7175/api/Idea';

  constructor(private http: HttpClient) {
    // Don't auto-load - let components request fresh data when needed
  }

  loadIdeas(): void {
    console.log('Loading ideas from backend...');
    this.http.get<any[]>(`${this.apiUrl}/all`).subscribe({
      next: (ideas) => {
        console.log('Raw ideas from backend:', ideas);
        // Map backend response to frontend Idea model
        const mappedIdeas = ideas.map((idea) => ({
          ideaID: idea.ideaId || idea.ideaID,
          title: idea.title,
          description: idea.description,
          categoryID: idea.categoryId || idea.categoryID,
          userID: idea.userId || idea.userID,
          submittedDate: idea.submittedDate || new Date().toISOString(),
          status: idea.status || 'UnderReview',
          category: idea.categoryName || idea.category || '',
          upvotes: idea.upvotes || 0,
          downvotes: idea.downvotes || 0,
        }));
        console.log('Mapped ideas:', mappedIdeas);
        this.ideas$.next(mappedIdeas);
      },
      error: (error) => {
        console.error('Error loading ideas:', error);
        this.ideas$.next([]);
      },
    });
  }

  getAllIdeas(): Observable<Idea[]> {
    return this.ideas$.asObservable();
  }

  getMyIdeas(): Observable<Idea[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-ideas`).pipe(
      tap((ideas) => {
        console.log('My ideas from backend:', ideas);
      }),
      tap((ideas) => {
        // Map backend response to frontend Idea model
        const mappedIdeas = ideas.map((idea) => ({
          ideaID: idea.ideaID || idea.ideaID,
          title: idea.title,
          description: idea.description,
          categoryID: idea.categoryID || idea.categoryID,
          userID: idea.userID || idea.userID,
          submittedDate: idea.submittedDate || new Date().toISOString(),
          status: idea.status || 'UnderReview',
          category: idea.category || idea.category || '',
          upvotes: idea.upvotes || 0,
          downvotes: idea.downvotes || 0,
        }));
        console.log('Mapped my ideas:', mappedIdeas);
      }),
    );
  }

  getIdeaById(id: number | string): Idea | undefined {
    return this.ideas$.value.find((i) => i.ideaID === id);
  }

  createIdea(partial: Partial<Idea>): Observable<Idea> {
    const payload = {
      title: partial.title || 'Untitled',
      description: partial.description || '',
      categoryId: partial.categoryID, // Send as GUID string
    };

    console.log('IdeaService - sending payload to backend:', payload);
    console.log(
      'CategoryId type:',
      typeof payload.categoryId,
      'Value:',
      payload.categoryId,
    );

    return this.http.post<any>(`${this.apiUrl}/submit`, payload).pipe(
      tap((response: any) => {
        console.log('Create idea response:', response);
        const newIdea: Idea = {
          ideaID: response.ideaId || response.ideaID,
          title: response.title,
          description: response.description,
          categoryID: response.categoryId || response.categoryID,
          userID: response.userId || response.userID,
          submittedDate: response.submittedDate || new Date().toISOString(),
          status: response.status || 'UnderReview',
          category: response.categoryName || response.category || '',
          upvotes: 0,
          downvotes: 0,
        };
        const ideas = [newIdea, ...this.ideas$.value];
        this.ideas$.next(ideas);
      }),
    );
  }

  addComment(c: Partial<Comment>): Comment {
    // TODO: Connect to backend API when available
    const comment: Comment = {
      commentID: Date.now(),
      ideaID: c.ideaID || 0,
      userID: c.userID || 0,
      text: c.text || '',
      createdDate: c.createdDate || new Date().toISOString(),
      userName: c.userName,
    };
    return comment;
  }

  addReview(r: Partial<Review>): Review {
    // TODO: Connect to backend API when available
    const review: Review = {
      reviewID: Date.now(),
      ideaID: r.ideaID || 0,
      reviewerID: r.reviewerID || 0,
      reviewerName: r.reviewerName,
      feedback: r.feedback || '',
      decision: r.decision || 'Reject',
      reviewDate: r.reviewDate || new Date().toISOString(),
    };
    return review;
  }

  getReviewsForIdea(ideaID: number | string) {
    // TODO: Connect to backend API when available
    return [];
  }

  setIdeaStatus(
    ideaID: number | string,
    status: 'Draft' | 'UnderReview' | 'Approved',
  ) {
    // TODO: Connect to backend API when available
    const ideas = this.ideas$.value.slice();
    const idx = ideas.findIndex((i) => i.ideaID === ideaID);
    if (idx >= 0) {
      ideas[idx] = { ...ideas[idx], status };
      this.ideas$.next(ideas);
    }
  }

  getCommentsForIdea(ideaID: number | string): Comment[] {
    // TODO: Connect to backend API when available
    return [];
  }

  vote(
    ideaID: number | string,
    userID: number,
    voteType: 'Upvote' | 'Downvote',
  ) {
    // TODO: Connect to backend API when available
    console.log('Vote:', { ideaID, userID, voteType });
  }
}
