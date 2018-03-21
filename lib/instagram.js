"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const credentials = {
    client: {
        id: 'ef35c656b0b84331949d580fa1aaf63c',
        secret: '109532fab5c14d788cff4031d0178da3'
    },
    auth: {
        tokenHost: 'https://api.instagram.com',
        tokenPath: '/oauth/access_token'
    }
};
const oauth2 = require('simple-oauth2').create(credentials);
class Instagram {
    auth(request, response) {
        const state = request.cookies.state || crypto.randomBytes(20).toString('hex');
        // Allow unsecure cookies on localhost.
        const secureCookie = request.get('host').indexOf('localhost:') !== 0;
        response.cookie('state', state.toString(), {
            maxAge: 3600000,
            secure: secureCookie,
            httpOnly: true
        });
        const redirectUri = oauth2.authorizationCode.authorizeURL({
            redirect_uri: `${request.protocol}://${request.get('host')}/instagram-callback`,
            scope: 'basic',
            state: state
        });
        response.redirect(redirectUri);
    }
    instagramCallback(request, response) {
        if (!request.cookies.state) {
            response.status(400).send('State cookie not set or expired. Maybe you took too long to authorize. Please try again.');
            // Check the State Cookie is equal to the state parameter.
        }
        else if (request.cookies.state !== request.query.state) {
            response.status(400).send('State validation failed');
        }
        // Exchange the auth code for an access token.
        oauth2.authorizationCode.getToken({
            code: request.query.code,
            redirect_uri: `${request.protocol}://${request.get('host')}/instagram-callback`
        }).then(results => {
            // We have an Instagram access token and the user identity now.
            const accessToken = results.access_token;
            const instagramUserID = results.user.id;
            const profilePic = results.user.profile_picture;
            const userName = results.user.full_name;
        });
    }
}
exports.Instagram = Instagram;
//# sourceMappingURL=instagram.js.map