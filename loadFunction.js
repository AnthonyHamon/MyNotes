document.getElementById('clickable').addEventListener("click", (function(e) {
    let title = document.getElementById('titlesInput');
    title.classList.remove('hide');
    let button = document.getElementById('buttonInput');
    button.classList.remove('hide');
    e.stopPropagation();
}));

document.getElementById('clickable').addEventListener("keypress", function(event){
    if (event.key === "Enter"){
        event.preventDefault();
        document.getElementById('buttonInput').click();
    }
})


