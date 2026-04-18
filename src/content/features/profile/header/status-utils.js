import { TRUSTED_USER_IDS } from "../../../core/configs/userIds.js";

/**
 * 
 * @param {number} userId 
 * @returns {boolean}
 */
export function isTrusted(userId) {
    return TRUSTED_USER_IDS.includes(String(userId));
}
