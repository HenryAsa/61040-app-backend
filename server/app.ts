import ActivityConcept from "./concepts/activities";
import FriendConcept from "./concepts/friend";
import LocationConcept from "./concepts/location";
import PostConcept from "./concepts/post";
import UserConcept from "./concepts/user";
import WebSessionConcept from "./concepts/websession";

// App Definition using concepts
export const WebSession = new WebSessionConcept();
export const User = new UserConcept();
export const Post = new PostConcept();
export const Friend = new FriendConcept();

// Newly added concepts
export const Activity = new ActivityConcept();
export const Location = new LocationConcept();
