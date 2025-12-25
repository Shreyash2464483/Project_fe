export enum UserRole {
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
  MANAGER = 'manager',
}

export interface User {
  userID: number;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
}

export interface Idea {
  ideaID: number;
  title: string;
  description: string;
  categoryID: number;
  submittedByUserID: number;
  submittedDate: string;
  status: 'Draft' | 'UnderReview' | 'Approved';
  category?: string;
  upvotes?: number;
  downvotes?: number;
}
export interface Review {
  reviewID?: number;
  ideaID: number;
  reviewerID: number;
  reviewerName?: string;
  feedback: string;
  decision: 'Approve' | 'Reject';
  reviewDate?: string;
}

export interface Comment {
  commentID: number;
  ideaID: number;
  userID: number;
  text: string;
  createdDate: string;
  userName?: string;
}

export interface Vote {
  voteID: number;
  ideaID: number;
  userID: number;
  voteType: 'Upvote' | 'Downvote';
}

export interface Notification {
  notificationID: number;
  userID: number;
  type: 'NewIdea' | 'ReviewDecision';
  message: string;
  status: 'Unread' | 'Read';
  createdDate: string;
}
