import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import FeedbackLib "../lib/feedback";
import CommonTypes "../types/common";
import FeedbackTypes "../types/feedback";
import EventTypes "../types/events";

mixin (
  accessControlState : AccessControl.AccessControlState,
  feedbackList : List.List<FeedbackTypes.Feedback>,
  events : List.List<EventTypes.Event>,
  nextFeedbackId : { var value : Nat },
) {
  public shared ({ caller }) func submitFeedback(
    eventId : CommonTypes.EventId,
    rating : Nat,
    comment : Text,
  ) : async FeedbackTypes.Feedback {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    if (rating < 1 or rating > 5) {
      Runtime.trap("Rating must be between 1 and 5");
    };
    if (FeedbackLib.hasSubmittedFeedback(feedbackList, caller, eventId)) {
      Runtime.trap("Already submitted feedback for this event");
    };
    let id = nextFeedbackId.value;
    nextFeedbackId.value += 1;
    FeedbackLib.submitFeedback(feedbackList, id, caller, eventId, rating, comment, Time.now());
  };

  public query func getFeedbackForEvent(eventId : CommonTypes.EventId) : async [FeedbackTypes.Feedback] {
    FeedbackLib.getFeedbackByEvent(feedbackList, eventId);
  };

  public query ({ caller }) func getFeedbackByUser() : async [FeedbackTypes.Feedback] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    FeedbackLib.getMyFeedback(feedbackList, caller);
  };

  public query ({ caller }) func listAllFeedback() : async [FeedbackTypes.Feedback] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin only");
    };
    FeedbackLib.getAllFeedback(feedbackList);
  };

  public shared ({ caller }) func deleteFeedback(feedbackId : CommonTypes.FeedbackId) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin only");
    };
    FeedbackLib.deleteFeedback(feedbackList, feedbackId);
  };

  public query func getAverageRating() : async [FeedbackTypes.AverageRatingByEvent] {
    FeedbackLib.getAverageRatingsByEvent(feedbackList, events);
  };
};
