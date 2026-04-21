import Common "common";

module {
  public type UserProfile = {
    name : Text;
    email : Text;
    role : Common.UserRole;
    createdAt : Common.Timestamp;
  };
};
