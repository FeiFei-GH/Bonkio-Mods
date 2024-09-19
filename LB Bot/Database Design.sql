PRAGMA foreign_keys = ON;

CREATE TABLE Players (
    player_id           INTEGER PRIMARY KEY AUTOINCREMENT,
    username            TEXT UNIQUE NOT NULL,
    level               INTEGER,
    avatar              BLOB,
    permission_level    INTEGER DEFAULT 0,
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Maps (
    map_id              INTEGER PRIMARY KEY AUTOINCREMENT,
    mapDBID             TEXT UNIQUE NOT NULL,
    mapName             TEXT NOT NULL,
    mapAuthor           INTEGER NOT NULL,
    mapData             BLOB NOT NULL,
    mapMode             TEXT NOT NULL,
    mapDifficulty       INTEGER,
    mapRating           REAL DEFAULT 0,
    mapDescription      TEXT,
    authorMedalTime     REAL NOT NULL,
    goldMedalTime       REAL NOT NULL,
    silverMedalTime     REAL NOT NULL,
    bronzeMedalTime     REAL NOT NULL,
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (mapAuthor) REFERENCES Players(player_id)
);

CREATE TABLE Records (
    record_id           INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id           INTEGER NOT NULL,
    map_id              INTEGER NOT NULL,
    personalBestTime    REAL NOT NULL,
    finishCounter       INTEGER DEFAULT 1,
    deathCounter        INTEGER DEFAULT 0,
    rating              INTEGER,  -- Player's rating for this map
    inputs              BLOB,     -- Inputs for the latest personal best run
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES Players(player_id),
    FOREIGN KEY (map_id) REFERENCES Maps(map_id),
    UNIQUE(player_id, map_id)     -- Ensures one record per player per map
);

CREATE TABLE PersonalBestHistory (
    history_id          INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id           INTEGER NOT NULL,
    map_id              INTEGER NOT NULL,
    personalBestTime    REAL NOT NULL,
    achieved_at         DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES Players(player_id),
    FOREIGN KEY (map_id) REFERENCES Maps(map_id)
);

CREATE INDEX idx_records_player_map ON Records(player_id, map_id);
CREATE INDEX idx_personalbesthistory_player_map ON PersonalBestHistory(player_id, map_id);

-- !Currently saving medal times in Maps table
-- CREATE TABLE MedalTimes (
--     medal_time_id   INTEGER PRIMARY KEY AUTOINCREMENT,
--     map_id          INTEGER NOT NULL,
--     medal_type      TEXT NOT NULL, -- e.g., 'Gold', 'Silver', 'Bronze'
--     time_required   REAL NOT NULL,
--     FOREIGN KEY (map_id) REFERENCES Maps(map_id)
-- );

-- !Currently saving ratings in Records table
-- CREATE TABLE MapRatings (
--     rating_id           INTEGER PRIMARY KEY AUTOINCREMENT,
--     player_id           INTEGER NOT NULL,
--     map_id              INTEGER NOT NULL,
--     rating_value        INTEGER NOT NULL,  -- -2 to 2
--     rated_at            DATETIME DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (player_id) REFERENCES Players(player_id),
--     FOREIGN KEY (map_id) REFERENCES Maps(map_id),
--     UNIQUE(player_id, map_id)
-- );
