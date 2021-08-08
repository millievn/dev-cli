const fs = require("fs")
const inquirer = require("inquirer")
const download = require("download-git-repo")

const shell = require("shelljs")
const ora = require("ora")
const chalk = require("chalk")

const { templates } = require("./config.json")

async function selectTemp() {
  const { temp } = await inquirer.prompt([
    {
      type: "list",
      message: "Select Template",
      name: "temp",
      choices: templates.map(temp => {
        return {
          name: temp.name,
          value: temp,
        }
      }),
    },
  ])

  return temp
}

function downloadRepo(url, name, clone = false) {
  console.log({
    url,
    name,
    clone,
  })
  const spinner = ora("downloading...")
  spinner.start()

  return new Promise((res, rej) => {
    download(url, name, { clone }, err => {
      if (err) {
        spinner.fail()
        rej(err)
      } else {
        spinner.succeed()
        res()
      }
    })
  })
}

function removeExistName(name) {
  const packageFile = `${name}/package.json`
  const spinner = ora("replace name...")
  spinner.start()

  try {
    spinner.succeed()

    if (fs.existsSync(packageFile)) {
      const content = fs.readFileSync(packageFile, {
        encoding: "utf-8",
      })

      const pkg = JSON.parse(content)

      fs.writeFileSync(
        packageFile,
        JSON.stringify(
          {
            ...pkg,
            name,
          },
          null,
          2
        )
      )
    }
    fs.unlink(`${name}/readme.md`, () => {})
  } catch (error) {
    spinner.fail()
  }
}

function initGit(name) {
  const spinner = ora("git init...")
  return new Promise((res, rej) => {
    shell.cd(name).exec("git init", err => {
      if (err) {
        spinner.fail()
        rej(err)
      } else {
        spinner.succeed()
        res()
      }
    })
  })
}

const logger = {
  warn(...msg) {
    console.log(chalk.yellow("⚠ ", ...msg))
  },
  error(...msg) {
    console.log(chalk.red("✖ ", ...msg))
  },
  success(...msg) {
    console.log(chalk.green("✔ ", ...msg))
  },
  info(...msg) {
    console.log(chalk.blue("ℹ ", ...msg))
  },
}

module.exports = {
  selectTemp,
  download,
  initGit,
  removeExistName,
  downloadRepo,
  logger,
}
