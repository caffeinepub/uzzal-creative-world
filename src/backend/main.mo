import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Order "mo:core/Order";

actor {
  type AppearanceSettings = {
    theme : Text;
    fontSize : Nat;
    colorScheme : Text;
  };

  type BookmarkSettings = {
    bookmarksBarVisible : Bool;
    defaultBookmarkFolder : Text;
  };

  type SearchPreferences = {
    defaultSearchEngine : Text;
    safeSearchEnabled : Bool;
  };

  type PrivacySettings = {
    doNotTrack : Bool;
    cookiePreferences : Text;
  };

  type NotificationPreferences = {
    notificationsEnabled : Bool;
    notificationSound : Text;
  };

  type AdvancedSettings = {
    hardwareAcceleration : Bool;
    proxySettings : Text;
  };

  type Profile = {
    displayName : Text;
    appearance : AppearanceSettings;
    bookmarks : BookmarkSettings;
    search : SearchPreferences;
    privacy : PrivacySettings;
    notifications : NotificationPreferences;
    advanced : AdvancedSettings;
  };

  module Profile {
    public func compare(p1 : Profile, p2 : Profile) : Order.Order {
      Text.compare(p1.displayName, p2.displayName);
    };
  };

  let profiles = Map.empty<Principal, Profile>();

  public shared ({ caller }) func saveSettings(profile : Profile) : async () {
    profiles.add(caller, profile);
  };

  public query ({ caller }) func getSettings() : async Profile {
    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("No settings found for user.") };
      case (?profile) { profile };
    };
  };

  public query ({ caller }) func isRegistered() : async Bool {
    profiles.containsKey(caller);
  };

  public query func getAllProfiles() : async [Profile] {
    profiles.values().toArray().sort();
  };
};
