-- !Player Joins Room
-- Check if player exists
SELECT player_id FROM Players WHERE username = ?;

-- If not exists, insert new player
INSERT INTO Players (username)
VALUES (?);

-- If exists, update 'updated_at'
UPDATE Players
SET updated_at = CURRENT_TIMESTAMP
WHERE player_id = ?;


-- !New Map Validation
-- Check if author exists
SELECT player_id FROM Players WHERE username = ?;

-- If not exists, insert new author
INSERT INTO Players (username)
VALUES (?);

-- Get the player_id of the author (if exists)
SELECT player_id INTO @author
FROM Players WHERE username = ?;

-- Insert new map
INSERT INTO Maps (
    mapDBID, mapName, mapAuthorName, mapAuthor, mapData,
    mapMode, mapDifficulty, mapDescription,
    authorMedalTime, goldMedalTime, silverMedalTime, bronzeMedalTime
) VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
);


-- !Player Finishes a Map
-- Check if record exists
SELECT personalBestTime FROM Records WHERE player_id = ? AND map_id = ?;

-- If not exists, insert new record
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

-- If exists, compare times
IF @newTime < @existingPersonalBestTime THEN
    -- Update Records with new personal best
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
    -- Update Records without changing personal best
    UPDATE Records
    SET finishCounter = finishCounter + 1,
        deathCounter = deathCounter + ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE player_id = ? AND map_id = ?;
END IF;


-- !Generating Improvement Graphs
SELECT personalBestTime, achieved_at
FROM PersonalBestHistory
WHERE player_id = ? AND map_id = ?
ORDER BY achieved_at ASC;

