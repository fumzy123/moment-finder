CREATE TABLE "video_screenshots" (
	"screenshot_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"video_id" text NOT NULL,
	"timestamp_seconds" numeric NOT NULL,
	"rect_x" numeric NOT NULL,
	"rect_y" numeric NOT NULL,
	"rect_width" numeric NOT NULL,
	"rect_height" numeric NOT NULL,
	"output_width" integer NOT NULL,
	"output_height" integer NOT NULL,
	"output_format" text NOT NULL,
	"screenshot_bucket" text NOT NULL,
	"screenshot_object_name" text NOT NULL,
	"source_frame_width" integer,
	"source_frame_height" integer,
	"created_at" timestamp with time zone DEFAULT now()
);
