export class LoggedUserModel {

    public constructor(
        public userId: string,
        private _accessToken: string,
        private _accessTokenValidity: Date,
        public name: string,
        public email: string,
        public roles: string[]
        ) {
    }


    get accessToken() {
        if(!this._accessTokenValidity || this._accessTokenValidity < new Date()) {
            return null;
        }
        else {
            return this._accessToken;
        }
    }
}
