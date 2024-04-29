



class Expense {
    constructor(year, month, day, type, description, value) {
        this.year = year;
        this.month = month;
        this.day = day;
        this.type = type;
        this.description = description;
        this.value = value;
    }

    validateData() {
        for (let i in this) {
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }
        }
        return true
    }
}

class Bd {

    constructor() {
        let id = localStorage.getItem('id');

        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }

    getNextId() {
        let id = localStorage.getItem('id')

        return (parseInt(id) + 1)
    }

    write(expense) {
        let id = this.getNextId()

        localStorage.setItem(id, JSON.stringify(expense))
        localStorage.setItem('id', id)
    }

    recoveryAllRegisters() {
        let id = localStorage.getItem("id")
        //Array de despesas
        let expenses = Array()
        for (let i = 1; i <= id; i++) {

            //recuperar a despesa
            let expense = JSON.parse(localStorage.getItem(i))

            //pular índices inexistentes
            if (expense == null) {
                continue
            }

            expense.id = i

            expenses.push(expense)
        }

        return expenses
    }

    search(expense){
        let filterExpenses = this.recoveryAllRegisters()

        console.log(filterExpenses)
        console.log(expense)

        //year
            if(expense.year != ""){
                console.log("filtro de ano")
                filterExpenses = filterExpenses.filter(d => d.year == expense.year)
            }
        //month
            if(expense.month != ""){
                console.log("filtro de mês")
                filterExpenses = filterExpenses.filter(d => d.month == expense.month)
            }

        //day
            if(expense.day != ""){
                console.log("filtro de dia")
                filterExpenses = filterExpenses.filter(d => d.day == expense.day)
            }

        //type
            if(expense.type != ""){
                console.log("filtro de tipo")
                filterExpenses = filterExpenses.filter(d => d.type == expense.type)
            }

        //description
            if(expense.description != ""){
                console.log("filtro de descrição")
                filterExpenses = filterExpenses.filter(d => d.description == expense.description)
            }

        //value
            if(expense.value != ""){
                console.log("filtro de valor")
                filterExpenses = filterExpenses.filter(d => d.value == expense.value)
            }

            console.log(filterExpenses)
            return filterExpenses
    }

    remove(id){
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

/* Açao de saída do botão da caixa de diálogo*/
function dialogContainerExit() {
    let dialogContainer = document.getElementById("dialog-container")
    dialogContainer.style.display = "none"
}

/* Definição do tipo de mensagem da caixa de diálogo (erro ou sucesso de gravação)*/
function setDialogInformations(verificationResult, dialogInformations) {
    
    let dialogContainer = document.getElementById("dialog-container")
    
    if (verificationResult == true) {
        dialogInformations[0].style.color = "green"
        dialogInformations[0].textContent = "Sucesso de gravação"
        dialogInformations[1].textContent = "Os dados foram gravados com sucesso."
        dialogInformations[2].textContent = "Ok"
        dialogInformations[2].style.background = "green"
        dialogContainer.style.display = "block"
    } else {
        dialogInformations[0].style.color = "red"
        dialogInformations[0].textContent = "Erro de gravação"
        dialogInformations[1].textContent = "Existem campos obrigatórios que não foram preenchidos."
        dialogInformations[2].textContent = "Voltar e corrigir"
        dialogInformations[2].style.background = "red"
        dialogContainer.style.display = "block"
    }
}

function registerExpense() {

    let yearInput = document.getElementById("input-year")
    let monthInput = document.getElementById("input-month")
    let dayInput = document.getElementById("day-input")
    let typeInput = document.getElementById("type-input")
    let descriptionInput = document.getElementById("description-input")
    let valueInput = document.getElementById("value-input")

    //formatação de valor
    let value = valueInput.value.replace(",", ".")
    
    let expense = new Expense(
        yearInput.value,
        monthInput.value,
        dayInput.value,
        typeInput.value,
        descriptionInput.value,
        value
    );

    let verificationResult;
    let dialogInformations = document.querySelectorAll(".dialog-information")

    if (expense.validateData()) {
        bd.write(expense)

        verificationResult = true
        setDialogInformations(verificationResult, dialogInformations)
        /* limpeza das entradas*/
        yearInput.value = ""
        monthInput.value = ""
        dayInput.value = ""
        typeInput.value = ""
        descriptionInput.value = ""
        valueInput.value = ""
    } else {

        verificationResult = false
        setDialogInformations(verificationResult, dialogInformations)
    }

}

function loadExpensesList(expenses = Array(), filter = false) {
    
    if(expenses.length == 0 && filter == false){
        expenses = bd.recoveryAllRegisters()
    }

    //recupera o elemento tbody com id expenses-list e limpa seu conteúdo
    let expensesList = document.getElementById("expenses-list")
    expensesList.innerHTML = ""


    expenses.forEach(function (d) {

        let row = expensesList.insertRow()

        row.insertCell(0).innerHTML = `${d.day}/${d.month}/${d.year}`

        switch (d.type) {
            case '1': d.type = 'alimentação'
                break;
            case '2': d.type = 'educação'
                break;
            case '3': d.type = 'lazer'
                break;
            case '4': d.type = 'saúde'
                break;
            case '5': d.type = 'transporte'
                break;
        }

        row.insertCell(1).innerHTML = d.type
        row.insertCell(2).innerHTML = d.description
        row.insertCell(3).innerHTML = d.value

        let btn = document.createElement("button")
        btn.innerHTML = `<img src="./X-icon.png" width="15px"/>`
        btn.className = "button-delete-item"
        btn.id = `id_expense_${d.id}`
        btn.onclick = () => {
            let id = btn.id.replace("id_expense_", "")
            //alert(id)
            bd.remove(id)
            window.location.reload()
        }

        row.insertCell(4).append(btn)
    })
}

function searchExpense(){
    let year = document.getElementById("input-year").value
    let month = document.getElementById("input-month").value
    let day = document.getElementById("day-input").value
    let type = document.getElementById("type-input").value
    let description = document.getElementById("description-input").value
    let value = document.getElementById("value-input").value

    //formatação de valor
    value = value.replace(",", ".")
    
    let expense = new Expense(year, month, day, type, description, value)

    let expenses = bd.search(expense)

    loadExpensesList(expenses, true)
}

