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

function getNoteTemplate() {
	//template for the actual note taking of the application
	//couldn't think of a better name for now.!
	return `<div class="section-container js-hide-sections">
			</div>
			<div class="note-container">
				<div class="note-options">
					<span>New Section</span>
					<span>New SubSection</span>
				</div>
				<div class="note">
				</div>
				<textarea class="note js-edit-note"></textarea>
				<button class="save-note js-save-note">Save</button>
			</div>
			`
}