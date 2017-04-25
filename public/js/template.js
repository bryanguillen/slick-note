function getNewTemplate() {
	return `<div class="row">
                <div class="note-container">
                    <div class="col-12 titles-content">
                    <form class="new-note">
                        <fieldset name="create-note">
                            <label class="title-label">Title</label>    
                            <input type="text" name="new-note-title" class="title-field" placeholder="eg. Biology" required />
                            <label class="subtitle-label">Subtitle</label>
                            <input type="text" name="new-note-subtitle" class="subtitle-field" placeholder="eg. Life Science For School" required />
                            <button class="create-note">Create Note</button>
                        </fieldset>
                    </form>
                </div>
            </div>`
}

function getNoteTemplate(title, subtitle, noteId) {
	//template for the actual note taking of the application
	//couldn't think of a better name for now.!
	return  `<div class="row">
                <div class="col-12 title-container">
                    <div class="title">
                        <span class="title-text">${title}</span> 
                        <span class="subtitle-text">${subtitle}</span> 
                    </div>
                    <div class="edit-title">  
                        <div class="error-message">PLEASE FILL OUT BOTH FIELDS</div>
                        <div class="edit-title-container">
                            <label class="update-title-label">title</label>
                            <input type="text" name="title" class="update-title-field" required />
                        </div>
                        <div class="edit-subtitle-container">
                            <label class="update-subtitle-label">subtitle</label>
                            <input type="text" name="subtitle" class="update-subtitle-field" required />   
                        </div>
                        <button class="update-titles">Update</button>
                        <button class="cancel-title-update">Cancel</button>
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

function getPublishedNoteTemplate(title, subtitle, notes, noteId) {
	//return to this and see if better way. 
	return `<div class="row">
                <div class="col-12 title-container">
                    <div class="title">
                        <span class="title-text">${title}</span> 
                        <span class="subtitle-text">${subtitle}</span> 
                    </div>
                    <div class="edit-title">  
                        <div class="error-message">PLEASE FILL OUT BOTH FIELDS</div>
                        <div class="edit-title-container">
                            <label class="update-title-label">title</label>
                            <input type="text" name="title" class="update-title-field" required />
                        </div>
                        <div class="edit-subtitle-container">
                            <label class="update-subtitle-label">subtitle</label>
                            <input type="text" name="subtitle" class="update-subtitle-field" required />   
                        </div>
                        <button class="update-titles">Update</button>
                        <button class="cancel-title-update">Cancel</button>
                        <div class="note-id">${noteId}</div>
                    </div> 
                </div>
            </div>
            <div class="row">
                <div class="col-12 note-container">
                    <div class="note">${notes}</div>
                    <div class="editing-note-container hide-edit-note">
                        <div class="note-error-message">PLEASE MAKE SURE NOTE TO LEAVE A BLANK NOTE!</div>
                        <textarea class="edit-note"></textarea>
                        <div class="save-button-container"><button class="save-note">Save</button></div>
                        <div class="note-id">${noteId}</div>
                    </div>
                </div>
            </div>`	
}
