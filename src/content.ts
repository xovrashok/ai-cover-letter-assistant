// type JobDetails = {
//   jobTitle: string;
//   companyName: string;
//   jobDescription: string;
//   windowURL: string;
// };

export const parseJobDetails = () => {
  const host = window.location.href;

  const title = document.querySelector("h1");
  const jobTitle = title?.textContent?.trim() || "";

  let jobDescription = "";

  if (host.includes("djinni.co")) {
    const descElement =
      document.querySelector(".job-post__description") ||
      document.querySelector(".profile-page-section");
    jobDescription = descElement?.textContent?.trim() || "";
  } else if (host.includes("work.ua")) {
    const descElement = document.querySelector("#job-description");
    jobDescription = descElement?.textContent?.trim() || "";
  }

  const company =
    document.querySelector("a.text-secondary.fw-medium") ||
    document.querySelector(".job-company-name") ||
    document.querySelector("a[href*='/companies/']") ||
    document.querySelector("b.text-black");

  const companyName = company?.textContent?.trim() || "Unknown Company";

  return {
    jobTitle,
    companyName,
    jobDescription,
    windowURL: window.location.href,
  };
};

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "GET_JOB_DETAILS") {
    const data = parseJobDetails();
    sendResponse(data);
  }
  return true;
});
