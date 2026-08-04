CREATE TABLE IF NOT EXISTS "interfaces" (
	"id"	INTEGER UNIQUE,
	"name"	TEXT NOT NULL UNIQUE,
	"address" UNSIGNED INTEGER NOT NULL,
	"netaddress" UNSIGNED INTEGER NOT NULL,
	"broadcast" UNSIGNED INTEGER NOT NULL,
	"netmask" INTEGER CHECK( netmask BETWEEN 0 AND 32 ) NOT NULL,
	"endpoint" TEXT NOT NULL,
	"listenport" INTEGER CHECK(listenport BETWEEN 1 AND 65535) NOT NULL UNIQUE,
	"privatekey" TEXT UNIQUE,
	"pubkey" TEXT UNIQUE,
	"mtu" INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE IF NOT EXISTS "users" (
	"id"	INTEGER,
	"interface_id" INTEGER NOT NULL,
	"name"	TEXT,
	"publicKey"	TEXT UNIQUE,
	"allowed_ip" UNSIGNED INTEGER NOT NULL,
	"psk"	TEXT,
	"privateKey" TEXT UNIQUE,
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

CREATE VIEW IF NOT EXISTS InterfaceConfigs AS
SELECT
                    i.id,
                    i.name,
                    i.address,
                    i.netaddress,
					i.endpoint,
                    i.listenport,
                    i.netmask,
                    i.broadcast,
                    i.mtu,
                    json_group_array(
                        json_object(
                            'id', u.id,
                            'name', u.name,
                            'address', u.allowed_ip
                        )
                    ) FILTER (WHERE u.id IS NOT NULL) AS users

                FROM interfaces i
                LEFT JOIN users u ON u.interface_id = i.id
                GROUP BY i.id;


CREATE VIEW IF NOT EXISTS InterfaceConfigsKeys AS
SELECT
        i.id,
        i.name,
        i.address,
        i.netaddress,
		i.endpoint,
        i.listenport,
        i.privatekey,
        i.pubkey,
        i.netmask,
        i.broadcast,
        i.mtu,
        json_group_array(
            json_object(
                'id', u.id,
                'name', u.name,
                'address', u.allowed_ip,
                'pubkey', u.publicKey,
                'privkey', u.privateKey,
                'psk', u.psk
            )
        ) FILTER (WHERE u.id IS NOT NULL) AS users

        FROM interfaces i
        LEFT JOIN users u ON u.interface_id = i.id
        GROUP BY i.id