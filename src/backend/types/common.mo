module {
  public type UserId = Principal;
  public type EventId = Nat;
  public type RegistrationId = Nat;
  public type FeedbackId = Nat;
  public type Timestamp = Int;

  public type UserRole = {
    #admin;
    #student;
  };
};
