import test, { afterEach } from "node:test";
import assert from "node:assert/strict";

import CaseStatus from "../models/CaseStatus.js";
import Report from "../models/Report.js";
import ReportStatusHistory from "../models/ReportStatusHistory.js";
import SupportArticle from "../models/SupportArticle.js";
import {
  createReportService,
  updateReportStatusService,
  getResponsesByReportService,
} from "../services/reportService.js";
import {
  getSingleArticleService,
  getAllArticlesService,
} from "../services/supportArticleService.js";

const origCaseFindOne = CaseStatus.findOne;
const origReportCreate = Report.create;
const origReportFindById = Report.findById;
const origReportFind = Report.find;
const origHistoryCreate = ReportStatusHistory.create;
const origArticleFind = SupportArticle.find;
const origArticleFindByIdAndUpdate = SupportArticle.findByIdAndUpdate;

function restoreReportSupportMocks() {
  CaseStatus.findOne = origCaseFindOne;
  Report.create = origReportCreate;
  Report.findById = origReportFindById;
  Report.find = origReportFind;
  ReportStatusHistory.create = origHistoryCreate;
  SupportArticle.find = origArticleFind;
  SupportArticle.findByIdAndUpdate = origArticleFindByIdAndUpdate;
}

afterEach(() => {
  restoreReportSupportMocks();
});

test("createReportService throws when Pending status is missing", async () => {
  CaseStatus.findOne = async () => null;

  const req = {
    body: {
      title: "Issue",
      description: "Details",
      categoryId: "507f1f77bcf86cd799439011",
      isAnonymous: "false",
    },
    user: { _id: "507f1f77bcf86cd799439012" },
  };

  await assert.rejects(() => createReportService(req), /default status not found/i);
});

test("createReportService creates report with Pending statusId", async () => {
  const pendingId = "507f1f77bcf86cd799439099";
  CaseStatus.findOne = async () => ({ _id: pendingId });

  let createdPayload;
  Report.create = async (doc) => {
    createdPayload = doc;
    return { _id: "new-report", ...doc };
  };

  const req = {
    body: {
      title: "Harassment case",
      description: "Occurred in lab",
      categoryId: "507f1f77bcf86cd799439011",
      isAnonymous: "false",
      location: "Block A",
      incidentDate: new Date().toISOString(),
      priority: "High",
    },
    user: { _id: "507f1f77bcf86cd799439012" },
  };

  const report = await createReportService(req);

  assert.equal(createdPayload.title, "Harassment case");
  assert.equal(createdPayload.statusId.toString(), pendingId);
  assert.equal(createdPayload.reportedBy.toString(), req.user._id.toString());
  assert.equal(report.title, "Harassment case");
});

test("createReportService sets anonymous report with null reportedBy", async () => {
  CaseStatus.findOne = async () => ({ _id: "507f1f77bcf86cd799439099" });

  let createdPayload;
  Report.create = async (doc) => {
    createdPayload = doc;
    return doc;
  };

  const req = {
    body: {
      title: "Anonymous tip",
      description: "Details",
      categoryId: "507f1f77bcf86cd799439011",
      isAnonymous: "true",
    },
    user: { _id: "507f1f77bcf86cd799439012" },
  };

  await createReportService(req);

  assert.equal(createdPayload.isAnonymous, true);
  assert.equal(createdPayload.reportedBy, null);
});

test("updateReportStatusService throws when report not found", async () => {
  Report.findById = async () => null;

  await assert.rejects(
    () =>
      updateReportStatusService(
        "507f1f77bcf86cd799439011",
        "507f1f77bcf86cd799439012",
        "507f1f77bcf86cd799439013",
      ),
    /report not found/i,
  );
});

test("updateReportStatusService throws when report is closed", async () => {
  Report.findById = async () => ({
    _id: "r1",
    isClosed: true,
    save: async () => {},
  });

  await assert.rejects(
    () =>
      updateReportStatusService(
        "507f1f77bcf86cd799439011",
        "507f1f77bcf86cd799439012",
        "507f1f77bcf86cd799439013",
      ),
    /closed report/i,
  );
});

test("updateReportStatusService updates status and records history", async () => {
  const newStatusId = "507f1f77bcf86cd799439020";
  const adminId = "507f1f77bcf86cd799439021";
  const reportId = "507f1f77bcf86cd799439022";

  const report = {
    _id: reportId,
    isClosed: false,
    statusId: null,
    async save() {},
    populate() {
      return Promise.resolve(this);
    },
  };

  Report.findById = async () => report;

  let historyPayload;
  ReportStatusHistory.create = async (doc) => {
    historyPayload = doc;
    return doc;
  };

  await updateReportStatusService(reportId, adminId, newStatusId);

  assert.equal(report.statusId, newStatusId);
  assert.equal(historyPayload.reportId, reportId);
  assert.equal(historyPayload.statusId, newStatusId);
  assert.equal(historyPayload.updatedBy, adminId);
});

test("getResponsesByReportService rejects non-owner when not admin", async () => {
  const ownerId = "507f1f77bcf86cd799439030";
  const otherUserId = "507f1f77bcf86cd799439031";

  Report.findById = async () => ({
    _id: "rep1",
    reportedBy: { toString: () => ownerId },
  });

  await assert.rejects(
    () => getResponsesByReportService("rep1", otherUserId, false),
    /not authorized/i,
  );
});

test("getSingleArticleService throws when article missing", async () => {
  SupportArticle.findByIdAndUpdate = () => ({
    populate() {
      return Promise.resolve(null);
    },
  });

  await assert.rejects(
    () => getSingleArticleService("507f1f77bcf86cd799439011"),
    /article not found/i,
  );
});

test("getAllArticlesService filters by category when provided", async () => {
  let filterUsed;

  SupportArticle.find = (filter) => {
    filterUsed = filter;
    return {
      populate() {
        return {
          sort() {
            return Promise.resolve([]);
          },
        };
      },
    };
  };

  await getAllArticlesService({ category: "FAQ", search: "" });

  assert.equal(filterUsed.category, "FAQ");
  assert.equal(filterUsed.isPublished, true);
});
