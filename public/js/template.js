var appTemplates = {

    getNewNoteTemp: function () {
            return  `<div class="note-container container">    
                        <div class="row">    
                            <div class="col s12 m6">
                                <div class="edit-title-container create-note-title">
                                    <label class="new-note-label">Title:</label>
                                    <input type="text" id="new-title" placeholder="ex. Today's Class" />
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col s12 m6">
                                <div class="editing-note-container create-note-content">
                                    <div class="note-error-message">PLEASE MAKE SURE NOTE TO LEAVE A BLANK NOTE!</div>
                                    <label class="new-note-label">Note:</label>
                                    <textarea id="new-note" class="note-editor" placeholder="ex. Today was fun. I learned nothing."></textarea>
                                    <div class="create-button-container"><button class="create-note">Create</button></div>
                                </div>
                            </div>
                        </div>
                    </div>`
    },

    //The next two functions should be refactored 
    getNoteTemp: function (noteId, title, content) {
        return `<div class="note-id">${noteId}</div>
                <div class="note-container container">
                    <div class="row">
                        <div class="col s12">
                            <div class="note-title">${title}</div>    
                            <div class="edit-title-container" style="display: none;">
                                <input type="text" id="edit-title" />
                                <button type="submit" id="update-title">Update</button>
                                <button id="cancel-update">Cancel</button>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col s12">
                            <div class="note hide-note">${content}</div>
                            <div class="editing-note-container" style="display: none;">
                                <div class="note-error-message">PLEASE MAKE SURE NOTE TO LEAVE A BLANK NOTE!</div>
                                <textarea id="edit-note" class="note-editor"></textarea>
                                <div class="save-button-container"><button class="save-note">Save</button></div>
                            </div>
                        </div>
                    </div>
                </div>`
    },

    getEditTemp: function (noteId, title, content) {
        return `<div class="note-id">${noteId}</div>
                <div class="note-container container">
                    <div class="row">
                        <div class="col s12 m6">
                            <div class="note-title">${title}</div>    
                            <div class="edit-title-container" style="display: none;">
                                <input type="text" id="edit-title" />
                                <button type="submit" id="update-title" class="update-title-button">Update</button>
                                <button id="cancel-update" class="update-title-button">Cancel</button>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col s12 m6">
                            <div class="note hide-note"></div>
                            <div class="editing-note-container">
                                <div class="note-error-message">PLEASE MAKE SURE NOTE TO LEAVE A BLANK NOTE!</div>
                                <textarea id="edit-note" class="note-editor">${content}</textarea>
                                <div class="save-button-container"><button class="save-note">Save</button></div>
                            </div>
                        </div>
                    </div>
                </div>`
    }
}