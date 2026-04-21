import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export type EventId = bigint;
export interface Registration {
    id: RegistrationId;
    status: RegistrationStatus;
    eventId: EventId;
    userId: UserId;
    registrationDate: Timestamp;
}
export interface Feedback {
    id: FeedbackId;
    eventId: EventId;
    userId: UserId;
    submittedAt: Timestamp;
    comment: string;
    rating: bigint;
}
export type RegistrationId = bigint;
export interface UpdateEventRequest {
    id: EventId;
    date: string;
    name: string;
    time: string;
    description: string;
    category: EventCategory;
    capacity: bigint;
    department: string;
    location: string;
}
export interface Event {
    id: EventId;
    date: string;
    name: string;
    createdAt: Timestamp;
    createdBy: UserId;
    time: string;
    description: string;
    category: EventCategory;
    capacity: bigint;
    department: string;
    location: string;
    registrationCount: bigint;
}
export interface AnalyticsResult {
    registrationsPerEvent: Array<RegistrationsPerEvent>;
    registrationsPerCategory: Array<RegistrationsPerCategory>;
    averageRatingsByEvent: Array<AverageRatingByEvent>;
    registrationsPerMonth: Array<RegistrationsPerMonth>;
}
export interface RegistrationsPerCategory {
    count: bigint;
    category: string;
}
export type UserId = Principal;
export interface RegistrationsPerEvent {
    eventId: EventId;
    count: bigint;
    eventName: string;
}
export interface RegistrationsPerMonth {
    month: string;
    count: bigint;
}
export interface CreateEventRequest {
    date: string;
    name: string;
    time: string;
    description: string;
    category: EventCategory;
    capacity: bigint;
    department: string;
    location: string;
}
export type FeedbackId = bigint;
export interface AverageRatingByEvent {
    eventId: EventId;
    averageRating: number;
    totalFeedback: bigint;
    eventName: string;
}
export interface UserProfile {
    name: string;
    createdAt: Timestamp;
    role: UserRole;
    email: string;
}
export enum EventCategory {
    social = "social",
    other = "other",
    academic = "academic",
    cultural = "cultural",
    technical = "technical",
    sports = "sports"
}
export enum RegistrationStatus {
    cancelled = "cancelled",
    registered = "registered"
}
export enum UserRole {
    admin = "admin",
    student = "student"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    cancelRegistration(registrationId: RegistrationId): Promise<boolean>;
    createEvent(req: CreateEventRequest): Promise<Event>;
    deleteEvent(eventId: EventId): Promise<boolean>;
    deleteFeedback(feedbackId: FeedbackId): Promise<boolean>;
    getAnalytics(): Promise<AnalyticsResult>;
    getAverageRating(): Promise<Array<AverageRatingByEvent>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getEvent(eventId: EventId): Promise<Event | null>;
    getFeedbackByUser(): Promise<Array<Feedback>>;
    getFeedbackForEvent(eventId: EventId): Promise<Array<Feedback>>;
    getProfile(user: Principal): Promise<UserProfile | null>;
    getRegistration(registrationId: RegistrationId): Promise<Registration | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listAllFeedback(): Promise<Array<Feedback>>;
    listEvents(): Promise<Array<Event>>;
    listRegistrations(): Promise<Array<Registration>>;
    listRegistrationsByEvent(eventId: EventId): Promise<Array<Registration>>;
    listRegistrationsByUser(): Promise<Array<Registration>>;
    listUsers(): Promise<Array<[UserId, UserProfile]>>;
    registerForEvent(eventId: EventId): Promise<Registration>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitFeedback(eventId: EventId, rating: bigint, comment: string): Promise<Feedback>;
    updateEvent(req: UpdateEventRequest): Promise<boolean>;
    updateProfile(profile: UserProfile): Promise<void>;
}
