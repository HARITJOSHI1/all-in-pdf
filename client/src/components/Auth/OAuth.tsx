import { Auth, User } from "firebase/auth";
import { firebase } from "../../firebaseInit";
import {
    GoogleAuthProvider,
    FacebookAuthProvider,
    TwitterAuthProvider,
  } from "firebase/auth";

type OAuthProviders = GoogleAuthProvider | FacebookAuthProvider | TwitterAuthProvider;

export default class OAuthFlow {
  private auth: Auth | null = null;
  constructor(private provider: OAuthProviders){}

  private doOauth = async (auth: Auth) => {
    try {
      const {user} = await firebase.oAuth.method.signInWithPopup(auth, this.provider);
      return user;
    } catch (error) {
      console.log(error);
    }
  };

  async OAuth() {
    this.auth = firebase.auth();
    return await this.doOauth(this.auth) as User;
  }
}
