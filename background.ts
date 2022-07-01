export {};
import { Storage } from "@plasmohq/storage";
// Check whether new version is installed
chrome.runtime.onInstalled.addListener(async function (details) {
    if (details.reason == "install") {
        console.log("This is a first install!");
        //on first install we need to set chrome storage to have the default values

        // chrome.storage.sync.set({
        //     appliedColor: "#4b9e59",
        //     bannedColor: "#eb5f4d",
        //     hideBannedJobs: "false",
        // },);

        const storage = new Storage();
        await storage.set("appliedColor", "#4b9e59");
        await storage.set("bannedColor", "#eb5f4d");
        await storage.set("hideBannedJobs", "false");
        await storage.set("bannedJobTitles", []);
        await storage.set("appliedJobsList", []);
    } else if (details.reason == "update") {
        var thisVersion = chrome.runtime.getManifest().version;
        console.log(
            "Updated from " +
                details.previousVersion +
                " to " +
                thisVersion +
                "!",
        );
    }
},);
