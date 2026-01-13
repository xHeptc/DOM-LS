const dataTable = document.querySelector(".data-panel table tbody")
const cartTable = document.querySelector(".cart-panel table tbody")

let dbStorage = JSON.parse(localStorage.getItem("db")) || []

function createTableItem(code, name, quantity){
    const tr = document.createElement("tr")
    const thCode = document.createElement("th")
    const thName = document.createElement("th")
    const thQuantity = document.createElement("th")

    tr.setAttribute("code", code)

    thName.classList.add("item-name")
    thQuantity.classList.add("item-quantity")

    thCode.textContent = code
    thName.textContent = name
    thQuantity.textContent = quantity

    tr.appendChild(thCode)
    tr.appendChild(thName)
    tr.appendChild(thQuantity)

    return tr
}

function getItemFromDB(id){
    return dbStorage.find(item => item.id == id)
}

function saveDB(){
    localStorage.setItem("db", JSON.stringify(dbStorage))
}

function verifyData(data){
    if (!data.id || data.id <= 0){
        return [false, "Invalid code"]
    }

    if (!data.name || data.name === ""){
        return [false, "Invalid name"]
    }

    if (!data.quantity || data.quantity <= 0){
        return [false, "Invalid quantity"]
    }

    return [true, "Success"]
}

function assignItemInDB(data, state){
    const item = getItemFromDB(data.id)
    if (!item) {
        if (state === "editing") {
            alert("Item with this Code does not exist!")
            return
        }

        const [success, error] = verifyData(data)
        if (!success) {
            alert(error)
            return
        }

        dbStorage.push(data)
        const tableItem = createTableItem(data.id, data.name, data.quantity)
        dataTable.appendChild(tableItem)
    } else {
        if (state === "inserting") {
            alert("Item with this Code already exists, try editing instead")
            return
        }

        const [success, error] = verifyData(data)
        if (!success) {
            alert(error)
            return
        }

        Object.assign(item, data)
        const htmlItem = document.querySelectorAll(`[code="${item.id}"]`)
        htmlItem.forEach(html => {
            const htmlName = html.querySelector(".item-name")
            const htmlQuantity = html.querySelector(".item-quantity")
            htmlName.textContent = data.name
            htmlQuantity.textContent = data.quantity
        })
    }

    saveDB()
}

function deleteItemFromDB(id){
    const item = getItemFromDB(id)
    if (!item){
        alert("Item with this code does not exist")
        return
    }

    const htmlItem = document.querySelectorAll(`[code="${item.id}"]`)
    htmlItem.forEach(html => html.remove())
    dbStorage = dbStorage.filter(item => item.id != id)

    saveDB()
}

function putItemInCart(id){
    const item = getItemFromDB(id)
    if (!item){
        alert("Item with this Code does not exist")
        return
    }

    cartTable.appendChild(createTableItem(item.id, item.name, item.quantity))
}

document.addEventListener("submit", (e) => {
    e.preventDefault()
    const btn = e.submitter
    const submitter = btn.value

    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())

    if (submitter == "insert"){
        assignItemInDB(data, "inserting")
    } else if (submitter === "edit"){
        const item = getItemFromDB(data.id)
        if (!item){
            alert("Item with this Code does not exist")
            return
        }

        btn.textContent = "Save & Update"
        btn.value = "save"
        
        const nameInput = document.querySelector('.data-panel [name="name"]')
        const quantityInput = document.querySelector('.data-panel [name="quantity"]')

        nameInput.value = item.name
        quantityInput.value = item.quantity
    } else if (submitter === "save"){
        assignItemInDB(data, "editing")
        btn.value = "edit"
        btn.textContent = "Edit"
    } else if (submitter === "delete"){
        deleteItemFromDB(data.id)
    } else if (submitter == "select"){
        putItemInCart(data.id)
    }
})

Array.from(dbStorage).forEach(item => dataTable.appendChild(createTableItem(item.id, item.name, item.quantity)))