import { mysqlPool } from '../utils/db';

/**
 * Interface for structured log details.
 * This allows us to store contextual information as a JSON string in the database.
 */
interface LogDetails {
    [key: string]: any;
}

/**
 * Logs a user's activity to the `activity_logs` table in the database.
 * 
 * @param userStdid - The student ID (stdid) of the user performing the action.
 * @param action - A string describing the action (e.g., 'USER_LOGIN', 'CREATE_COURSE').
 * @param details - An optional object containing contextual details about the action.
 */
export const logActivity = async (
    userStdid: string,
    action: string,
    details?: LogDetails
): Promise<void> => {
    // In a production environment, you might want to skip logging for certain users or actions.
    if (!userStdid) {
        console.error('Attempted to log an activity without a userStdid.');
        return;
    }

    try {
        const promisePool = mysqlPool.promise();
        const detailsJson = details ? JSON.stringify(details) : null;

        await promisePool.query(
            'INSERT INTO activity_logs (user_stdid, action, details) VALUES (?, ?, ?)',
            [userStdid, action, detailsJson]
        );
    } catch (error) {
        console.error('Failed to write to activity_logs:', error);
        // This function intentionally does not throw an error to avoid breaking the primary user operation.
        // If logging fails, the user's action should still succeed.
    }
}; 