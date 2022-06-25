/*Módulos Externos: */
import chalk from "chalk"
import inquirer from "inquirer"


/*Módulos Internos: */
import fs from "fs"


// console.log("Iniciando o Accounts....")

// Função que inicia o sistema de banco, oferendo as opções disponiveis:
function operation() {
    inquirer.prompt([{
        type: "list",
        name: "action",
        message: "O que você deseja fazer?\n",
        choices: [
            "Deseja criar uma conta",
            "Deseja realizar um depósito",
            "Deseja consultar o saldo",
            "Deseja realizar um saque",
            "Deseja sair do sistema"
        ],
    },
    ]).then((answer) => {
        const action = answer["action"] // Temos que usar a palavra reservada action para que seja exibida a resposta de escolha do user, isso porque foi definida em name acima
        if (action === "Deseja criar uma conta") {
            createAccount()
        } else if (action === "Deseja realizar um depósito") {
            deposit()
        } else if (action === "Deseja consultar o saldo") {
            getAccountBalance()
        } else if (action === "Deseja realizar um saque") {
            withDraw()
        } else if (action === "Deseja sair do sistema") {
            console.log(chalk.bgBlue.red("Sistema finalizado, obrigado por utilizar nosso sistema!!"))
            process.exit() //Função que encerra o programa
        }
    }).catch((error) => { console.log(error) })
}

//Função que da as boas vindas para o user:
function createAccount() {
    console.log(chalk.bgGreen.red("Obrigado por escolher o nosso banco!!\n"))
    console.log(chalk.yellow("Defina as opções da sua conta a seguir"))
    return buildAccount()

}

//Função que cria a conta do user:
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

//Função que realiza o depósito de um valor na conta do user:
function deposit() {
    inquirer.prompt([
        {
            name: "accountName",
            message: "Qual o nome da conta?"
        }
    ]).then((answer) => {
        const accountName = answer["accountName"]
        //Chamando a função de verificação de conta existe:
        if (!checkAccount(accountName)) { //Se a conta informa não existe a função retorna para o inicio da função deposit()
            return deposit()
        }

        inquirer.prompt([
            {
                name: "amount",
                message: "Qual o valor do depósito?"
            }
        ]).then((answer) => {
            const amount = answer['amount']
            addAmount(accountName, amount)
            operation()
        }).catch(error => console.log(error))

    }).catch(error => console.log(error))
}

//Função que verifica se a conta informada existe:
function checkAccount(accountName) {
    if (!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black("A conta informada não existe!!, informe uma conta registrada"))
        return false
    } else {
        return true
    }
}

//Função que seleciona a conta(arquivo):
function getAccount(accountName) {
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, { //Lendo o arquivo da conta
        encoding: "utf-8", //Colocando o padrão de escrita com acento
        flag: "r" //Informando que queremos apenas ler
    })

    return JSON.parse(accountJSON)
}

//Função que adiciona valores na conta do user:
function addAmount(accountName, amount) {
    const accountData = getAccount(accountName)

    if (!amount) {
        console.log(chalk.bgRed.black("Ocorreu um erro, tente novamente!!"))
        return deposit()
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance) // Transformando o valor de string para number e somando o valor ao valor já armazenado na conta
    fs.writeFileSync( // Estou escrendo no arquivo da conta o valor do depósito
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (error) {
            console.log(error)
        }
    )

    console.log(chalk.green(`Foi depositado o valor de RS${amount} na sua conta`))
}

// Função que realiza a consulta de saldo na conta do user:
function getAccountBalance() {
    inquirer.prompt([
        {
            name: "accountName",
            message: "Qual o nome da conta para consulta?"
        }
    ]).then((answer) => {
        const accountName = answer["accountName"]
        //Verificando se a conta existe:
        if (!checkAccount(accountName)) {
            return getAccountBalance()
        } else {
            const accountData = getAccount(accountName)
            console.log(chalk.bgBlue.black(`Olá, o saldo da sua conta é de R$${accountData.balance}`)) //Exibindo o valor do saldo
        }
        operation() //Chama a função que exibe o inicio do sistema
    }).catch(error => console.log(error))
}

// Função que realiza um saque na conta do user:
function withDraw() {
    inquirer.prompt([
        {
            name: "accountName",
            message: "Qual o nome da conta para realizar o saque?"
        }
    ]).then((answer) => {
        const accountName = answer["accountName"]
        //Verificando se a conta existe:
        if (!checkAccount(accountName)) {
            return withDraw()
        } else {
            inquirer.prompt([
                {
                    name: "amount",
                    message: "Qual o valor do saque?"
                }
            ]).then((answer) => {
                const amount = answer["amount"]
                removeAmount(accountName, amount)
            }).catch(error => console.log(error))
        }
    }).catch(error => console.log(error))
}

//Função que realiza a operação prática de remoção do valor armazenado na conta do user:
function removeAmount(accountName, amount) {
    const accountData = getAccount(accountName)
    if (!amount) {
        console.log(chalk.bgRed.black("Ocorreu um erro, tente novamente mais tarde!"))
        return withDraw()
    }

    if (accountData.balance < amount) { //Checando se o valor armazenado em conta é suficiente para saque
        console.log(chalk.bgRed.black("Valor indisponível para o saque!"))
        return withDraw()
    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)

    fs.writeFileSync(`accounts/${accountName}.json`, JSON.stringify(accountData), function (error) {
        console.log(error)
    })

    console.log(chalk.green(`Foi realizado um saque de R$${amount} da sua conta!`))
    operation()
}







operation()