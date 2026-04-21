import Common "common";

module {
  public type Feedback = {
    id : Common.FeedbackId;
    userId : Common.UserId;
    eventId : Common.EventId;
    rating : Nat;
    comment : Text;
    submittedAt : Common.Timestamp;
  };

  public type AverageRatingByEvent = {
    eventId : Common.EventId;
    eventName : Text;
    averageRating : Float;
    totalFeedback : Nat;
  };
};
