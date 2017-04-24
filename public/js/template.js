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
	return `<div class="title-container">
				<div class="title">
					<span class="title-text">  ${title} </span> 
					<span class="subtitle-text"> ${subtitle} </span> 
				</div>
				<div class="edit-title">  
					<label>title</label>
					<input type="text" name="title" required />
					<label>subtitle</label>
					<input type="text" name="subtitle" required />
					<button class="update-titles">Update</button> 	
				</div> 
			</div>
			<div class="note-container">
				<div class="note">
				</div>
				<div class="editing-note-container">
					<textarea class="edit-note"></textarea>
					<button class="save-note">Save</button>
					<div class="note-id">${noteId}</div>
				</div>
			</div>`
}

function getPublishedNoteTemplate(title, subtitle, notes, noteId) {
	//return to this and see if better way. 
	return `<div class="title-container">
				<div class="title">
					<span class="title-text">  ${title} </span> 
					<span class="subtitle-text"> ${subtitle} </span> 
				</div>
				<div class="edit-title">  
					<label>title</label>
					<input type="text" name="title" required />
					<label>subtitle</label>
					<input type="text" name="subtitle" required />
					<button class="update-titles">Update</button> 	
				</div> 
			</div>
			<div class="note-container">
				<!-- notes added so user could read their notes -->
				<div class="note">${notes}</div>
				<!-- hide-edit-note added to render just note so user could read without edit -->
				<div class="editing-note-container hide-edit-note">
					<textarea class="edit-note"></textarea>
					<button class="save-note">Save</button>
					<div class="note-id">${noteId}</div>
				</div>
			</div>`	
}