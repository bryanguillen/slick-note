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