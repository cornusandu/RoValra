class AssertionError extends Error {};

let fails = 0;
let total = 0;

function testSuite(name, fn) {
    return () => {
            try { 
            fn();
            console.info(`\x1b[32m[+] Test suite ${name} passed.\x1b[0m`)
        } catch (e) {
            if (e instanceof AssertionError) {
                console.error(`\x1b[31m[-] Test suite ${name} failed.\x1b[0m`);
                fails++;
            } else {
                console.error(`\x1b[31m[?] Unknown error occurred while running test suite ${name}: `, e, '\x1b[0m');
                fails++;
            }
        } finally {
            total++;
        }
    }
}

function runTestSuites(fns) {
    fails = 0;
    total = 0;

    for (const fn of fns) {
        fn();
    }

    console.info(`\n\x1b[1m${total - fails} tests passed, ${fails} tests failed.\x1b[0m`);
}

function assert(condition) {
    if (condition !== true) {
        throw new AssertionError();
    }
}

import { CAM_BADGE_USER_ID, TRUSTED_USER_IDS } from "./src/content/core/configs/userIds.js";
import { isTrusted } from "./src/content/features/profile/header/status-utils.js";

runTestSuites([
    testSuite("trustedUser0", () => assert(!isTrusted(4866259394))),
    testSuite("trustedUser1", () => assert(isTrusted(CAM_BADGE_USER_ID))),
    testSuite("trustedUser2", () => assert(!isTrusted(4866319396))),
    testSuite("trustedUser3", () => {
        for (const id of TRUSTED_USER_IDS) {
            assert(isTrusted(id));
        }
    })
])
