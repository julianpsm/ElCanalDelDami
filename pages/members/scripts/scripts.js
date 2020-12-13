let membersLi = document.getElementsByClassName("characters")[0]

function loadDoc() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            showMembers(this);
        }
    };
    xhttp.open("GET", "../../members.json", true);
    xhttp.send();
}

function showMembers(xml) {
    let allMembers = JSON.parse(xml.response);
    allMembers.forEach(member => {
        drawMember(member)
    });
}

function drawMember(member) {
    let memberElement = getMemberElement(member);
    membersLi.appendChild(memberElement);

}

function getMemberElement(member) {
    //LI
    let liElement = document.createElement("li");
    liElement.id = member.nombre.replaceAll(" ", "");
    liElement.setAttribute("data-category", member.categoria);

    //H2
    let nameElement = document.createElement("h2");
    nameElement.textContent = member.nombre;
    liElement.appendChild(nameElement);

    //IMG
    let memberProfileImg = document.createElement("IMG");
    memberProfileImg.src = member.imgurl;
    liElement.appendChild(memberProfileImg)
    return liElement;
}

loadDoc();

/*
{ nombre: "El sapo", categoria: "original", imgurl: "https://i.imgur.com/YEGwMLo.png" }


< li id="emma-frost" data - category="miembrosDelCanal">
    < h2> nombre< /h2>
    < img src="imgLink">
 </li>
*/