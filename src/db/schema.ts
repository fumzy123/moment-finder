import { integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const videoScreenshotsMetadata = pgTable("video_screenshots_metadata", {

  screenshotId: uuid("screenshot_id").primaryKey(),
  screenshotFileName: text("screenshot_file_name").notNull(),
  screenshotWidth: integer("screenshot_width").notNull(),
  screenshotHeight: integer("screenshot_height").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  screenshotBucket: text("screenshot_bucket").notNull(),

  videoId: text("video_id").notNull(),
  timestampSeconds: integer("timestamp_seconds").notNull(),
  sourceFrameWidth: integer("source_frame_width"),
  sourceFrameHeight: integer("source_frame_height"),

  captureFrameX: integer("capture_frame_x").notNull(),
  captureFrameY: integer("capture_frame_y").notNull(),
  captureFrameWidth: integer("capture_frame_width").notNull(),
  captureFrameHeight: integer("capture_frame_height").notNull(),
});
