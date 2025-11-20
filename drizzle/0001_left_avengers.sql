ALTER TABLE "video_screenshots" ALTER COLUMN "screenshot_id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "video_screenshots" DROP COLUMN "output_format";
ALTER TABLE "video_screenshots" RENAME COLUMN "screenshot_object_name" TO "screenshot_file_name";
ALTER TABLE "video_screenshots" RENAME COLUMN "output_width" TO "screenshot_width";
ALTER TABLE "video_screenshots" RENAME COLUMN "output_height" TO "screenshot_height";
ALTER TABLE "video_screenshots" RENAME COLUMN "rect_x" TO "capture_frame_x";
ALTER TABLE "video_screenshots" RENAME COLUMN "rect_y" TO "capture_frame_y";
ALTER TABLE "video_screenshots" RENAME COLUMN "rect_width" TO "capture_frame_width";
ALTER TABLE "video_screenshots" RENAME COLUMN "rect_height" TO "capture_frame_height";
