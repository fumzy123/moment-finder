import { integer, numeric, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const videoScreenshots = pgTable("video_screenshots", {
  screenshotId: uuid("screenshot_id").primaryKey().defaultRandom(),

  videoId: text("video_id")
    .notNull(),

  timestampSeconds: numeric("timestamp_seconds").notNull(),

  rectX: numeric("rect_x").notNull(),
  rectY: numeric("rect_y").notNull(),
  rectWidth: numeric("rect_width").notNull(),
  rectHeight: numeric("rect_height").notNull(),

  outputWidth: integer("output_width").notNull(),
  outputHeight: integer("output_height").notNull(),
  outputFormat: text("output_format").notNull(),

  screenshotBucket: text("screenshot_bucket").notNull(),
  screenshotObjectName: text("screenshot_object_name").notNull(),

  sourceFrameWidth: integer("source_frame_width"),
  sourceFrameHeight: integer("source_frame_height"),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
});
