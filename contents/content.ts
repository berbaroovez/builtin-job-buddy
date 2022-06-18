import type { PlasmoContentScript } from "plasmo";
import { Storage } from "@plasmohq/storage";
const storage = new Storage();
var bannedTermsList: string[];
var hideBannedJobs = "false";
var appliedJobsList: string[];
var colorForAvoid: string;
var colorForApplied: string;

export const config: PlasmoContentScript = {
    matches: [
        "https://www.builtinchicago.org/jobs/*",
        "https://www.builtinaustin.com/jobs/*",
        "https://www.builtinseattle.com/jobs/*",
        "https://www.builtinsf.com/jobs/*",
        "https://www.builtinnyc.com/jobs/*",
        "https://www.builtinla.com/jobs/*",
        "https://www.builtincolorado.com/jobs/*",
        "https://www.builtinboston.com/jobs/*",
        "https://builtin.com/jobs/*",
    ],
};

//This function does the following
//1. Grabs all the jobs on the page which are in the class "job-row"
//2. For each job it will grab the href of the job link ex: https://www.builtinchicago.org/job/engineer/lead-software-engineer/181434
//3. It will split the href on /job/ so we only get the second part of the url
//4. It will check if the job title contains any of the banned terms
//5. It wil; check if the job has been applied to

const grabAllByClassName = async () => {
    console.log("grabAllByClassName");

    const group = document.getElementsByClassName(
        "job-row",
    ) as HTMLCollectionOf<HTMLElement>;

    for (let i = 0; i < group.length; i++) {
        let jobLink = group[i].getElementsByClassName("job-details-link")[
            0
        ] as HTMLAnchorElement;

        //get the url of the pagfe
        const jobURL = jobLink.href;
        // console.log(`index: ${i} jobURL: ${jobURL}`);

        //split job url on /job/
        const splitURL = jobURL.split("/job/");

        //we have to check for length because for some reason builtinchicago allows jobs to not
        //have a real url
        if (splitURL.length > 1) {
            const contains = doesJobTitleContainWords(
                bannedTermsList,
                splitURL[1],
            );

            var applied = false;

            //when the extension is first loaded we don't have any applied jobs
            if (appliedJobsList !== undefined) {
                //lets send the whole url so we can insure there is no chance a job has the same id on two different builtin sites
                applied = hasJobBeenAppliedTo(appliedJobsList, jobURL);
            }

            //if url contains a banned word lets either remove it or change the color
            if (contains) {
                if (hideBannedJobs === "true") {
                    group[i].remove();
                } else {
                    group[i].style.backgroundColor = colorForAvoid;
                }
            }
            //else if the job waas applied to lets change the color
            else if (applied) {
                group[i].style.backgroundColor = colorForApplied;
            }
        }
    }
};

const doesJobTitleContainWords = (bannedArray, jobTitle) => {
    for (let i = 0; i < bannedArray.length; i++) {
        if (jobTitle.includes(bannedArray[i])) {
            return true;
        }
    }

    return false;
};
const hasJobBeenAppliedTo = (appliedArray, jobTitle) => {
    for (let i = 0; i < appliedArray.length; i++) {
        if (appliedArray[i] === jobTitle) {
            return true;
        }
    }

    return false;
};

//we have mutation observer set up so whenver a new job is added to the page via lazy load or the show more button we re-run the grabAllByClassName function
const handleMutation = (mutation: MutationRecord[]) => {
    mutation.forEach((entry) => {
        if (entry.addedNodes.length > 0) {
            grabAllByClassName();
        }
    },);
};

const jobObserver = new MutationObserver(handleMutation);
const main = async () => {
    console.log("main");

    //we get these all here because that means well update the three list one time perpage whenver the url changes
    //there is no need to update these list after every update since the extension is intended for coming baack a week later to track which jobs theyve applied for
    hideBannedJobs = await storage.get("hideBannedJobs");
    bannedTermsList = await storage.get("bannedJobTitles");
    appliedJobsList = await storage.get("appliedJobs");
    colorForAvoid = await storage.get("bannedColor");
    colorForApplied = await storage.get("appliedColor");

    var centerCol = undefined;

    while (centerCol == undefined) {
        centerCol = document.getElementsByClassName("jobs show_incentive")[0];

        //add half second time out
        await new Promise((resolve) => setTimeout(resolve, 300));
    }

    //we do this before the observer is added because some jobs are not lazy loaded
    // and thus on the page right on load
    grabAllByClassName();

    //we use the observer to detect when new jobs are added to the page via lazy load
    //we use subtree to catch the added nodes that appear when you click "view more ___ jobs"
    jobObserver.observe(centerCol, { childList: true, subtree: true });
};
main();

//since builtinchicago is a single page app once you load
//we never actually reload when we go to the next set of jobs
//so lets just listen for the url change and update the background colors
let lastUrl = window.location.href;
new MutationObserver(() => {
    const url = window.location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        main();
    }
},).observe(document, { subtree: true, childList: true });
