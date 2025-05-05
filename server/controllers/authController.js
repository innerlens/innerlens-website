import { verifyGoogleJwt } from '../services/authService.js';
import { createUser } from '../services/userService.js';

export async function getGoogleJwt(req, res) {

    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Missing auth code' });
    }

    try {
      const params = new URLSearchParams({
        code: code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      });

      console.log(params.toString())
      console.log("")
  
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (!response.ok) {
        return res.status(response.status).json(await response.json());
      }
  
      const { id_token : jwt } = await response.json();
      const payload = await verifyGoogleJwt(jwt);
  
      const { sub, email, name } = payload;
      const user = await createUser(sub, name, email);

      // return jwt
      res.json({ jwt });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: `Google OAuth failed: ${err}` });
    }
}
