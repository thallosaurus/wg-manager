CREATE TABLE IF NOT EXISTS "interfaces" (
	"id"	INTEGER UNIQUE,
	"name"	TEXT NOT NULL,
	"address" UNSIGNED INTEGER NOT NULL,
	"netaddress" UNSIGNED INTEGER NOT NULL,
	"broadcast" UNSIGNED INTEGER NOT NULL,
	"netmask" INTEGER CHECK( netmask <= 32 ) NOT NULL,
	"endpoint" TEXT NOT NULL,
	"listenport" INTEGER NOT NULL,
	"privatekey" TEXT NOT NULL,
	"pubkey" TEXT NOT NULL,
	"mtu" INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS "users" (
	"id"	INTEGER,
	"interface_id" INTEGER NOT NULL,
	"name"	TEXT,
	"publicKey"	TEXT,
	"allowed_ip" UNSIGNED INTEGER NOT NULL,
	"psk"	TEXT,
	"privateKey"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("interface_id") REFERENCES "interfaces"("id") ON DELETE CASCADE
);

CREATE TRIGGER IF NOT EXISTS validate_user_ip
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
	SELECT
		CASE
			WHEN NEW.allowed_ip <
				(SELECT netaddress + 1
					FROM interfaces
					WHERE id = NEW.interface_id)
			THEN
				RAISE(ABORT, 'IP below network')

			WHEN NEW.allowed_ip >
				(SELECT broadcast - 1
					FROM interfaces
					WHERE id = NEW.interface_id)
			THEN
				RAISE(ABORT, 'IP above network')

			WHEN NEW.allowed_ip = 
				(SELECT address
				from interfaces
				where id = NEW.interface_id)
			THEN
				RAISE(ABORT, 'IP already in use by endpoint')
		END;
END;

CREATE TRIGGER IF NOT EXISTS validate_user_ip_update
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
	SELECT
		CASE
			WHEN NEW.allowed_ip <
				(SELECT netaddress + 1
					FROM interfaces
					WHERE id = NEW.interface_id)
			THEN
				RAISE(ABORT, 'IP below network')

			WHEN NEW.allowed_ip >
				(SELECT broadcast - 1
					FROM interfaces
					WHERE id = NEW.interface_id)
			THEN
				RAISE(ABORT, 'IP above network')

			WHEN NEW.allowed_ip = 
				(SELECT address
				from interfaces
				where id = NEW.interface_id)
			THEN
				RAISE(ABORT, 'IP already in use by endpoint')
		END;
END;

CREATE TRIGGER IF NOT EXISTS validate_interface_network
BEFORE INSERT ON interfaces
FOR EACH ROW
BEGIN
	SELECT CASE
		WHEN EXISTS (
			SELECT 1
			FROM interfaces
			WHERE
				NEW.netaddress <= broadcast
				AND
				NEW.broadcast >= netaddress
		)
		THEN
			RAISE(ABORT, 'network overlaps existing network')
	END;
END;

CREATE TRIGGER IF NOT EXISTS validate_interface_network_update
BEFORE UPDATE ON interfaces
FOR EACH ROW
BEGIN
	SELECT CASE
		WHEN EXISTS (
			SELECT 1
			FROM interfaces
			WHERE
				id != NEW.id
				AND NEW.netaddress <= broadcast
				AND NEW.broadcast >= netaddress
		)
		THEN
			RAISE(ABORT, 'network overlaps existing network')
	END;
END;