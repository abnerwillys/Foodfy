-- -> Delete and Create Database if necessary
-- DROP DATABASE IF EXISTS foodfydb;
-- CREATE DATABASE foodfydb;

CREATE TABLE "chefs" (
  "id" SERIAL PRIMARY KEY,
  "file_id" int,
  "name" text,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "recipes" (
  "id" SERIAL PRIMARY KEY,
  "chef_id" int,
  "title" text,
  "ingredients" text[],
  "preparation" text[],
  "information" text,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  "user_id" int
);

CREATE TABLE "files" (
  "id" SERIAL PRIMARY KEY,
  "name" text,
  "path" text NOT NULL
);

CREATE TABLE "recipe_files" (
  "id" SERIAL PRIMARY KEY,
  "recipe_id" int,
  "file_id" int
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "email" text UNIQUE NOT NULL,
  "password" text NOT NULL,
  "reset_token" text,
  "reset_token_expires" text,
  "is_admin" boolean DEFAULT (false),
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);


-- -> Add Foreign Keys
ALTER TABLE "recipes" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
ALTER TABLE "recipe_files" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id");
ALTER TABLE "recipe_files" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");
ALTER TABLE "chefs" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");
ALTER TABLE "recipes" ADD FOREIGN KEY ("chef_id") REFERENCES "chefs" ("id");

-- ALTER TABLE "files" ADD FOREIGN KEY ("id") REFERENCES "recipe_files" ("file_id");


-- -> Create Procedure
CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = NOW();
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -> Add auto updated_at TRIGGER on recipes
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
-- -> Add auto updated_at TRIGGER on users
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- -> CREATE SESSION
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" 
ADD CONSTRAINT "session_pkey" 
PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- -> Delete and Creat tables on public if necessary
-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;

-- -> Change default of a column
-- ALTER TABLE recipes ALTER COLUMN created_at SET DEFAULT (now());

-- -> Delete multiple rows if necessary
-- DELETE FROM files
-- WHERE id IN (202,203,204,205,206,207,208,209,210,211,216,218)
-- RETURNING *;

-- -> Restart sequence auto_increment from tables ids if necessary
-- ALTER SEQUENCE products_id_seq RESTART WITH 1;