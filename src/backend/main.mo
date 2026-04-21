import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import UserTypes "types/users";
import EventTypes "types/events";
import RegistrationTypes "types/registrations";
import FeedbackTypes "types/feedback";
import UsersMixin "mixins/users-api";
import EventsMixin "mixins/events-api";
import RegistrationsMixin "mixins/registrations-api";
import FeedbackMixin "mixins/feedback-api";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserTypes.UserProfile>();
  include UsersMixin(accessControlState, userProfiles);

  let events = List.empty<EventTypes.Event>();
  let nextEventId = { var value : Nat = 1 };
  include EventsMixin(accessControlState, events, nextEventId);

  let registrations = List.empty<RegistrationTypes.Registration>();
  let nextRegistrationId = { var value : Nat = 1 };

  let feedbackList = List.empty<FeedbackTypes.Feedback>();
  let nextFeedbackId = { var value : Nat = 1 };

  include RegistrationsMixin(accessControlState, registrations, events, nextRegistrationId, feedbackList);
  include FeedbackMixin(accessControlState, feedbackList, events, nextFeedbackId);

  // Seed sample data on init
  do {
    let now = Time.now();
    let systemPrincipal = Principal.fromText("aaaaa-aa");

    // 5 sample events
    let e1 : EventTypes.Event = {
      id = nextEventId.value;
      name = "Annual Tech Symposium 2026";
      date = "2026-05-15";
      time = "09:00";
      location = "Main Auditorium";
      department = "Computer Science";
      category = #technical;
      description = "A full-day symposium featuring talks from industry experts on AI, blockchain, and cloud computing.";
      capacity = 200;
      registrationCount = 0;
      createdBy = systemPrincipal;
      createdAt = now;
    };
    nextEventId.value += 1;
    events.add(e1);

    let e2 : EventTypes.Event = {
      id = nextEventId.value;
      name = "Cultural Night Fiesta";
      date = "2026-04-28";
      time = "18:00";
      location = "Open Air Theatre";
      department = "Cultural Committee";
      category = #cultural;
      description = "An evening of music, dance, and art celebrating the diversity of our campus community.";
      capacity = 500;
      registrationCount = 0;
      createdBy = systemPrincipal;
      createdAt = now;
    };
    nextEventId.value += 1;
    events.add(e2);

    let e3 : EventTypes.Event = {
      id = nextEventId.value;
      name = "Inter-Department Sports Meet";
      date = "2026-05-03";
      time = "08:00";
      location = "Sports Complex";
      department = "Sports Committee";
      category = #sports;
      description = "Annual inter-department sports competition covering cricket, football, basketball, and athletics.";
      capacity = 300;
      registrationCount = 0;
      createdBy = systemPrincipal;
      createdAt = now;
    };
    nextEventId.value += 1;
    events.add(e3);

    let e4 : EventTypes.Event = {
      id = nextEventId.value;
      name = "Research Paper Presentation";
      date = "2026-05-22";
      time = "10:00";
      location = "Seminar Hall A";
      department = "Research Department";
      category = #academic;
      description = "Students and faculty present their latest research findings across all academic disciplines.";
      capacity = 100;
      registrationCount = 0;
      createdBy = systemPrincipal;
      createdAt = now;
    };
    nextEventId.value += 1;
    events.add(e4);

    let e5 : EventTypes.Event = {
      id = nextEventId.value;
      name = "Freshers Welcome Party";
      date = "2026-06-01";
      time = "17:00";
      location = "Student Union Hall";
      department = "Student Affairs";
      category = #social;
      description = "Welcome event for new students joining the campus, with games, networking, and refreshments.";
      capacity = 250;
      registrationCount = 0;
      createdBy = systemPrincipal;
      createdAt = now;
    };
    nextEventId.value += 1;
    events.add(e5);
  };
};
