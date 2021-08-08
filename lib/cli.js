#!/usr/bin/env node

const program = require("commander")
const minimist = require("minimist")
const chalk = require("chalk")

program
  .version(`dev-cli ${require("../package").version}`)
  .usage("<command> [options]")

program
  .command("create <app-name>")
  .description("create a new project powered by vue-cli-service")
  .option("-f, --force", "Overwrite target directory if it exists")
  .option("-c, --clone", "Keep git repository")
  .option("-s, --skip", "Skip install dependence")
  .action((name, options) => {
    if (minimist(process.argv.slice(3))._.length > 1) {
      console.log(
        chalk.yellow(
          "Info: You provided more than one argument. The first one will be used as the app's name, the rest are ignored."
        )
      )
    }
    require("../lib/create")(name, options)
  })

// const inquirer = require("inquirer")

// inquirer
//   .prompt([
//     {
//       type: "input",
//       message: "请输入项目名",
//       name: "name",
//       default: name,
//       validate: function (val) {
//         if (val == "") {
//           return "项目必须要有名称噢"
//         }
//         if (fs.existsSync(val)) {
//           return "项目名已存在"
//         }
//         return true
//       },
//     },
//     {
//       type: "list",
//       message: "请选择项目类型",
//       name: "type",
//       choices: ["jQuery", "vue"],
//     },
//   ])
//   .then(answers => {
//     console.log(answers)
//   })

// program.command("init [name]").action(name => {
//   console.log(name)
// })
program.parse(process.argv)
