import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import UserLib "../lib/users";
import CommonTypes "../types/common";
import UserTypes "../types/users";

mixin (
  accessControlState : AccessControl.AccessControlState,
  userProfiles : Map.Map<Principal, UserTypes.UserProfile>,
) {
  public query ({ caller }) func getCallerUserProfile() : async ?UserTypes.UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    UserLib.getProfile(userProfiles, caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserTypes.UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    UserLib.saveProfile(userProfiles, caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserTypes.UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    UserLib.getProfile(userProfiles, user);
  };

  // Alias for getUserProfile to satisfy contract
  public query ({ caller }) func getProfile(user : Principal) : async ?UserTypes.UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    UserLib.getProfile(userProfiles, user);
  };

  // Update caller's own profile
  public shared ({ caller }) func updateProfile(profile : UserTypes.UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    UserLib.saveProfile(userProfiles, caller, profile);
  };

  public query ({ caller }) func listUsers() : async [(CommonTypes.UserId, UserTypes.UserProfile)] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin only");
    };
    UserLib.listUsers(userProfiles);
  };
};
