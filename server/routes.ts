import { ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { Friend, Post, User, WebSession, Location, Activity } from "./app";
import { PostDoc, PostOptions } from "./concepts/post";
import { UserDoc } from "./concepts/user";
import { WebSessionDoc } from "./concepts/websession";
import { LocationDoc } from "./concepts/location";
import { ActivityDoc, ActivityOptions } from "./concepts/activity_group";

import Responses from "./responses";

class Routes {
  @Router.get("/session")
  async getSessionUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.getUserById(user);
  }

  //// USERS ////

  @Router.get("/users")
  async getUsers() {
    return await User.getUsers();
  }

  @Router.get("/users/:username")
  async getUser(username: string) {
    return await User.getUserByUsername(username);
  }

  @Router.post("/users")
  async createUser(session: WebSessionDoc, username: string, password: string) {
    WebSession.isLoggedOut(session);
    return await User.create(username, password);
  }

  @Router.patch("/users")
  async updateUser(session: WebSessionDoc, update: Partial<UserDoc>) {
    const user = WebSession.getUser(session);
    return await User.update(user, update);
  }

  @Router.delete("/users")
  async deleteUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    WebSession.end(session);
    return await User.delete(user);
  }

  @Router.post("/login")
  async logIn(session: WebSessionDoc, username: string, password: string) {
    const u = await User.authenticate(username, password);
    WebSession.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: WebSessionDoc) {
    WebSession.end(session);
    return { msg: "Logged out!" };
  }

  //// POSTS ////

  @Router.get("/posts")
  async getPosts(author?: string) {
    let posts;
    if (author) {
      const id = (await User.getUserByUsername(author))._id;
      posts = await Post.getByAuthor(id);
    } else {
      posts = await Post.getPosts({});
    }
    return Responses.posts(posts);
  }

  @Router.post("/posts")
  async createPost(session: WebSessionDoc, content: string, options?: PostOptions) {
    const user = WebSession.getUser(session);
    const created = await Post.create(user, content, options);
    return { msg: created.msg, post: await Responses.post(created.post) };
  }

  @Router.patch("/posts/:_id")
  async updatePost(session: WebSessionDoc, _id: ObjectId, update: Partial<PostDoc>) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return await Post.update(_id, update);
  }

  @Router.delete("/posts/:_id")
  async deletePost(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return Post.delete(_id);
  }

  //// FRIENDS ////

  @Router.get("/friends")
  async getFriends(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.idsToUsernames(await Friend.getFriends(user));
  }

  @Router.delete("/friends/:friend")
  async removeFriend(session: WebSessionDoc, friend: string) {
    const user = WebSession.getUser(session);
    const friendId = (await User.getUserByUsername(friend))._id;
    return await Friend.removeFriend(user, friendId);
  }

  @Router.get("/friend/requests")
  async getRequests(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Responses.friendRequests(await Friend.getRequests(user));
  }

  @Router.post("/friend/requests/:to")
  async sendFriendRequest(session: WebSessionDoc, to: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;
    return await Friend.sendRequest(user, toId);
  }

  @Router.delete("/friend/requests/:to")
  async removeFriendRequest(session: WebSessionDoc, to: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;
    return await Friend.removeRequest(user, toId);
  }

  @Router.put("/friend/accept/:from")
  async acceptFriendRequest(session: WebSessionDoc, from: string) {
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    return await Friend.acceptRequest(fromId, user);
  }

  @Router.put("/friend/reject/:from")
  async rejectFriendRequest(session: WebSessionDoc, from: string) {
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    return await Friend.rejectRequest(fromId, user);
  }

  //// LOCATIONS ////

  @Router.get("/locations")
  async getLocations() {
    return await Location.getLocations();
  }

  @Router.post("/locations")
  async createLocation(street: string, city: string, state: string, country: string, zip_code: number) {
    return await Location.create(street, city, state, country, zip_code);
  }

  @Router.get("/locations/:zip_code")
  async getLocationsInZipCode(session: WebSessionDoc, zip_code: number) {
    // const user = WebSession.getUser(session);
    // await Location.isAuthor(user, _id);
    return Location.getLocationsInZipCode(zip_code);
  }

  @Router.delete("/locations/:_id")
  async deleteLocation(session: WebSessionDoc, _id: ObjectId) {
    // const user = WebSession.getUser(session);
    // await Location.isAuthor(user, _id);
    return Location.delete(_id);
  }

  //// ACTIVITIES ////

  @Router.get("/activities")
  async getActivities(creator?: string) {
    let activities;
    if (creator) {
      const id = (await User.getUserByUsername(creator))._id;
      activities = await Activity.getByCreator(id);
    } else {
      activities = await Activity.getActivities({});
    }
    return activities;
  }

  @Router.post("/activities/:name")
  async getActivityByName(name: string) {
    const activity = await Activity.getActivityByName(name);
    return { msg: activity.msg, activity: activity };
  }

  @Router.post("/activities")
  async createActivity(session: WebSessionDoc, name: string, options?: ActivityOptions) {
    const user = WebSession.getUser(session);
    const activity = await Activity.create(user, name, options);
    return { msg: activity.msg, activity: activity };
  }

  @Router.patch("/activities/:_id")
  async updateActivity(session: WebSessionDoc, _id: ObjectId, update: Partial<ActivityDoc>) {
    const user = WebSession.getUser(session);
    await Activity.isCreator(_id, user);
    return await Activity.update(_id, update);
  }

  @Router.delete("/activities/:_id")
  async deleteActivity(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    return Activity.delete(_id, user);  // CHANGE THIS TO ISMANAGER
  }
}

export default getExpressRouter(new Routes());
