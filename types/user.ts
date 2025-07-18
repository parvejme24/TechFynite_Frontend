export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  photoUrl?: string | null;
  designation?: string | null;
  role: string;
  phone?: string | null;
  country?: string | null;
  city?: string | null;
  stateOrRegion?: string | null;
  postCode?: string | null;
  balance?: number;
  createdAt?: string;
  updatedAt?: string;
  isVerified?: boolean;
}
