-- !Inserting or Updating a Player When They Join
-- Try to update 'updated_at' for existing player
UPDATE Players
SET updated_at = CURRENT_TIMESTAMP
WHERE username = ?;

-- Check if any rows were updated
SELECT changes() AS rows_affected;

-- If no rows were updated, insert new player
INSERT INTO Players (username)
SELECT ?
WHERE NOT EXISTS (SELECT 1 FROM Players WHERE username = ?);


-- !Inserting a New Map and Medal Times
-- Insert map author if not exists
INSERT INTO Players (username)
SELECT ?
WHERE NOT EXISTS (SELECT 1 FROM Players WHERE username = ?);

-- Get mapAuthor (can be NULL if author is not in Players)
SELECT player_id INTO @mapAuthor
FROM Players WHERE username = ?;

-- Insert new map
INSERT INTO Maps (
    mapDBID, mapName, mapAuthorName, mapAuthor, mapData,
    mapMode, mapDifficulty, mapDescription,
    authorMedalTime, goldMedalTime, silverMedalTime, bronzeMedalTime
) VALUES (
    ?, ?, ?, @mapAuthor, ?, ?, ?, ?, ?, ?, ?, ?
);


-- !Updating Player's Record After Finishing a Map
-- Check current personal best
SELECT personalBestTime FROM Records
WHERE player_id = ? AND map_id = ?;

-- If no record exists, insert new record
INSERT INTO Records (
    player_id, map_id, personalBestTime, finishCounter, deathCounter, inputs
) VALUES (
    ?, ?, ?, 1, ?, ?
);

-- Insert into PersonalBestHistory
INSERT INTO PersonalBestHistory (
    player_id, map_id, personalBestTime
) VALUES (
    ?, ?, ?
);

-- If record exists, compare times
IF @newTime < @currentPersonalBest THEN
    -- Update Records
    UPDATE Records
    SET personalBestTime = @newTime,
        finishCounter = finishCounter + 1,
        deathCounter = deathCounter + ?,
        inputs = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE player_id = ? AND map_id = ?;

    -- Insert into PersonalBestHistory
    INSERT INTO PersonalBestHistory (
        player_id, map_id, personalBestTime
    ) VALUES (
        ?, ?, @newTime
    );
ELSE
    -- Update finish and death counters
    UPDATE Records
    SET finishCounter = finishCounter + 1,
        deathCounter = deathCounter + ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE player_id = ? AND map_id = ?;
END IF;


-- !Updating Map Rating
-- Insert or update rating
INSERT INTO MapRatings (player_id, map_id, rating_value)
VALUES (?, ?, ?)
ON CONFLICT(player_id, map_id) DO UPDATE SET
    rating_value = excluded.rating_value,
    rated_at = CURRENT_TIMESTAMP;


-- !Calculating Average Map Rating
SELECT AVG(rating_value) AS average_rating
FROM MapRatings
WHERE map_id = ?;


-- !Generating an Improvement Graph
SELECT personalBestTime, achieved_at
FROM PersonalBestHistory
WHERE player_id = ? AND map_id = ?
ORDER BY achieved_at ASC;



