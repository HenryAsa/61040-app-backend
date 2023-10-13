import { Filter, ObjectId } from "mongodb";

import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotAllowedError, NotFoundError } from "./errors";

export interface CarpoolOptions {
  location?: ObjectId;
}

export interface CarpoolDoc extends BaseDoc {
  name: string;
  target: ObjectId;
  members: Array<ObjectId>;
  driver: ObjectId;
  options: CarpoolOptions;
}

export default class CarpoolConcept {
  public readonly carpools = new DocCollection<CarpoolDoc>("carpools");

  async create(driver: ObjectId, name: string, target: ObjectId, options?: CarpoolOptions) {
    await this.canCreate(name);
    const _id = await this.carpools.createOne({ driver: driver, name: name, target: target, options: options });
    return { msg: `Carpool '${name}' was successfully created!`, carpool: await this.carpools.readOne({ _id }) };
  }

  async getCarpools(query: Filter<CarpoolDoc>) {
    const carpools = await this.carpools.readMany(query, {
      sort: { dateUpdated: -1 },
    });
    return carpools;
  }

  async getCarpoolsByName(name: string) {
    const carpool = await this.carpools.readMany({ name: name });
    if (carpool === null) {
      throw new NotFoundError(`Carpool with the name '${name}' was not found!`);
    }
    return { msg: `Retrieved the carpool '${name}'!`, carpool: carpool };
    // return this.sanitizeCarpool(carpool);
  }

  async getCarpoolsInTargetId(target: ObjectId) {
    return await this.getCarpools({ target: target });
  }

  async getCarpoolsByDriver(driver: ObjectId) {
    return await this.getCarpools({ drive: driver });
  }

  async update(_id: ObjectId, update: Partial<CarpoolDoc>) {
    this.sanitizeUpdate(update);
    await this.carpools.updateOne({ _id }, update);
    return { msg: "Carpool successfully updated!" };
  }

  async delete(_id: ObjectId, user: ObjectId) {
    try {
      await this.isDriver(_id, user);
    } catch (error) {
      await this.isMember(_id, user);
    }
    await this.carpools.deleteOne({ _id });
    return { msg: "Carpool deleted successfully!" };
  }

  async isDriver(_id: ObjectId, user: ObjectId) {
    const carpool = await this.carpools.readOne({ _id });
    if (!carpool) {
      throw new NotFoundError(`Carpool '${_id}' does not exist!`);
    }
    if (carpool.driver.toString() !== user.toString()) {
      // if (carpool.creator.id !== user.id) {
      // if (carpool.creator !== user) {
      console.log(carpool, carpool.driver, user, user.id);
      throw new CarpoolDriverNotMatchError(user, _id);
    }
  }

  async isMember(_id: ObjectId, user: ObjectId) {
    const carpool = await this.carpools.readOne({ _id });
    if (!carpool) {
      throw new NotFoundError(`Carpool '${_id}' does not exist!`);
    }
    if (!carpool.members.includes(user)) {
      // if (carpool.creator.id !== user.id) {
      // if (carpool.creator !== user) {
      console.log(carpool, carpool.driver, user, user.id);
      throw new CarpoolMemberNotMatchError(user, _id);
    }
  }

  private sanitizeUpdate(update: Partial<CarpoolDoc>) {
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
      throw new BadValuesError("The Carpool must be named something (it must be non-empty)!");
    }
    await this.isNameUnique(name);
  }

  private async isNameUnique(name: string) {
    if (await this.carpools.readOne({ name })) {
      throw new NotAllowedError(`Carpool with the name '${name}' already exists!`);
    }
  }
}

export class CarpoolDriverNotMatchError extends NotAllowedError {
  constructor(
    public readonly driver: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the driver of carpool {1}!", driver, _id);
  }
}

export class CarpoolMemberNotMatchError extends NotAllowedError {
  constructor(
    public readonly member: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the member of carpool {1}!", member, _id);
  }
}
