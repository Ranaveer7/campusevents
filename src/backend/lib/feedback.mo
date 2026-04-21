import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Float "mo:core/Float";
import CommonTypes "../types/common";
import FeedbackTypes "../types/feedback";
import EventTypes "../types/events";

module {
  public func submitFeedback(
    feedbackList : List.List<FeedbackTypes.Feedback>,
    nextId : Nat,
    userId : CommonTypes.UserId,
    eventId : CommonTypes.EventId,
    rating : Nat,
    comment : Text,
    now : CommonTypes.Timestamp,
  ) : FeedbackTypes.Feedback {
    let fb : FeedbackTypes.Feedback = {
      id = nextId;
      userId = userId;
      eventId = eventId;
      rating = rating;
      comment = comment;
      submittedAt = now;
    };
    feedbackList.add(fb);
    fb;
  };

  public func getFeedbackByEvent(
    feedbackList : List.List<FeedbackTypes.Feedback>,
    eventId : CommonTypes.EventId,
  ) : [FeedbackTypes.Feedback] {
    feedbackList.filter(func(f) { f.eventId == eventId }).toArray();
  };

  public func getMyFeedback(
    feedbackList : List.List<FeedbackTypes.Feedback>,
    userId : CommonTypes.UserId,
  ) : [FeedbackTypes.Feedback] {
    feedbackList.filter(func(f) { Principal.equal(f.userId, userId) }).toArray();
  };

  public func getAllFeedback(
    feedbackList : List.List<FeedbackTypes.Feedback>,
  ) : [FeedbackTypes.Feedback] {
    feedbackList.toArray();
  };

  public func hasSubmittedFeedback(
    feedbackList : List.List<FeedbackTypes.Feedback>,
    userId : CommonTypes.UserId,
    eventId : CommonTypes.EventId,
  ) : Bool {
    switch (
      feedbackList.find(func(f) {
        Principal.equal(f.userId, userId) and f.eventId == eventId
      })
    ) {
      case (?_) { true };
      case null { false };
    };
  };

  public func deleteFeedback(
    feedbackList : List.List<FeedbackTypes.Feedback>,
    feedbackId : CommonTypes.FeedbackId,
  ) : Bool {
    let sizeBefore = feedbackList.size();
    let filtered = feedbackList.filter(func(f) { f.id != feedbackId });
    let sizeAfter = filtered.size();
    if (sizeAfter < sizeBefore) {
      feedbackList.clear();
      feedbackList.append(filtered);
      true;
    } else {
      false;
    };
  };

  public func getAverageRatingsByEvent(
    feedbackList : List.List<FeedbackTypes.Feedback>,
    events : List.List<EventTypes.Event>,
  ) : [FeedbackTypes.AverageRatingByEvent] {
    // Build a map of eventId -> (totalRating, count)
    let sumMap = Map.empty<CommonTypes.EventId, Nat>();
    let cntMap = Map.empty<CommonTypes.EventId, Nat>();
    feedbackList.forEach(func(f) {
      let s = switch (sumMap.get(f.eventId)) { case (?v) v; case null 0 };
      let c = switch (cntMap.get(f.eventId)) { case (?v) v; case null 0 };
      sumMap.add(f.eventId, s + f.rating);
      cntMap.add(f.eventId, c + 1);
    });

    let result = List.empty<FeedbackTypes.AverageRatingByEvent>();
    events.forEach(func(e) {
      switch (cntMap.get(e.id)) {
        case (?cnt) {
          let total = switch (sumMap.get(e.id)) { case (?v) v; case null 0 };
          let avg : Float = if (cnt == 0) 0.0 else total.toFloat() / cnt.toFloat();
          result.add({
            eventId = e.id;
            eventName = e.name;
            averageRating = avg;
            totalFeedback = cnt;
          });
        };
        case null {};
      };
    });
    result.toArray();
  };
};
