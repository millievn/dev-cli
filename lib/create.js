const fs = require("fs")

const utils = require("./utils")

async function create(name, { force = false, clone = false, skip = false }) {
  if (!name) {
    utils.logger.warn("Name not provided.")

    process.exit(1)
  }

  if (fs.existsSync(name)) {
    if (!force) {
      utils.logger.error("File exist. Please remove it or rename.")

      process.exit(1)
    }
  }
  const temp = await utils.selectTemp()

  try {
    await utils.downloadRepo(temp.url, name, clone)

    await utils.removeExistName(name)

    if (!skip) {
      await utils.initGit(name)
    }
  } catch (error) {
    utils.logger.error("Create failed.", error)

    process.exit(1)
  }
}

module.exports = create
