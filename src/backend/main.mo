import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Set "mo:core/Set";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Nat32 "mo:core/Nat32";

actor {
  type MeditationSession = {
    id : Nat32;
    title : Text;
    duration : Nat32;
    description : Text;
    category : Text;
    difficulty : Text;
  };

  type ChatMessage = {
    sender : Text;
    content : Text;
    timestamp : Time.Time;
  };

  type Collectible = {
    id : Nat32;
    name : Text;
    description : Text;
  };

  type Achievement = {
    id : Nat32;
    title : Text;
    description : Text;
  };

  type UserProfile = {
    xp : Nat32;
    streak : Nat32;
    lastSession : Time.Time;
    unlockedCollectibles : Set.Set<Nat32>;
  };

  type UserProfileView = {
    xp : Nat32;
    streak : Nat32;
    lastSession : Time.Time;
    unlockedCollectibles : [Nat32];
  };

  type ProfileContainer = {
    profile : UserProfile;
    chatHistory : [ChatMessage];
    earnedAchievements : Set.Set<Nat32>;
  };

  module MeditationSession {
    public func compare(session1 : MeditationSession, session2 : MeditationSession) : Order.Order {
      Nat32.compare(session1.id, session2.id);
    };
  };

  let meditationSessionsMap = Map.empty<Nat32, MeditationSession>();
  let collectiblesMap = Map.empty<Nat32, Collectible>();
  let achievementsMap = Map.empty<Nat32, Achievement>();

  let userProfiles = Map.empty<Principal, ProfileContainer>();

  func getProfileContainer(caller : Principal) : ProfileContainer {
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found!") };
      case (?profileContainer) { profileContainer };
    };
  };

  public query ({ caller }) func getProfile() : async UserProfileView {
    let userProfile = getProfileContainer(caller).profile;
    {
      xp = userProfile.xp;
      streak = userProfile.streak;
      lastSession = userProfile.lastSession;
      unlockedCollectibles = userProfile.unlockedCollectibles.toArray();
    };
  };

  public type MeditationSessionDTO = {
    id : Nat32;
    title : Text;
    duration : Nat32;
    description : Text;
    category : Text;
    difficulty : Text;
  };

  public query ({ caller }) func getAllMeditationSessions() : async [MeditationSessionDTO] {
    meditationSessionsMap.values().toArray().map(func(session) { session });
  };

  public query ({ caller }) func getCollectibles() : async [Collectible] {
    collectiblesMap.values().toArray().map(func(collectible) { collectible });
  };
};
