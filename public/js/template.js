var appTemplates = {

    getEditTemp: function (noteId, title, content) {
        return `<div class="note-id">${noteId}</div>
                <div class="note-container">
                    <div class="note-title">${title}</div>
                    <input type="text" id="edit-title" />
                    <div class="note hide-note"></div>
                    <div class="editing-note-container">
                        <div class="note-error-message">PLEASE MAKE SURE NOTE TO LEAVE A BLANK NOTE!</div>
                        <textarea id="edit-note">${content}</textarea>
                        <div class="save-button-container"><button class="save-note">Save</button></div>
                    </div>
                </div>`
    },

    getNewNoteTemp: function (noteId) {
            return  `<div class="row">
                        <div class="col-12 header-container">
                            <!--this will be hidden at first -->
                            <div class="emtpy-titles-error">PLEASE FILL OUT BOTH FIELDS!</div>
                            <div class="header-name"> 
                                <span class="header-text"></span> 
                            </div>
                            <div class="header-value">  
                                <div class="note-error-message">PLEASE FILL OUT 'Header' Field</div>
                                    <label class="header-label">header</label>
                                    <input type="text" name="header" class="update-header-field" required />
                                    <div class="note-id">${noteId}</div>
                            </div> 
                            <div class="note"></div>
                            <div class="note-error-message">PLEASE MAKE SURE NOTE TO LEAVE A BLANK NOTE!</div>
                            <div class="editing-note-container">
                                <textarea class="edit-note"></textarea>
                                <div class="create-button-container"><button class="create-note">Create Note</button></div>
                            </div>
                        </div>
                    </div>`
    }
}