import type { PlasmoContentScript } from "plasmo";
import { Storage } from "@plasmohq/storage";
export const config: PlasmoContentScript = {
	matches: [
		"https://www.builtinchicago.org/job/*",
		"https://www.builtinaustin.com/job/*",
		"https://www.builtinseattle.com/job/*",
		"https://www.builtinsf.com/job/*",
		"https://www.builtinnyc.com/job/*",
		"https://www.builtinla.com/job/*",
		"https://www.builtincolorado.com/job/*",
		"https://www.builtinboston.com/job/*",
		"https://builtin.com/job/*",
	],
};

const findApplyButton = async () => {
	const storage = new Storage();
	var appliedJobsList: any;
	appliedJobsList = await storage.get("appliedJobs");

	if (!appliedJobsList) {
		appliedJobsList = [];
	}

	let buttonElement = document.getElementsByClassName("apply-button");
	console.log("Apply button catch me outside,", buttonElement);
	while (!buttonElement) {
		// console.log("Waiting for buttonElement");
		buttonElement = document.getElementsByClassName("apply-button");
		console.log("Apply button inside,", buttonElement);
		//add half second time out
		await new Promise((resolve) => setTimeout(resolve, 300));
	}
	const handleClick = (e) => {
		const url = window.location.href;

		//we need the whole url to insure there is no duplicates across the builtin site suite
		appliedJobsList.push(url);
		storage.set("appliedJobs", appliedJobsList);
		// addAppliedJob(splitURL[1]);
		// getAppliedJobs();
	};

	for (let i = 0; i < buttonElement.length; i++) {
		//get the job-details-link buttonElement and return the href

		console.log(`Type of index ${i}`, buttonElement[i].nodeType);
		buttonElement[i].addEventListener("click", handleClick);
		// buttonElement[i].style.backgroundColor("green");
	}
};

const main = async () => {
	console.log("main");
	//id read-more-description-toggle
	//class ga-event-processed
	await findApplyButton();
	// 	let element = document.getElementById("read-more-description-toggle");
	// 	console.log("see more button,", element);
	// 	while (!element) {
	// 		// console.log("Waiting for element");
	// 		let element = document.getElementById("read-more-description-toggle");
	// 		console.log("see more button button inside,", element);
	// 		//add half second time out
	// 		await new Promise((resolve) => setTimeout(resolve, 300));
	// 	}

	// 	const handleClick = async (e) => {
	// 		console.log("see more clicked");
	// 		await new Promise((resolve) => setTimeout(resolve, 300));
	// 		findApplyButton();
	// 	};

	// 	element.addEventListener("click", handleClick);
	// 	element.style.backgroundColor = "green";
	// 	console.log(element);
};

main();
