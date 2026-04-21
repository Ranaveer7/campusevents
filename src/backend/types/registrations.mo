import Common "common";
import FeedbackTypes "feedback";

module {
  public type RegistrationStatus = {
    #registered;
    #cancelled;
  };

  public type Registration = {
    id : Common.RegistrationId;
    userId : Common.UserId;
    eventId : Common.EventId;
    registrationDate : Common.Timestamp;
    status : RegistrationStatus;
  };

  public type RegistrationsPerEvent = {
    eventId : Common.EventId;
    eventName : Text;
    count : Nat;
  };

  public type RegistrationsPerCategory = {
    category : Text;
    count : Nat;
  };

  public type RegistrationsPerMonth = {
    month : Text;
    count : Nat;
  };

  public type AnalyticsResult = {
    registrationsPerEvent : [RegistrationsPerEvent];
    registrationsPerCategory : [RegistrationsPerCategory];
    registrationsPerMonth : [RegistrationsPerMonth];
    averageRatingsByEvent : [FeedbackTypes.AverageRatingByEvent];
  };
};
