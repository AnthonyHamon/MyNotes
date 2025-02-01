let title = [];
let text = [];
let NotesTitleTrash = [];
let NotesTextTrash = [];

function showMenu() {
    const notice = document.getElementById('notice');
    const trash = document.getElementById('trash');
    notice.classList.toggle('showText');
    trash.classList.toggle('showText');
};

function toggleOverlay() {
    showOverlay();
    hideOverlay();
}

function showOverlay() {
    document.getElementById('hoverMenu').addEventListener("mouseover", function () {
        const notice = document.getElementById('notice');
        const trash = document.getElementById('trash');
        notice.classList.add('showText');
        trash.classList.add('showText');
    })
};

function hideOverlay() {
    document.getElementById('hoverMenu').addEventListener("mouseout", function () {
        const notice = document.getElementById('notice');
        const trash = document.getElementById('trash');
        notice.classList.remove('showText');
        trash.classList.remove('showText');
    })
};

function hideBgNote(i) {
    document.getElementById(`currentNote${i}`).classList.add('hideNote');
};

function showBgNote(i) {
    document.getElementById(`currentNote${i}`).classList.remove('hideNote');
};

function resetBg() {
    document.getElementById('page-bg').classList.add('d-none');
}

function showHiddenElements(i) {
    showBgNote(i);
    resetBg();
}

function addEventListener() {
    // allow user to interact with opened Note and let note open thanks e.stopPropagation
    document.getElementById('noteField').addEventListener("click", (function (e) {
        document.getElementById('page-bg').classList.remove('d-none');
        e.stopPropagation();
    }));
    // allow buttton to close the opened Note
    document.getElementById('currentNoteButton').addEventListener("click", (function (e) {
        document.getElementById('page-bg').classList.add('d-none');
        e.stopPropagation();
    }));
    // 
    document.getElementById('trashButton').addEventListener("click", (function (e) {
        document.getElementById('page-bg').classList.add('d-none');
        e.stopPropagation();
    })); 

    document.getElementById('titleField').addEventListener("keypress", function(event){
        if (event.shiftKey){
        }else{
           if (event.key === "Enter"){
            event.preventDefault();
            document.getElementById('currentNoteButton').click();
        }
    }
    });

    document.getElementById('textField').addEventListener("keypress", function(event){
        if (event.shiftKey){
        }else{
           if (event.key === "Enter"){
            event.preventDefault();
            document.getElementById('currentNoteButton').click();
        }
    }
    });

    document.getElementById('page-bg').addEventListener("click", (function (e) {
        document.getElementById('page-bg').classList.add('d-none');
        e.stopPropagation();
    }));
 
}

// onclick of the input shows full inputfield

function showFullInput() {
    document.getElementById('clickable').addEventListener("click", (function (e) {
        let title = document.getElementById('notesTitle');
        title.classList.remove('hide');
        let button = document.getElementById('buttonInput');
        button.classList.remove('hide');
        e.stopPropagation();
    }));
}

// reset inputfield to original form

function resetNotesInput() {
    // check if class d-none already exist
    let noDisplay = document.getElementsByClassName('d-none');
    if (noDisplay.length > 0) {
        // if class "d-none" doesn't exist, class "hide" will be added to choosen element
        let title = document.getElementById('titlesInput');
        title.classList.add('hide');
        let button = document.getElementById('buttonInput');
        button.classList.add('hide');
    }
};

// section about adding, saving & rendering Notes

function addNote() {

    let titleInput = document.getElementById('titlesInput').value;
    let textInput = document.getElementById('textInput').value;
    if (textInput == '' && titleInput == ''){
        alert("Füge bitte keine leere Notize hinzu.");
    }else{
    title.push(titleInput);
    text.push(textInput);
    document.getElementById('titlesInput').value = '';
    document.getElementById('textInput').value = '';
    setLocalStorage();
    renderNote();
    }
}

function renderNote() {
    getLocalStorage();
    document.getElementById('changeMainPage').innerHTML = '';
    for (let i = 0; i < text.length; i++) {
        document.getElementById('changeMainPage').innerHTML +=
            `
        <div id="currentNote${i}" class="notes">
            <textarea readonly onclick="openNote(${i})" class="titleField" name="" cols="30" rows="20">${title[i]}</textarea>
            <textarea readonly onclick="openNote(${i})" name="" cols="30" rows="20">${text[i]}</textarea>
            <div class="deleteTrash"><img onclick="deleteNote(${i})" id="deleteTrashImg" src="img/trash-2-48.png" alt=""></div>
        </div>
    `;
    }
    emptyMainPage();
}

function openNote(i) {

    document.getElementById('page-bg').classList.remove('d-none');

    document.getElementById('page-bg').innerHTML =
        `
        <div id= "openedNote" class="openedNote">
            <div class="openedNote" id="noteField">
                <textarea id="titleField" class="titleField" name="" cols="30" rows="20">${title[i]}</textarea>
                <textarea id="textField" name="" cols="30" rows="20">${text[i]}</textarea>
            </div>

            <div class="openNoteButtons">
                <div id="trashImg" class="trashImg">  
                    <img onclick="deleteNote(${i})" id="trashButton" src="img/trash-2-48.png" alt=""> 
                </div>
                    <button onclick="saveChanges(${i})" id="currentNoteButton" class="noteButton">Speichern & Schließen</button>
            </div>
        </div>
    `;

    addEventListener();
    hideBgNote(i);
};

function saveChanges(i) {
    let newTitleValue = document.getElementById('titleField').value; // or textContent?
    let newTextValue = document.getElementById('textField').value; // or textContent?
    title.splice(i, 1, newTitleValue);
    text.splice(i, 1, newTextValue);
    setLocalStorage();
    showHiddenElements(i);
    // set timeOut in order to let time for transition to happen (function showBgNote()).
    setTimeout(renderNote, 225);
}

function abort(){
    addEventListener()
    setTimeout(renderNote, 175); 
}

function emptyMainPage() {
    // check fullNote array, if empty, show original main page.
    if (text.length === 0) {
        document.getElementById('changeMainPage').innerHTML =
            `
        <div class="pageDescription">
            <img src="img/note-2-128.png" alt="">
            <span>Hinzugefügte Notizen werden hier angezeigt</span>
        </div>
        `;
    }
}


// Section about deleting Notes and rendering Trash

function deleteNote(i) {
    NotesTitleTrash.push(title[i]);
    NotesTextTrash.push(text[i]);
    title.splice(i, 1);
    text.splice(i, 1);
    setLocalStorage();
    getLocalStorage();
    renderNote();
    resetBg();
    emptyMainPage();

}
function renderTrash() {
    getLocalStorage();
    document.getElementById('changeTrashPage').innerHTML = '';
    emptyTrashPage();
    for (let i = 0; i < NotesTextTrash.length; i++) {
        document.getElementById('changeTrashPage').innerHTML +=
            `
        <div id="currentNote${i}" class="notes">
            <textarea readonly class="titleField" name="" cols="30" rows="20">${NotesTitleTrash[i]}</textarea>
            <textarea readonly name="" cols="30" rows="20">${NotesTextTrash[i]}</textarea>
        <div class="deleteTrash"><img onclick="deleteNote4Ever(${i})" id="deleteTrashImg" src="img/trash-2-48.png" alt=""></div>
    `;
    }
}

function setLocalStorage() {
    // localStorage for Notes on the main Page
    let titleAsText = JSON.stringify(title);
    localStorage.setItem('title', titleAsText);
    let textAsText = JSON.stringify(text);
    localStorage.setItem('text', textAsText);

    // set localStorage for Notes on the trash Page
    let NotesTitleTrashAsText = JSON.stringify(NotesTitleTrash);
    localStorage.setItem('NotesTitleTrash', NotesTitleTrashAsText);
    let NotesTextTrashAsText = JSON.stringify(NotesTextTrash);
    localStorage.setItem('NotesTextTrash', NotesTextTrashAsText);
}

function getLocalStorage() {
    // get localStorage for Notes on the main Page
    let titleAsText = localStorage.getItem('title');
    let textAsText = localStorage.getItem('text');
    if (titleAsText && textAsText) {
        title = JSON.parse(titleAsText);
        text = JSON.parse(textAsText);
    }

    // get localStorage for Notes on the trash Page
    let NotesTitleTrashAsText = localStorage.getItem('NotesTitleTrash');
    let NotesTextTrashAsText = localStorage.getItem('NotesTextTrash');
    if (NotesTitleTrashAsText && NotesTextTrashAsText) {
        NotesTitleTrash = JSON.parse(NotesTitleTrashAsText);
        NotesTextTrash = JSON.parse(NotesTextTrashAsText);
    }
}

function deleteNote4Ever(i) {
    NotesTitleTrash.splice(i, 1);
    NotesTextTrash.splice(i, 1);
    setLocalStorage();
    renderTrash();
}

function emptyTrashPage() {
    if (NotesTextTrash.length === 0) {
        document.getElementById('changeTrashPage').innerHTML =
            `
        <div class="pageDescription">
            <img src="img/trash-2-128.png" alt="">
            <span>Gelöschten Notizen können wieder hinzugefügt werden</span>
        </div>
        `;
    }
}