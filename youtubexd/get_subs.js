function getUserData(tr) {
    let name = tr.children[0].textContent.trim();
    let imgUrl = tr.children[0].querySelector("img").src
    let value = getMoneyData(tr.children[1].textContent)
    let comment = tr.children[2].textContent
    return { "name": name, "imgUrl": imgUrl, "money": value, "comment": comment };
}

function getMoneyData(money) {
    let splitCondition;
    if (money.includes("$")) {
        splitCondition = " $"
    } else if (money.includes(" S/.")) {
        splitCondition = " S/."
    } else if (money.includes(" €")) {
        splitCondition = " €"
    } else { console.log(money) }
    let data = money.split(splitCondition)
    return { "simbol": data[0], "amount": parseInt(data[1].replace(",", "")) }
}

function sumUserChat(allUserData, user) {
    if (allUserData.hasOwnProperty(user["name"])) {
        let actualDonation = user["money"]["amount"];
        allUserData[user["name"]]["money"]["amount"] += actualDonation
        allUserData[user["name"]]["comment"].push(user["comment"])
    } else {
        user["comment"] = Array.of(user["comment"])
        allUserData[user["name"]] = user;
    }
    return allUserData
}

function dictToArray(dict) {
    let auxArr = []
    for (let key in dict) {
        auxArr.push(dict[key])
    }
    return auxArr;
}

let UyuConversion = {
    "COP": 0.012,
    "EUR": 51.65,
    "ARS": 0.50,
    "MXN": 2.15,
    "UYU": 1,
    "PEN": 11.76
}

let DolarConversion = {
    "COP": 0.00029,
    "EUR": 1.22,
    "ARS": 0.012,
    "MXN": 0.051,
    "UYU": 0.024,
    "PEN": 0.28
}

function convertTo(simbol, money, final) {
    if (final == "UYU") {
        return UyuConversion[simbol] * money
    }
    if (final == "DOLAR") {
        return DolarConversion[simbol] * money
    }
}

let userSuperChat = document.querySelectorAll("#dialog > div.content.style-scope.ytcp-dialog > div > table > tbody > tr")
    //userSuperChat[0].remove()

let result = [...userSuperChat].map(tr => getUserData(tr))

let allDonation = result.reduce(sumUserChat, {})

//Obtener las monedas
//let allSimbol = new Set(auxArr.map(x => x["money"]["simbol"]))

allDonation = dictToArray(allDonation)

allDonation.map(user => user["UYU"] = convertTo(user["money"]["simbol"], user["money"]["amount"], "UYU"))
allDonation.map(user => user["DOLAR"] = convertTo(user["money"]["simbol"], user["money"]["amount"], "DOLAR"))

allDonation.sort(function(a, b) {
    return b["DOLAR"] - a["DOLAR"];
});

let nameAndDolar = allDonation.map(result => {
    return { "nombre": result["name"], "cantidad": result["DOLAR"], "imgUrl": result["imgUrl"] }
})


function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}
download(JSON.stringify(nameAndDolar), 'userSuperChat.json', 'text/plain');