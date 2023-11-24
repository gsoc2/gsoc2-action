const core = require("@actions/core");
const exec = require("@actions/exec");

const INSIGHTS = [
  "commitCountLast30Days",
  "lastCommitDate",
  "createDate",
  "linesOfCode",
];

module.exports = {
  run,
  getConfig,
};

function getConfig() {
  return {};
}

async function collectInsight(insightType) {
  const args = [
    "gsoc2@latest",
    "insight",
    "--insightType",
    insightType,
    "-o",
    `gsoc2.${insightType}.json`,
  ];
  const runExitCode = await exec.exec("npx", args);

  return runExitCode;
}

async function uploadInsight(config, insightType) {
  const args = [
    "gsoc2@latest",
    "upload",
    "--type",
    "insight",
    "--repo",
    config.repoOrigin,
    "-a",
    config.apiToken,
    `gsoc2.${insightType}.json`,
  ];

  if (config.gsoc2Url) {
    args.push("--url", config.gsoc2Url);
  }

  const runExitCode = await exec.exec("npx", args);

  return runExitCode;
}

async function run(config) {
  let exitCode = 0;
  for (const insightType of INSIGHTS) {
    const stepExitCode = await core.group(
      `Collecting ${insightType}`,
      async () => collectInsight(insightType)
    );
    exitCode += stepExitCode;
    if (stepExitCode !== 0) {
      core.error("Generation Step failed with exit code ${stepExitCode}");
    } else if (config.skipUpload) {
      core.info(`Skipping ${insightType} upload`);
    } else {
      exitCode += await core.group(`Uploading ${insightType}`, async () =>
        uploadInsight(config, insightType)
      );
    }
  }

  return exitCode;
}
