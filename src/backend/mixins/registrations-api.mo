import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import RegistrationLib "../lib/registrations";
import FeedbackLib "../lib/feedback";
import EventLib "../lib/events";
import CommonTypes "../types/common";
import RegistrationTypes "../types/registrations";
import FeedbackTypes "../types/feedback";
import EventTypes "../types/events";

mixin (
  accessControlState : AccessControl.AccessControlState,
  registrations : List.List<RegistrationTypes.Registration>,
  events : List.List<EventTypes.Event>,
  nextRegistrationId : { var value : Nat },
  feedbackList : List.List<FeedbackTypes.Feedback>,
) {
  public shared ({ caller }) func registerForEvent(eventId : CommonTypes.EventId) : async RegistrationTypes.Registration {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    // Check event exists and has capacity
    let event = switch (EventLib.getEvent(events, eventId)) {
      case (?e) { e };
      case null { Runtime.trap("Event not found") };
    };
    if (event.registrationCount >= event.capacity) {
      Runtime.trap("Event is at full capacity");
    };
    if (RegistrationLib.isAlreadyRegistered(registrations, caller, eventId)) {
      Runtime.trap("Already registered for this event");
    };
    let id = nextRegistrationId.value;
    nextRegistrationId.value += 1;
    let reg = RegistrationLib.registerForEvent(registrations, id, caller, eventId, Time.now());
    ignore EventLib.incrementRegistrationCount(events, eventId);
    reg;
  };

  public shared ({ caller }) func cancelRegistration(registrationId : CommonTypes.RegistrationId) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    // Find registration to get eventId before cancelling
    let reg = switch (registrations.find(func(r) { r.id == registrationId })) {
      case (?r) { r };
      case null { Runtime.trap("Registration not found") };
    };
    let cancelled = RegistrationLib.cancelRegistration(registrations, caller, registrationId);
    if (cancelled) {
      ignore EventLib.decrementRegistrationCount(events, reg.eventId);
    };
    cancelled;
  };

  public query ({ caller }) func listRegistrations() : async [RegistrationTypes.Registration] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin only");
    };
    registrations.toArray();
  };

  public query ({ caller }) func getRegistration(registrationId : CommonTypes.RegistrationId) : async ?RegistrationTypes.Registration {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    registrations.find(func(r) { r.id == registrationId });
  };

  public query ({ caller }) func listRegistrationsByUser() : async [RegistrationTypes.Registration] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    RegistrationLib.getMyRegistrations(registrations, caller);
  };

  public query ({ caller }) func listRegistrationsByEvent(eventId : CommonTypes.EventId) : async [RegistrationTypes.Registration] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin only");
    };
    RegistrationLib.getRegistrationsByEvent(registrations, eventId);
  };

  public query ({ caller }) func getAnalytics() : async RegistrationTypes.AnalyticsResult {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin only");
    };
    {
      registrationsPerEvent = RegistrationLib.getRegistrationsPerEvent(registrations, events);
      registrationsPerCategory = RegistrationLib.getRegistrationsPerCategory(registrations, events);
      registrationsPerMonth = RegistrationLib.getRegistrationsPerMonth(registrations);
      averageRatingsByEvent = FeedbackLib.getAverageRatingsByEvent(feedbackList, events);
    };
  };
};
