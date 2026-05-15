const { offsetMeshWithRotation } = require("roavatar-renderer");

const min = (a, b) => a > b ? b : a;

class Version {
    /**
     * @param {string} version 
     */
    constructor(version) {
        try {
            this.versions = version.split(".").map((v) => Number(v));
        } catch (e) {
            console.error(`(RoValra) Failed to construct Version due to error: `, e);
        }
    }

    /**
     * @param {Version} other 
     * @returns {number} 0 if false, 1 if equal, 2 if greater
     */
    greater_than(other) {
        for (let i = 0; i < min(this.versions.length, other.versions.length)) {
            if (this.versions[i] > other.versions[i])
                return 2;
            else if (this.versions[i] < other.versions[i])
                return 0;
        }

        if (this.versions.length < other.versions.length)
            return 0;
        else if (this.versions.length > other.versions.length)
            return 2;

        return 1;
    }
}

chrome.runtime.onInstalled.addListener(async (details) => {
    try {
        const oldVersion = await chrome.storage.local.get("RoValraSettingsVersion");
    } catch {
        await chrome.storage.local.set("RoValraSettingsVersion", chrome.runtime.getManifest().version);
    }
});
