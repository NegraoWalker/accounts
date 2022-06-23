/*Módulos Externos: */
import chalk from "chalk"
import inquirer from "inquirer"


/*Módulos Internos: */
import fs from "fs"


// console.log("Iniciando o Accounts....")

/*Seção de funções: */
function operation() { // Função que inicia o sistema de banco, oferendo as opções disponiveis.
    inquirer.prompt([{
        type: "list",
        name: "action",
        message: "O que você deseja fazer?",
        choices: [
            "Criar uma conta",
            "Consultar o saldo",
            "Realizar um depósito",
            "Sair do sistema"
        ],
    },
    ]).then((answer) => {
        const action = answer["action"] // Temos que usar a palavra reservada action para que seja exibida a resposta de escolha do user, isso porque foi definida em name acima
        if (action === "Criar uma conta") {
            createAccount()
        }
    }).catch((error) => { console.log(error) })
}

function createAccount() { //Função que da as boas vindas para o user
    console.log(chalk.bgGreen.white("Obrigado por escolher o nosso banco!!"))
    console.log(chalk.yellow("Defina as opções da sua conta a seguir"))
    return buildAccount()

}

function buildAccount() {
    inquirer.prompt([{
        name: "accountName",
        message: "Digite um nome para registro da sua conta:",
    }]).then((answer) => {
        const accountName = answer["accountName"]
        console.info(accountName)

        if (!fs.existsSync("accounts")) { // Vamos simular um banco de dados criando uma pasta para armazenar dados da conta
            fs.mkdirSync("accounts")
        }

        if (fs.existsSync(`accounts/${accountName}.json`)) { // Eu verifico se o nome da conta já foi criada e informo ao user
            console.log(chalk.bgRed.black("Essa conta já foi criada, escolha outro nome para criar a conta!"))
            return buildAccount()

        }

        fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}', function (error) {
            console.log(error)
        }) // Registro da conta do usuário criando um arquivo com o nome dele no formato de Json

        console.log(chalk.bgGreen.yellow("Parabéns, a sua conta foi registrada!!"))

        operation()
    }).catch((error) => { console.log(error) })
}

















operation()