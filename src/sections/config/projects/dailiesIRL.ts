import type { ProjectPage } from "../projectsConfig";
const dailiesIRL: ProjectPage = {
  name: "Dailies IRL",
  role: "Cloud Developer",
  period: "October 2026",
  techStack: [
    "JavaScript",
    "Google Apps Script",
    "Google Cloud Console",
    "HTML",
    "CSS",
  ],
  links: [
    {
      name: "Home Page",
      link: "https://krish544.com/dailies-irl",
    },
    {
      name: "Get the Extension",
      link: "https://chromewebstore.google.com/detail/pneipnklblkocebmblmmnecchaangmbd?utm_source=item-share-cb",
    },
  ],
  summary: `This extension allows you to customize google tasks to give you scheduled random quests! You can give us category list of quests(stuff you want to do) and set it up so that each day a random one from that list will be chosen, you can also set how many you want assigned and even make weekly and monthly quests. You can make as many of these categories as you want, and even make certain tasks BIG, which means that if its assigned its the only one assigned that section. Anyways why not add some spice to your life and get to grinding quests! Oh and for you guys who like extras, you can set a chance of doubling or getting a day off your dailies!

  First, I came up with everything the user would need to input and what the backend function would need to do. It would need to take in different categories with their own tasks attached to them, how would I assign tasks without making a new trigger for each different one(daily, weekly, monthly), what ways could I store it, etc. Then I started coding the backend functions that would be really simple and reused often, like the random assignment, due date based on config, and data cleaning before assigning.

To test it I just made a quick and basic frontend, nothing special and no cool libraries because it's a one and done type extension and it shouldn't take more than a 1KB of storage or have a bunch of 3rd party code.

Finally, I needed to, well actually store the data to the user's account, so I used PropertiesService to save it to their account. However, this wasn't the end because I had to set a hard max of bytes able to be saved(google has a limit for how much extension/apps can use) and make sure they could make as many categories as they could want(>100 with 50 tasks in each). This was much more challenging, instead of being able to store them as one big json string because each value could be at max 9KB and in total: 500KB before the user would be unable to store anymore. Instead to get around this problem I chunked each value(split it across) and used settings as a table of contents or instructions to put it all together when using it. When saving the data it takes the input json string and packs it like this:

[{title:"Dishes",big:false},{title:"Deep clean",big:true}] // before

tasks:["Dishes","Deep clean"], big:[1] // after

After changing the packing I use JSON.stringify to make one long string, and splitByBytes_ cuts it into pieces of at most 9000 bytes(limit of 9 KB for any one value to have in google storage for user config). then we combine all the strings for tasks into one big string and split it by bytes in order to make sure they're only 9KB at most, then store how many chunks it split into for later. They split wonky sometimes, but it doesn't matter since each function that uses it will reconstruct it first. Check everything's sizes to make sure they conform and clean up the old data, and the backend is fully done with the frontend just passing values over.
  `,
  highlights: [
    "Built and shipped a serverless Manifest V3 Chrome extension that adds randomized, scheduled tasks to Google Tasks, using Chrome identity OAuth and the Google Apps Script API with no backend server of my own.",
    "Engineered a chunked storage layer that fits Google's 9 KB-per-key and 500 KB-total limits by splitting settings across keys with UTF-8-safe byte splitting, compact task packing, lock-protected atomic saves and server-side validation of everything the client sends.",
    "Implemented an hourly time-driven scheduler with daily, weekly and monthly periods, time zone support, duplicate prevention and tagged auto-deletion of unfinished tasks, plus Google API Limited Use compliance with in-app consent and one-click data deletion.",
  ],
  architecture: [
    {
      nodes: [
        {
          title: "Frontend",
          description: "JavaScript - CSS - HTML",
        },
      ],
    },
    {
      nodes: [
        {
          title: "Auth",
          description: "chrome.identity - Google OAuth 2.0",
        },
      ],
    },
    {
      nodes: [
        {
          title: "Backend",
          description: "Apps Script API ",
        },
        {
          title: "Data",
          description: "Google User Properties - Google Tasks API",
        },
      ],
    },

    {
      nodes: [
        {
          title: "Hosting",
          description: "Google Apps Script - Chrome Web Store",
        },
      ],
    },
  ],
};

export default dailiesIRL;
