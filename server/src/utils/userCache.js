import { auth } from "../config/firebase.js";

/**
 * User cache utility to efficiently manage user data from Firebase
 * This reduces Firebase API calls by caching user data in local database
 */
export const userCacheUtils = (pool) => ({
  /**
   * Get or create user cache entries for given user IDs
   * @param {string[]} userIds - Array of Firebase UIDs
   * @returns {Promise<Object>} - Map of userId -> user data
   */
  getUsers: async (userIds) => {
    if (!userIds || userIds.length === 0) return {};

    const client = await pool.connect();
    try {
      // First, try to get users from local cache
      const cacheQuery = `
        SELECT user_id, display_name, photo_url, email, last_updated 
        FROM user_cache 
        WHERE user_id = ANY($1::text[])
      `;
      const cachedUsers = await client.query(cacheQuery, [userIds]);

      const usersMap = {};
      const missingUserIds = [];
      const staleUserIds = [];
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Check which users we have cached and which are missing/stale
      userIds.forEach((id) => {
        const cachedUser = cachedUsers.rows.find((u) => u.user_id === id);
        if (cachedUser) {
          if (new Date(cachedUser.last_updated) < oneWeekAgo) {
            staleUserIds.push(id);
          }
          usersMap[id] = {
            displayName: cachedUser.display_name,
            photoURL: cachedUser.photo_url,
            email: cachedUser.email,
          };
        } else {
          missingUserIds.push(id);
        }
      });

      // Fetch missing and stale users from Firebase
      const idsToFetch = [...missingUserIds, ...staleUserIds];
      if (idsToFetch.length > 0) {
        try {
          const userRecords = await auth.getUsers(
            idsToFetch.map((id) => ({ uid: id }))
          );

          // Update cache with fresh data
          for (const user of userRecords.users) {
            const userData = {
              displayName: user.displayName || user.email || "Anonymous User",
              photoURL: user.photoURL,
              email: user.email,
            };

            // Update local cache
            await client.query(
              `
              INSERT INTO user_cache (user_id, display_name, photo_url, email, last_updated)
              VALUES ($1, $2, $3, $4, NOW())
              ON CONFLICT (user_id) 
              DO UPDATE SET 
                display_name = EXCLUDED.display_name,
                photo_url = EXCLUDED.photo_url,
                email = EXCLUDED.email,
                last_updated = EXCLUDED.last_updated
            `,
              [
                user.uid,
                userData.displayName,
                userData.photoURL,
                userData.email,
              ]
            );

            // Update in-memory map
            usersMap[user.uid] = userData;
          }

          // Handle users not found in Firebase
          const foundIds = userRecords.users.map((u) => u.uid);
          const notFoundIds = idsToFetch.filter((id) => !foundIds.includes(id));

          for (const id of notFoundIds) {
            const fallbackData = {
              displayName: "Deleted User",
              photoURL: null,
              email: null,
            };

            // Cache the fallback data
            await client.query(
              `
              INSERT INTO user_cache (user_id, display_name, photo_url, email, last_updated)
              VALUES ($1, $2, $3, $4, NOW())
              ON CONFLICT (user_id) 
              DO UPDATE SET 
                display_name = EXCLUDED.display_name,
                last_updated = EXCLUDED.last_updated
            `,
              [
                id,
                fallbackData.displayName,
                fallbackData.photoURL,
                fallbackData.email,
              ]
            );

            usersMap[id] = fallbackData;
          }
        } catch (firebaseError) {
          console.error("Firebase user fetch error:", firebaseError);

          // Use fallback for missing users
          idsToFetch.forEach((id) => {
            if (!usersMap[id]) {
              usersMap[id] = {
                displayName: "User",
                photoURL: null,
                email: null,
              };
            }
          });
        }
      }

      return usersMap;
    } finally {
      client.release();
    }
  },

  /**
   * Clear old cache entries (run periodically)
   */
  clearStaleCache: async () => {
    const client = await pool.connect();
    try {
      const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      await client.query("DELETE FROM user_cache WHERE last_updated < $1", [
        oneMonthAgo,
      ]);
    } finally {
      client.release();
    }
  },
});

// SQL to create the user_cache table (run this once)
export const createUserCacheTable = `
  CREATE TABLE IF NOT EXISTS user_cache (
    user_id VARCHAR(128) PRIMARY KEY,
    display_name VARCHAR(255),
    photo_url TEXT,
    email VARCHAR(255),
    last_updated TIMESTAMP DEFAULT NOW()
  );
  
  CREATE INDEX IF NOT EXISTS idx_user_cache_updated ON user_cache(last_updated);
`;
