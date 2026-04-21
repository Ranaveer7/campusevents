import List "mo:core/List";
import Principal "mo:core/Principal";
import CommonTypes "../types/common";
import EventTypes "../types/events";

module {
  public func listEvents(
    events : List.List<EventTypes.Event>,
  ) : [EventTypes.Event] {
    events.toArray();
  };

  public func getEvent(
    events : List.List<EventTypes.Event>,
    eventId : CommonTypes.EventId,
  ) : ?EventTypes.Event {
    events.find(func(e) { e.id == eventId });
  };

  public func createEvent(
    events : List.List<EventTypes.Event>,
    nextId : Nat,
    caller : Principal,
    req : EventTypes.CreateEventRequest,
    now : CommonTypes.Timestamp,
  ) : EventTypes.Event {
    let event : EventTypes.Event = {
      id = nextId;
      name = req.name;
      date = req.date;
      time = req.time;
      location = req.location;
      department = req.department;
      category = req.category;
      description = req.description;
      capacity = req.capacity;
      registrationCount = 0;
      createdBy = caller;
      createdAt = now;
    };
    events.add(event);
    event;
  };

  public func updateEvent(
    events : List.List<EventTypes.Event>,
    req : EventTypes.UpdateEventRequest,
  ) : Bool {
    var found = false;
    events.mapInPlace(
      func(e) {
        if (e.id == req.id) {
          found := true;
          {
            e with
            name = req.name;
            date = req.date;
            time = req.time;
            location = req.location;
            department = req.department;
            category = req.category;
            description = req.description;
            capacity = req.capacity;
          };
        } else { e };
      }
    );
    found;
  };

  public func deleteEvent(
    events : List.List<EventTypes.Event>,
    eventId : CommonTypes.EventId,
  ) : Bool {
    let sizeBefore = events.size();
    let filtered = events.filter(func(e) { e.id != eventId });
    let sizeAfter = filtered.size();
    if (sizeAfter < sizeBefore) {
      events.clear();
      events.append(filtered);
      true;
    } else {
      false;
    };
  };

  public func incrementRegistrationCount(
    events : List.List<EventTypes.Event>,
    eventId : CommonTypes.EventId,
  ) : Bool {
    var found = false;
    events.mapInPlace(
      func(e) {
        if (e.id == eventId) {
          found := true;
          { e with registrationCount = e.registrationCount + 1 };
        } else { e };
      }
    );
    found;
  };

  public func decrementRegistrationCount(
    events : List.List<EventTypes.Event>,
    eventId : CommonTypes.EventId,
  ) : Bool {
    var found = false;
    events.mapInPlace(
      func(e) {
        if (e.id == eventId) {
          found := true;
          let newCount : Nat = if (e.registrationCount > 0) e.registrationCount - 1 else 0;
          { e with registrationCount = newCount };
        } else { e };
      }
    );
    found;
  };
};
