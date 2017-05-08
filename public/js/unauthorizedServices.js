function getLoginTemplate() {
    return `<div class="container login">
                <div class="row">
                    <div class="col s12 m6 offset-m3 app-logo">
                        <h2 class="app-name authentication-page-header">Slick Notes</h2>
                    </div>
                </div>
                <div class="row">
                    <div class="col s12 m6 offset-m3 login-content">
                            <form method="post" action="/login" class="login-form">
                                <fieldset name="login-form">
                                    <label class="login-label">Username</label>
                                    <input type="text" name="username" class="login-field" placeholder="johnsmith28" required />
                                    <label class="login-label">Password</label>
                                    <input type="password" name="password" class="login-field" required />
                                    <button type="submit" class="authentication-button login">Login</button>
                                </fieldset>
                            </form>
                            <a href="#" class="signup-login-links-container get-signup">Sign Up</a>
                    </div>
                </div>
            </div>`
}

function getSignupTemplate() {
    return `<div class="container signup">
                <div class="row">
                    <div class="col s12 m6 offset-m3 app-logo">
                        <h2 class="app-name authentication-page-header">Slick Notes</h2>
                    </div>
                </div>
                <div class="row">
                    <div class="col s12 m6 offset-m3 signup-content">
                        <form method="post" action="/users" class="signup-form">
                            <fieldset name="signup-form">
                                <label class="signup-label">Email</label>
                                <input type="text" name="email" class="signup-field" placeholder="foo@bar.com" required />
                                <label class="signup-label">Username</label>
                                <input type="text" name="username" class="signup-field" placeholder="johnsmith123" required />
                                <label class="signup-label">Password</label>
                                <input type="password" name="password" class="signup-field" required />
                                <label class="signup-label">Confirm Password</label>
                                <input type="password" name="passwordConfirmation" class="signup-field" required />
                                <button class="authentication-button signup" type="submit">Sign Up</button>
                            </fieldset>
                        </form>
                        <a href="#" class="signup-login-links-container get-login">Login</a>
                    </div>
                </div>
            </div>`
}

var noteFormattingServices = {
    noteFormatter: function (string) {
        var lineBreak = '<br>';
        var brString = string.replace(/\n/g, lineBreak);
        function spaceRecognizer(brString) {
            var nbSpace = '&nbsp;';
            var fullyFormattedStr = brString.replace(/\s/g, nbSpace);
            return fullyFormattedStr;
        }
        return spaceRecognizer(brString);
    },

    editorFormatter: function (string) {
        var lineBreak = '\n';
        var brString = string.replace(/<br>/g, lineBreak);
        function spaceRecognizer(brString) {
            var editorSpace = ' ';
            var formattedEditor = brString.replace(/&nbsp;/g, editorSpace);
            return formattedEditor;
        }
        return spaceRecognizer(brString);
    },

    highlight: function (string) {
        //add yellow highlighting when two tick marks are encloessed by anothed
        //two tick marks
        $('div.highlighted-error').hide();
        var stringCharacters = string.split('');
        var tick = '`';
        var tickCounter = 0;
        for (var i=0, length=stringCharacters.length; i<length; i++) {
            var currentCharacter = stringCharacters[i];
            var nextCharacter = stringCharacters[i+1];
            if (currentCharacter===tick && nextCharacter===tick) {
                tickCounter += 1;
                if (tickCounter % 2 !== 0) {
                    stringCharacters.splice(i, 1, '<span class="highlighted">')
                    stringCharacters.splice(i+1, 1);
                }
                else { 
                    stringCharacters.splice(i, 1, '</span>')
                    stringCharacters.splice(i+1, 1);
                } 
            }
        }
    
        if (tickCounter % 2 !== 0) {
            return false
        }
        return stringCharacters.join('');
    },

    removeHighlighter: function (string) {
        var removeOpeningTags = string.replace(/<span class="highlighted">/g, '``');
        function removeClosingTags(string) {
            var textString = string.replace(/<\/span>/g, '``');
            return textString;
        }
        return removeClosingTags(removeOpeningTags);
    }

}

var appTemplates = {

    ticks: '``',

    getUserHome: function () {
        event.preventDefault();
        //get mock data in json like format... simulating when real user logs in.
        var notes = state.users[0].userNotes;
        var userHomeHTML = '';
        notes.forEach(function (note) {
            userHomeHTML  += appTemplates.createNoteFeed(note);
        })
        $('section').html(appTemplates.getNavTemp());
        $('main').html('<div class="user-home-container"><div class="container">' + userHomeHTML + '</div></div>');
        window.setTimeout(function() {
          $(".button-collapse").sideNav(); 
            $('.parallax').parallax();
            $(".dropdown-button").dropdown({
                hover: false
            })  
        }, 0)
    },

    getNewNoteTemp: function () {
            return  `<div class="note-container container">    
                        <div class="row">    
                            <div class="col s12 m10 offset-m1">
                                <div class="edit-title-container create-note-title">
                                    <label class="new-note-label">Title:</label>
                                    <input type="text" id="new-title" placeholder="ex. Today's Class" />
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col s12 m10 offset-m1">
                                <div class="editing-note-container create-note-content">
                                    <div class="tips">
                                        Tip: Hightlight word with backticks. ${this.ticks}highlighted word${this.ticks}
                                        <a href="#" class="hide-tip"><i class="material-icons right">done</i></a>
                                    </div>
                                    <div class="note-error-message">PLEASE MAKE SURE NOTE TO LEAVE A BLANK NOTE!</div>
                                    <div class="highlighted-error">PLEASE MAKE SURE ALL TICKS ARE INCLUDED IF HIGHLIGHTING.</div>
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
                <div class="container note-container">
                    <div class="row">
                        <div class="col s12 m10 offset-m1">
                            <div class="note-title">${title}</div>    
                            <div class="edit-title-container" style="display: none;">
                                <input type="text" id="edit-title" />
                                <button type="submit" id="update-title">Update</button>
                                <button id="cancel-update">Cancel</button>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col s12 m10 offset-m1">
                            <div class="note hide-note">${content}</div>
                            <div class="editing-note-container" style="display: none;">
                                <div class="tips">
                                    Tips: Hightlight using backticks: ${this.ticks}highlighted word${this.ticks}
                                    <a href="#" class="hide-tip"><i class="material-icons right">done</i></a>
                                </div>
                                <div class="note-error-message">PLEASE MAKE SURE NOTE TO LEAVE A BLANK NOTE!</div>
                                <div class="highlighted-error">PLEASE MAKE SURE ALL TICKS ARE INCLUDED IF HIGHLIGHTING.</div>
                                <textarea id="edit-note" class="note-editor"></textarea>
                                <div class="save-button-container"><button class="save-note">Save</button></div>
                            </div>
                        </div>
                    </div>
                </div>`
    },

    getEditTemp: function (noteId, title, content) {
        return `<div class="note-id">${noteId}</div>
                <div class="container note-container">
                    <div class="row">
                        <div class="col s12 m10 offset-m1">
                            <div class="note-title">${title}</div>    
                            <div class="edit-title-container" style="display: none;">
                                <input type="text" id="edit-title" />
                                <button type="submit" id="update-title" class="update-title-button">Update</button>
                                <button id="cancel-update" class="update-title-button">Cancel</button>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col s12 m10 offset-m1">
                            <div class="note hide-note"></div>
                            <div class="editing-note-container">
                                <div class="tips">
                                    Tip: Hightlight word with backticks. ${this.ticks}highlighted word${this.ticks}
                                    <a href="#" class="hide-tip"><i class="material-icons right">done</i></a>
                                </div>  
                                <div class="note-error-message">PLEASE MAKE SURE NOTE TO LEAVE A BLANK NOTE!</div>
                                <div class="highlighted-error">PLEASE MAKE SURE ALL TICKS ARE INCLUDED IF HIGHLIGHTING.</div>
                                <textarea id="edit-note" class="note-editor">${content}</textarea>
                                <div class="save-button-container"><button class="save-note">Save</button></div>
                            </div>
                        </div>
                    </div>
                </div>`
    },

    getNavTemp: function() {
        return `<nav><a href="#" data-activates="slide-out" class="menu button-collapse"><i class="material-icons">reorder</i></a>
                    <ul id="slide-out" class="side-nav">
                        <li>
                            <a href="#!" class="home demo-home nav-button">Home</a>
                        </li>
                        <li>
                            <a href="#" class="new-note-button demo-new-note nav-button">New Note</a>
                        </li>
                        <li>
                            <div class="divider"></div>
                        </li>
                    </ul>

                    <a hre="#" class="home get-demo nav-button mobile-logo center">Slick Note</a>
                    <ul class="medium-viewport-nav right">
                        <li class="medium-view nav-button">
                            <a href="#!" class="home demo-home nav-button">Home</a>
                        </li>
                        <li class="medium-view nav-button">
                            <a href="#!" class="new-note-button demo-new-note nav-button">New Note</a>
                        </li>
                    </ul></nav> `
    },

    createNoteFeed: function(note) {
    let content = noteFormattingServices.highlight(note.content);
        return  `<div class="row">
            <div class="col s12 m10 offset-m1">
            <div class="card user-note">
                <div class="card-content">
                    <div class="note-id" style="display: none;">${note.id}</div>
                    <div class="row">
                        <div class="col s10">
                            <span class="card-title grey-text text-darken-4">${note.title}</span>
                        </div>
                        <div class="col s2">
                            <span class="activator"><i class="material-icons right">more_vert</i></span>
                        </div>
                    </div>
                    <p class="card-links">
                        <a href="#" class="edit"><i class="material-icons link-options">mode_edit</i></a>
                        <a href="#" class="delete"><i class="material-icons link-options">delete</i></a>
                    </p>
                    <p class="deletion-question" style="display: none;">Are You Sure?<a href="#" class="confirm-delete">Yes</a></p>
                </div>
                <div class="card-reveal">
                    <span class="card-title grey-text text-darken-4">${note.title}<i class="material-icons right">close</i></span>
                    <p>${content}</p>
                </div>
            </div>
            </div>
            </div>`
    }
}