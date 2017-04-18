function getNewTemplate() {
	return `<div class="section-container js-hide-sections">
			</div>
			<div class="note-container">
				<form class="new-note">
					<fieldset name="create-note">
						<label>Title</label>	
						<input type="text" name="new-note-title">
						<label>Subtitle</label>
						<input type="text" name="new-note-subtitle">
					</fieldset>
					<button class="create-note">Create Note</button>
				</form>
			</div>
			<button class="show-section-button"> >> </button>`
}

function getNoteTemplate(title, subtitle) {
	//template for the actual note taking of the application
	//couldn't think of a better name for now.!
	return `<div class="title-container">
				<div class="title">
					<span class="title-text">  ${title} </span> 
					<span class="subtitle-text"> ${subtitle} </span> 
				</div>
				<div class="edit-title js-edit-title-hide">  
					<label>title</label>
					<input type="text" name="title" required />
					<label>subtitle</label>
					<input type="text" name="subtitle" required />
					<button class="update-titles">Update</button> 	
				</div> 
			</div>
			<div class="note-container">
				<div class="note js-hide-note">
				</div>
				<textarea class="edit-note"></textarea>
				<button class="save-note">Save</button>
			</div>`
}