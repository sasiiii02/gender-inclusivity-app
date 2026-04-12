import test, { afterEach } from "node:test";
import assert from "node:assert/strict";

import EEvent from "../models/EEvent.js";
import ECampaign from "../models/ECampaign.js";
import * as eventService from "../services/eEventService.js";
import * as campaignService from "../services/eCampaignService.js";

const origEventFind = EEvent.find;
const origEventCount = EEvent.countDocuments;
const origEventFindOne = EEvent.findOne;
const origEventFindOneAndUpdate = EEvent.findOneAndUpdate;
const origEventFindByIdAndUpdate = EEvent.findByIdAndUpdate;
const origEventSave = EEvent.prototype.save;

const origCampaignFind = ECampaign.find;
const origCampaignCount = ECampaign.countDocuments;
const origCampaignFindById = ECampaign.findById;
const origCampaignFindByIdAndUpdate = ECampaign.findByIdAndUpdate;

function restoreEventMocks() {
  EEvent.find = origEventFind;
  EEvent.countDocuments = origEventCount;
  EEvent.findOne = origEventFindOne;
  EEvent.findOneAndUpdate = origEventFindOneAndUpdate;
  EEvent.findByIdAndUpdate = origEventFindByIdAndUpdate;
  EEvent.prototype.save = origEventSave;
}

function restoreCampaignMocks() {
  ECampaign.find = origCampaignFind;
  ECampaign.countDocuments = origCampaignCount;
  ECampaign.findById = origCampaignFindById;
  ECampaign.findByIdAndUpdate = origCampaignFindByIdAndUpdate;
}

afterEach(() => {
  restoreEventMocks();
  restoreCampaignMocks();
});

function queryChain(resolveValue, total = 1) {
  return {
    populate() {
      return this;
    },
    skip() {
      return this;
    },
    limit() {
      return this;
    },
    sort() {
      return Promise.resolve(resolveValue);
    },
  };
}

test("createEvent persists event data via save", async () => {
  let savedDoc;
  EEvent.prototype.save = async function saveMock() {
    savedDoc = { title: this.title, eventType: this.eventType };
    return savedDoc;
  };

  const payload = { title: "Workshop A", eventType: "Workshop" };
  const result = await eventService.createEvent(payload);

  assert.equal(savedDoc.title, "Workshop A");
  assert.equal(result.title, "Workshop A");
});

test("getEvents applies campaignId filter and returns pagination", async () => {
  const campaignId = "507f1f77bcf86cd799439011";
  let findFilter;

  EEvent.find = (filter) => {
    findFilter = filter;
    return queryChain([{ title: "E1" }], 5);
  };
  EEvent.countDocuments = async (filter) => {
    assert.equal(filter.campaignId.toString(), campaignId);
    assert.equal(filter.isDeleted, false);
    return 5;
  };

  const { events, pagination } = await eventService.getEvents({
    campaignId,
    page: 1,
    limit: 10,
  });

  assert.equal(findFilter.campaignId.toString(), campaignId);
  assert.equal(events.length, 1);
  assert.equal(pagination.total, 5);
  assert.equal(pagination.page, 1);
});

test("softDeleteEvent sets isDeleted true", async () => {
  let updatePayload;
  EEvent.findByIdAndUpdate = async (_id, payload) => {
    updatePayload = payload;
    return { _id, ...payload };
  };

  const id = "507f1f77bcf86cd799439011";
  const result = await eventService.softDeleteEvent(id);

  assert.equal(updatePayload.isDeleted, true);
  assert.equal(result.isDeleted, true);
});

test("getCampaigns applies search regex on title", async () => {
  let findFilter;

  ECampaign.find = (filter) => {
    findFilter = filter;
    return queryChain([], 0);
  };
  ECampaign.countDocuments = async () => 0;

  await campaignService.getCampaigns({ search: "awareness", page: 1, limit: 10 });

  assert.ok(findFilter.title);
  assert.equal(findFilter.title.$options, "i");
  assert.equal(findFilter.title.$regex, "awareness");
});

test("archiveCampaign sets status to Archived", async () => {
  let statusUpdate;
  ECampaign.findByIdAndUpdate = async (_id, payload) => {
    statusUpdate = payload;
    return { _id, status: payload.status };
  };

  const result = await campaignService.archiveCampaign("507f1f77bcf86cd799439011");

  assert.equal(statusUpdate.status, "Archived");
  assert.equal(result.status, "Archived");
});
