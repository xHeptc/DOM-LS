const dataTable = document.querySelector(".data-panel table tbody")
const cartTable = document.querySelector(".cart-panel table tbody")

let dbStorage = JSON.parse(localStorage.getItem("db")) || []
let cartStorage = JSON.parse(localStorage.getItem("cart")) || []

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

function saveCart(){
    localStorage.setItem("cart", JSON.stringify(cartStorage))
}

function verifyData(data){
    console.log(data)

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
        const htmlItem = document.querySelector(`[code="${item.id}"]`)
        console.log(htmlItem)
        const htmlName = htmlItem.querySelector(".item-name")
        const htmlQuantity = htmlItem.querySelector(".item-quantity")
        htmlName.textContent = data.name
        htmlQuantity.textContent = data.quantity
    }

    saveDB()
}

function deleteItemFromDB(id){
    const item = getItemFromDB(id)
    if (!item){
        alert("Item with this code does not exist")
        return
    }

    const htmlItem = document.querySelector(`[code="${item.id}"]`)
    htmlItem.remove()
    dbStorage = dbStorage.filter(item => item.id != id)
    cartStorage = dbStorage.filter(item => item.id != id)
    saveDB()
    saveCart()
}

function putItemInCart(id){
    const item = getItemFromDB(id)
    if (!item){
        alert("Item with this Code does not exist")
        return
    }

    cartStorage.push(item)
    saveCart()
}

document.addEventListener("submit", (e) => {
    e.preventDefault()
    const submitter = e.submitter.value

    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())

    if (submitter == "insert"){
        assignItemInDB(data, "inserting")
    } else if (submitter === "edit"){
        assignItemInDB(data, "editing")
    } else if (submitter === "delete"){
        deleteItemFromDB(data.id)
    } else if (submitter == "select"){
        putItemInCart(data.id)
    }
})

Array.from(dbStorage).forEach(item => dataTable.appendChild(createTableItem(item.id, item.name, item.quantity)))
Array.from(cartStorage).forEach(item => cartTable.appendChild(createTableItem(item.id, item.name, item.quantity)))