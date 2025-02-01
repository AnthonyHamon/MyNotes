let title = [];
let text = [];
let fullNote = [];
let trash = [];
let NotesTitleTrash = [];
let NotesTextTrash = [];

function showMenu() {
    const notice = document.getElementById('notice');
    const trash = document.getElementById('trash');
    notice.classList.toggle('showText');
    trash.classList.toggle('showText');
};

function toggleOverlay(){
    showOverlay();
    hideOverlay();
}

function showOverlay() {
    document.getElementById('hoverMenu').addEventListener("mouseover", function (){
        const notice = document.getElementById('notice');
        const trash = document.getElementById('trash');
        notice.classList.add('showText');
        trash.classList.add('showText');
    })
};

function hideOverlay() {
    document.getElementById('hoverMenu').addEventListener("mouseout", function(){
        const notice = document.getElementById('notice');
        const trash = document.getElementById('trash');
        notice.classList.remove('showText');
        trash.classList.remove('showText');
    })
};

function hideBgNote(i){
    document.getElementById(`currentNote${i}`).classList.add('hideNote')
};

function showBgNote(i){
    document.getElementById(`currentNote${i}`).classList.remove('hideNote')
};

function resetBg() {
    document.getElementById('page-bg').classList.add('d-none');
}

function showHiddenElements(i){
    showBgNote(i);
    resetBg();
}

function addEventListener(){
    document.getElementById('noteField').addEventListener("click", (function(e) {
        document.getElementById('page-bg').classList.remove('d-none');
        e.stopPropagation();
    }));
    document.getElementById('currentNoteButton').addEventListener("click", (function(e) {
        document.getElementById('page-bg').classList.add('d-none');
        e.stopPropagation();
    }));
    document.getElementById('closeOpenedNote').addEventListener("click", (function(e) {
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
    if (noDisplay.length > 0){
// if class "d-none" doesn't exist, class "hide" will be added to choosen element
    let title = document.getElementById('titlesInput');
    title.classList.add('hide');
    let button = document.getElementById('buttonInput');
    button.classList.add('hide');
}};

// section about adding, saving & rendering Notes

function addNote(i) {
    
    let titleInput = document.getElementById('titlesInput').value;
    let textInput = document.getElementById('textInput').value;
    title.push(titleInput);
    text.push(textInput);
    let currentNote = document.getElementById(`currentNote${i}`);
    fullNote.push(currentNote);
    document.getElementById('titlesInput').value = '';
    document.getElementById('textInput').value = '';
    saveFullNoteArray();
    renderNote();
}

function renderNote() {
    loadNotes();
    loadTrash();
    document.getElementById('changeMainPage').innerHTML = '';
    for (let i = 0; i < fullNote.length; i++) {
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

            <div id="closeOpenedNote" class="openNoteButtons">
                <div id="trashImg" class="trashImg">  
                    <img onclick="deleteNote(${i})" src="img/trash-2-48.png" alt=""> 
                </div>
                    <button onclick="saveChanges(${i})" id="currentNoteButton" class="noteButton">Schließen</button>
            </div>
        </div>
    `;
 
    addEventListener();
    hideBgNote(i);
};

function saveChanges(i){
    let newTitleValue = document.getElementById('titleField').value; // or textContent?
    let newTextValue = document.getElementById('textField').value; // or textContent?
    title.splice(i, 1, newTitleValue);
    text.splice(i, 1, newTextValue);
    saveFullNoteArray();
    showHiddenElements(i);
// set timeOut in order to let time for transition to happen (function showBgNote()).
    setTimeout(renderNote, 225);
}

function emptyMainPage(){
// check fullNote array, if empty, show original main page.
    if(fullNote.length === 0){
        document.getElementById('changeMainPage').innerHTML= 
        `
        <div class="pageDescription">
            <img src="img/note-2-128.png" alt="">
            <span>Hinzugefügte Notizen werden hier angezeigt</span>
        </div>
        `;
    }
    // problem when the first Note is deleted before the other one
}

function saveFullNoteArray(){
    let fullNoteAsText = JSON.stringify(fullNote);
    localStorage.setItem('fullNote', fullNoteAsText);
    let titleAsText = JSON.stringify(title);
    localStorage.setItem('title', titleAsText);
    let textAsText = JSON.stringify(text);
    localStorage.setItem('text', textAsText);
}

function loadNotes(){
    let fullNoteAsText = localStorage.getItem('fullNote');
    let titleAsText = localStorage.getItem('title');
    let textAsText = localStorage.getItem('text');
    if(fullNoteAsText && titleAsText && textAsText) {
        fullNote = JSON.parse(fullNoteAsText);
        title = JSON.parse(titleAsText);
        text = JSON.parse(textAsText);
    }
}

// Section about deleting Notes and rendering Trash

function deleteNote(i){
    let currentNote = document.getElementById(`currentNote${i}`);
    currentNote.parentNode.removeChild(currentNote);
    trash.push(fullNote[i]);
    NotesTitleTrash.push(title[i]);
    NotesTextTrash.push(text[i]);
    saveToTrash();
    fullNote.splice(i, 1);
    title.splice(i, 1);
    text.splice(i, 1);
    saveFullNoteArray();
    resetBg();
    emptyMainPage();
    
}

function renderTrash(){
    loadTrash();
    document.getElementById('mainTrashPage').innerHTML = '';
    emptyTrashPage();
    for (let i = 0; i < trash.length; i++) {
    document.getElementById('mainTrashPage').innerHTML += 
    `
        <div id="currentNote${i}" class="notes">
            <textarea readonly onclick="openNote(${i})" class="titleField" name="" cols="30" rows="20">${NotesTitleTrash[i]}</textarea>
            <textarea readonly onclick="openNote(${i})" name="" cols="30" rows="20">${NotesTextTrash[i]}</textarea>
        <div class="deleteTrash"><img onclick="deleteNote4Ever(${i})" id="deleteTrashImg" src="img/trash-2-48.png" alt=""></div>
    `;
    }
}

function saveToTrash(){
    let trashAsText = JSON.stringify(trash);
    localStorage.setItem('trash', trashAsText);
    let NotesTitleTrashAsText = JSON.stringify(NotesTitleTrash);
    localStorage.setItem('NotesTitleTrash', NotesTitleTrashAsText);
    let NotesTextTrashAsText = JSON.stringify(NotesTextTrash);
    localStorage.setItem('NotesTextTrash', NotesTextTrashAsText);
}

function loadTrash() {
    let trashAsText = localStorage.getItem('trash');
    let NotesTitleTrashAsText = localStorage.getItem('NotesTitleTrash');
    let NotesTextTrashAsText = localStorage.getItem('NotesTextTrash');
    if(trashAsText && NotesTitleTrashAsText && NotesTextTrashAsText){
        trash = JSON.parse(trashAsText);
        NotesTitleTrash = JSON.parse(NotesTitleTrashAsText);
        NotesTextTrash = JSON.parse(NotesTextTrashAsText);
    }
}

function deleteNote4Ever(i){
    trash.splice(i, 1);
    NotesTitleTrash.splice(i, 1);
    NotesTextTrash.splice(i, 1);
    saveToTrash();
    let currentNote = document.getElementById(`currentNote${i}`);
    currentNote.parentNode.removeChild(currentNote);
}

function emptyTrashPage(){
    if(trash.length === 0){
        document.getElementById('mainTrashPage').innerHTML= 
        `
        <div class="pageDescription">
            <img src="img/trash-2-128.png" alt="">
            <span>Gelöschten Notizen können wieder hinzugefügt werden</span>
        </div>
        `;
    }
}