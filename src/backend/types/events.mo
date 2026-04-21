import Common "common";

module {
  public type EventCategory = {
    #academic;
    #cultural;
    #sports;
    #technical;
    #social;
    #other;
  };

  public type Event = {
    id : Common.EventId;
    name : Text;
    date : Text;
    time : Text;
    location : Text;
    department : Text;
    category : EventCategory;
    description : Text;
    capacity : Nat;
    registrationCount : Nat;
    createdBy : Common.UserId;
    createdAt : Common.Timestamp;
  };

  public type CreateEventRequest = {
    name : Text;
    date : Text;
    time : Text;
    location : Text;
    department : Text;
    category : EventCategory;
    description : Text;
    capacity : Nat;
  };

  public type UpdateEventRequest = {
    id : Common.EventId;
    name : Text;
    date : Text;
    time : Text;
    location : Text;
    department : Text;
    category : EventCategory;
    description : Text;
    capacity : Nat;
  };
};
