function getLoginTemplate() {
    return `<div class="container login">
                <div class="row">
                    <div class="col s12 m6 offset-m3 app-logo">
                        <h2 class="app-name authentication-page-header"></h2>
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
                        <h2 class="app-name authentication-page-header"></h2>
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
