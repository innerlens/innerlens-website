import { verifyGoogleJwt } from "../services/authService.js";
import { userRepository } from "../repositories/userRepository.js";
import { HTTP_STATUS } from "../utils/httpStatus.js";

export async function getGoogleJwt(req, res) {
	try {
		const { code } = req.body;
		console.log('Trying to get jwt');

		const params = new URLSearchParams({
			code: code,
			client_id: process.env.GOOGLE_CLIENT_ID,
			client_secret: process.env.GOOGLE_CLIENT_SECRET,
			redirect_uri: process.env.GOOGLE_REDIRECT_URI,
			grant_type: "authorization_code",
		});

		const response = await fetch("https://oauth2.googleapis.com/token", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: params.toString(),
		});

		if (!response.ok)
			return res
				.status(HTTP_STATUS.BAD_REQUEST)
				.json({ error: "Invalid auth code" });

		const { id_token: jwt } = await response.json();
		console.log(`Successfully retrieved JWT token: ${jwt}`);

		const payload = await verifyGoogleJwt(jwt);
		const { sub, email, name } = payload;

		// check if user exists
		const existingUser = await userRepository.findByKey("google_sub", sub);
		if (!existingUser) {
			await userRepository.create({
				google_sub: sub,
				username: name,
				email: email,
			});
		}

		// return jwt
		res.status(HTTP_STATUS.OK).json({ jwt });
	} catch (err) {
		console.error("Google Oauth failed:", err);
		res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
			error: `Google OAuth failed: ${err}`,
		});
	}
}
