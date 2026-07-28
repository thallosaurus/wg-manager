CREATE TABLE IF NOT EXISTS "interfaces" (
	"id"	INTEGER UNIQUE,
	"name"	TEXT NOT NULL,
	"address" TEXT NOT NULL,
	"endpoint" TEXT NOT NULL,
	"privatekey" TEXT NOT NULL,
	"mtu" INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS "users" (
	"id"	INTEGER,
	"name"	TEXT,
	"publicKey"	TEXT,
	"psk"	TEXT,
	"privateKey"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS "interfaces_users" (
	"interface_id"	INTEGER,
	"user_id"	INTEGER,
	FOREIGN KEY("interface_id") REFERENCES "interfaces"("id"),
	FOREIGN KEY("user_id") REFERENCES "users"("id")
)