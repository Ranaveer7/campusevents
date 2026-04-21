import Map "mo:core/Map";
import Principal "mo:core/Principal";
import CommonTypes "../types/common";
import UserTypes "../types/users";

module {
  public func getProfile(
    profiles : Map.Map<Principal, UserTypes.UserProfile>,
    userId : CommonTypes.UserId,
  ) : ?UserTypes.UserProfile {
    profiles.get(userId);
  };

  public func saveProfile(
    profiles : Map.Map<Principal, UserTypes.UserProfile>,
    userId : CommonTypes.UserId,
    profile : UserTypes.UserProfile,
  ) : () {
    profiles.add(userId, profile);
  };

  public func listUsers(
    profiles : Map.Map<Principal, UserTypes.UserProfile>,
  ) : [(CommonTypes.UserId, UserTypes.UserProfile)] {
    profiles.toArray();
  };
};
