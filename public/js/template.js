function getNewTitlesTemplate() {
	//before a user creates any notes, 
    //they have to name in order to be more orderly. they can
    //always go back and change it.
    return `<div class="row">
                <div class="note-container">
                    <div class="col-12 titles-content">
                    <form method="post" action="/new-note" class="new-note">
                        <fieldset name="create-note">
                            <label class="title-label">Title</label>    
                            <input type="text" name="title" class="title-field" placeholder="eg. Biology" required />
                            <label class="subtitle-label">Subtitle</label>
                            <input type="text" name="subtitle" class="subtitle-field" placeholder="eg. Life Science For School" required />
                            <button class="start-notes">Start Creating Notes</button>
                        </fieldset>
                    </form>
                </div>
            </div>`
}

function getNewNoteTemplate(noteId) {
	//first rendered with the textarea allowing to edit.
	return  `<div class="row">
                <div class="col-12 header-container">
                    <!--this will be hidden at first -->
                    <div class="header-name"> 
                        <span class="header-text"></span> 
                    </div>
                    <div class="edit-header">  
                        <div class="error-message">PLEASE FILL OUT 'Header' Field</div>
                        <div class="edit-header-container">
                            <label class="header-label">header</label>
                            <input type="text" name="title" class="update-header-field" required />
                        </div>
                        <button class="update-header">Save</button>
                        <div class="note-id">${noteId}</div>
                    </div> 
                </div>
            </div>
            <div class="row">
                <div class="col-12 note-container">
                    <div class="note"></div>
                    <div class="note-error-message">PLEASE MAKE SURE NOTE TO LEAVE A BLANK NOTE!</div>
                    <div class="editing-note-container">
                        <textarea class="edit-note"></textarea>
                        <div class="save-button-container"><button class="save-note">Save</button></div>
                        <div class="note-id">${noteId}</div>
                    </div>
                </div>
            </div>`

}

function getNoteHomeTemplate(title, subtitle, noteId) {
    return `<div class="row">
                <div class="col-12 title-container">
                    <!--this will be hidden at first -->
                    <span class="create-new-section">Create New Sections</span>
                    <span class="sections-button">Note Sections</span>
                    <div class="note-id">${noteId}</div>
                    <div class="sections">
                    </div>
                    <div class="note-id">${noteId}</div>
                    <div class="titles"> 
                        <span class="title-text">${title}</span>  
                        <span class="subtitle-text">${subtitle}</span> 
                    </div>
                    <div class="edit-title">  
                        <div class="error-message">PLEASE FILL OUT BOTH Fields</div>
                        <div class="edit-titles-container">
                            <label class="title-label">title</label>
                            <input type="text" name="title" class="update-title-field" required />
                            <label class="subtitle-label">subtitle</label>
                            <input type="text" name="subtitle" class="update-subtitle-field" required />
                        </div>
                        <button class="update-titles">Save</button>
                        <button class="cancel-update">Cancel</button>
                        <div class="note-id">${noteId}</div>
                    </div> 
                </div>
            </div>`
}

function getNoteTemplate(header, note, noteId) {
	//return to this and see if better way. 
	return `<div class="row">
                <div class="col-12 header-container">
                    <span class="create-new-section">Create New Sections</span>
                    <span class="sections-button">Note Sections</span>
                    <div class="note-id">${noteId}</div>
                    <div class="sections">
                    </div>
                    <div class="header"> 
                        <span class="header-text">${header}</span> 
                    </div>
                    <div class="edit-header">  
                        <div class="error-message">PLEASE FILL OUT BOTH FIELD</div>
                        <div class="edit-header-container">
                            <label class="update-header-label">header</label>
                            <input type="text" name="header" class="update-header-field" required />
                        </div>
                        <button class="update-header">Update</button>
                        <button class="cancel-update">Cancel</button>
                        <!-- note temporarily placed by the button for quick ui swipe -->
                        <div class="note-id">${noteId}</div>
                    </div> 
                </div>
            </div>
            <div class="row">
                <div class="col-12 note-container">
                    <div class="note">${note}</div>
                    <div class="editing-note-container hide-edit-note">
                        <div class="note-error-message">PLEASE MAKE SURE NOTE TO LEAVE A BLANK NOTE!</div>
                        <textarea class="edit-note"></textarea>
                        <div class="save-button-container"><button class="save-note">Save</button></div>
                        <div class="note-id">${noteId}</div>
                    </div>
                </div>
            </div>`	
}