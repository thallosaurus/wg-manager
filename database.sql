CREATE TABLE IF NOT EXISTS "interfaces" (
	"id"	INTEGER UNIQUE,
	"name"	TEXT NOT NULL,
	"address" TEXT NOT NULL,
	"netmask" INTEGER CHECK( netmask <= 32 ) NOT NULL,
	"endpoint" TEXT NOT NULL,
	"privatekey" TEXT NOT NULL,
	"mtu" INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS "users" (
	"id"	INTEGER,
	"interface_id" INTEGER NOT NULL,
	"name"	TEXT,
	"publicKey"	TEXT,
	"psk"	TEXT,
	"privateKey"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("interface_id") REFERENCES "interfaces"("id") ON DELETE CASCADE
);