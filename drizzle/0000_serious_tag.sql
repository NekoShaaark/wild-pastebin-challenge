CREATE TABLE "stored_bins" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"paste_bin_content" text NOT NULL,
	"protected_bin" boolean DEFAULT false,
	"bin_password" text DEFAULT null,
	"bin_link" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_on" timestamp with time zone DEFAULT null,
	CONSTRAINT "stored_bins_bin_link_unique" UNIQUE("bin_link")
);
