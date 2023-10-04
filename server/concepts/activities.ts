import { Filter, ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotAllowedError, NotFoundError } from "./errors";

export interface ActivityOptions {
  location?: ObjectId;
}

export interface ActivityDoc extends BaseDoc {
  name: string;
  location: ObjectId;
  members: Array<ObjectId>;
  creator: ObjectId;
  managers: Array<ObjectId>;
  options: ActivityOptions;
}

export default class ActivityConcept {
  public readonly activities = new DocCollection<ActivityDoc>("activities");

  async create(creator: ObjectId, name: string, options?: ActivityOptions) {
    await this.canCreate(name);
    const _id = await this.activities.createOne({ creator, name, options });
    await this.activities.updateOne({ _id }, { managers: [creator] });
    return { msg: `Activity '${name}' was successfully created!`, activity: await this.activities.readOne({ _id }) };
  }

  async getActivities(query: Filter<ActivityDoc>) {
    const activities = await this.activities.readMany(query, {
      sort: { dateUpdated: -1 },
    });
    return activities;
  }

  async getActivityByName(name: string) {
    const activity = await this.activities.readOne({ name });
    if (activity === null) {
      throw new NotFoundError(`Activity with the name "${name}" was not found!`);
    }
    return { msg: `Retrieved the activity "${name}"!`, activity: activity };
    // return this.sanitizeActivity(activity);
  }

  async getByCreator(creator: ObjectId) {
    return await this.getActivities({ creator });
  }

  async update(_id: ObjectId, update: Partial<ActivityDoc>) {
    this.sanitizeUpdate(update);
    await this.activities.updateOne({ _id }, update);
    return { msg: "Activity successfully updated!" };
  }

  async delete(_id: ObjectId, user: ObjectId) {
    await this.isCreator(_id, user);
    await this.activities.deleteOne({ _id });
    return { msg: "Activity deleted successfully!" };
  }

  async isCreator(_id: ObjectId, user: ObjectId) {
    const activity = await this.activities.readOne({ _id });
    if (!activity) {
      throw new NotFoundError(`Activity ${_id} does not exist!`);
    }
    if (activity.creator.toString() !== user.toString()) {
    // if (activity.creator.id !== user.id) {
    // if (activity.creator !== user) {
      console.log(activity, activity.creator, user, user.id);
      throw new ActivityCreatorNotMatchError(user, _id);
    }
  }

  // TODO: IMPLEMENT isManager

  // private sanitizeActivity(user: ActivityDoc) {
  //   // eslint-disable-next-line
  //   const { password, ...rest } = user; // remove password
  //   return rest;
  // }

  private sanitizeUpdate(update: Partial<ActivityDoc>) {
    // Make sure the update cannot change the author.
    const allowedUpdates = ["content", "options"];
    for (const key in update) {
      if (!allowedUpdates.includes(key)) {
        throw new NotAllowedError(`Cannot update '${key}' field!`);
      }
    }
  }

  private async canCreate(name: string) {
    if (!name) {
      throw new BadValuesError("The Activity must be named something (it must be non-empty)!");
    }
    await this.isNameUnique(name);
  }

  private async isNameUnique(name: string) {
    if (await this.activities.readOne({ name })) {
      throw new NotAllowedError(`User with username ${name} already exists!`);
    }
  }
}

export class ActivityCreatorNotMatchError extends NotAllowedError {
  constructor(
    public readonly creator: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the creator of activity {1}!", creator, _id);
  }
}
