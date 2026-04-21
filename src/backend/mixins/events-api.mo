import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import EventLib "../lib/events";
import CommonTypes "../types/common";
import EventTypes "../types/events";

mixin (
  accessControlState : AccessControl.AccessControlState,
  events : List.List<EventTypes.Event>,
  nextEventId : { var value : Nat },
) {
  public query func listEvents() : async [EventTypes.Event] {
    EventLib.listEvents(events);
  };

  public query func getEvent(eventId : CommonTypes.EventId) : async ?EventTypes.Event {
    EventLib.getEvent(events, eventId);
  };

  public shared ({ caller }) func createEvent(req : EventTypes.CreateEventRequest) : async EventTypes.Event {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin only");
    };
    let id = nextEventId.value;
    nextEventId.value += 1;
    EventLib.createEvent(events, id, caller, req, Time.now());
  };

  public shared ({ caller }) func updateEvent(req : EventTypes.UpdateEventRequest) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin only");
    };
    EventLib.updateEvent(events, req);
  };

  public shared ({ caller }) func deleteEvent(eventId : CommonTypes.EventId) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin only");
    };
    EventLib.deleteEvent(events, eventId);
  };
};
