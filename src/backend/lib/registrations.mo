import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import CommonTypes "../types/common";
import RegistrationTypes "../types/registrations";
import EventTypes "../types/events";

module {
  public func registerForEvent(
    registrations : List.List<RegistrationTypes.Registration>,
    nextId : Nat,
    userId : CommonTypes.UserId,
    eventId : CommonTypes.EventId,
    now : CommonTypes.Timestamp,
  ) : RegistrationTypes.Registration {
    let reg : RegistrationTypes.Registration = {
      id = nextId;
      userId = userId;
      eventId = eventId;
      registrationDate = now;
      status = #registered;
    };
    registrations.add(reg);
    reg;
  };

  public func cancelRegistration(
    registrations : List.List<RegistrationTypes.Registration>,
    userId : CommonTypes.UserId,
    registrationId : CommonTypes.RegistrationId,
  ) : Bool {
    var found = false;
    registrations.mapInPlace(
      func(r) {
        if (r.id == registrationId and Principal.equal(r.userId, userId)) {
          found := true;
          { r with status = #cancelled };
        } else { r };
      }
    );
    found;
  };

  public func getMyRegistrations(
    registrations : List.List<RegistrationTypes.Registration>,
    userId : CommonTypes.UserId,
  ) : [RegistrationTypes.Registration] {
    registrations.filter(func(r) { Principal.equal(r.userId, userId) }).toArray();
  };

  public func getRegistrationsByEvent(
    registrations : List.List<RegistrationTypes.Registration>,
    eventId : CommonTypes.EventId,
  ) : [RegistrationTypes.Registration] {
    registrations.filter(func(r) { r.eventId == eventId }).toArray();
  };

  public func isAlreadyRegistered(
    registrations : List.List<RegistrationTypes.Registration>,
    userId : CommonTypes.UserId,
    eventId : CommonTypes.EventId,
  ) : Bool {
    switch (
      registrations.find(func(r) {
        Principal.equal(r.userId, userId) and r.eventId == eventId and r.status == #registered
      })
    ) {
      case (?_) { true };
      case null { false };
    };
  };

  public func getRegistrationsPerEvent(
    registrations : List.List<RegistrationTypes.Registration>,
    events : List.List<EventTypes.Event>,
  ) : [RegistrationTypes.RegistrationsPerEvent] {
    let countMap = Map.empty<CommonTypes.EventId, Nat>();
    registrations.forEach(func(r) {
      if (r.status == #registered) {
        let current = switch (countMap.get(r.eventId)) {
          case (?c) { c };
          case null { 0 };
        };
        countMap.add(r.eventId, current + 1);
      };
    });

    let result = List.empty<RegistrationTypes.RegistrationsPerEvent>();
    events.forEach(func(e) {
      let count = switch (countMap.get(e.id)) {
        case (?c) { c };
        case null { 0 };
      };
      result.add({ eventId = e.id; eventName = e.name; count = count });
    });
    result.toArray();
  };

  public func getRegistrationsPerCategory(
    registrations : List.List<RegistrationTypes.Registration>,
    events : List.List<EventTypes.Event>,
  ) : [RegistrationTypes.RegistrationsPerCategory] {
    let countMap = Map.empty<Text, Nat>();
    registrations.forEach(func(r) {
      if (r.status == #registered) {
        switch (events.find(func(e) { e.id == r.eventId })) {
          case (?e) {
            let cat = categoryToText(e.category);
            let current = switch (countMap.get(cat)) {
              case (?c) { c };
              case null { 0 };
            };
            countMap.add(cat, current + 1);
          };
          case null {};
        };
      };
    });

    let result = List.empty<RegistrationTypes.RegistrationsPerCategory>();
    for ((cat, count) in countMap.entries()) {
      result.add({ category = cat; count = count });
    };
    result.toArray();
  };

  public func getRegistrationsPerMonth(
    registrations : List.List<RegistrationTypes.Registration>,
  ) : [RegistrationTypes.RegistrationsPerMonth] {
    let countMap = Map.empty<Text, Nat>();
    registrations.forEach(func(r) {
      if (r.status == #registered) {
        // Convert nanoseconds timestamp to month string "YYYY-MM"
        let seconds = r.registrationDate / 1_000_000_000;
        let monthKey = timestampToMonthKey(seconds);
        let current = switch (countMap.get(monthKey)) {
          case (?c) { c };
          case null { 0 };
        };
        countMap.add(monthKey, current + 1);
      };
    });

    let result = List.empty<RegistrationTypes.RegistrationsPerMonth>();
    for ((month, count) in countMap.entries()) {
      result.add({ month = month; count = count });
    };
    result.toArray();
  };

  // Helper: convert EventCategory variant to Text
  private func categoryToText(cat : EventTypes.EventCategory) : Text {
    switch (cat) {
      case (#academic) { "academic" };
      case (#cultural) { "cultural" };
      case (#sports) { "sports" };
      case (#technical) { "technical" };
      case (#social) { "social" };
      case (#other) { "other" };
    };
  };

  // Helper: derive "YYYY-MM" from Unix epoch seconds (Int)
  private func timestampToMonthKey(seconds : Int) : Text {
    // Days since epoch
    let days = seconds / 86400;
    // Approximate year/month using Julian Day Number approach
    let z = days + 719468;
    let era = (if (z >= 0) z else z - 146096) / 146097;
    let doe = z - era * 146097;
    let yoe = (doe - doe / 1460 + doe / 36524 - doe / 146096) / 365;
    let y = yoe + era * 400;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp = (5 * doy + 2) / 153;
    let m = mp + (if (mp < 10) 3 else -9);
    let yearFinal = y + (if (m <= 2) 1 else 0);
    let mm = if (m < 10) "0" # m.toText() else m.toText();
    yearFinal.toText() # "-" # mm;
  };
};
