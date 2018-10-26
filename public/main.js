function balance(){
    var bal = document.getElementsByClassName('hero-display__balance');
    if (bal[0].style.display === "none") {
        bal[0].style.display = "block";
    } else {
        bal[0].style.display = "none";
    }
}

function withdraw(){
    var wit = document.getElementsByClassName('hero-display__withdraw');
    if (wit[0].style.display === "none") {
        wit[0].style.display = "block";
    } else {
        wit[0].style.display = "none";
    }
}

function deposit(){
    var dep = document.getElementsByClassName('hero-display__deposit');
    if (dep[0].style.display === "none") {
        dep[0].style.display = "block";
    } else {
        dep[0].style.display = "none";
    }
}