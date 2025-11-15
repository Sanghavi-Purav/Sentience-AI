import { google } from "googleapis";
import { db } from "@/db";
import { account } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function refreshGoogleAccessToken(userId: string) {
  const [googleAccount] = await db
    .select()
    .from(account)
    .where(and(eq(account.userId, userId), eq(account.providerId, "google")));

  if (!googleAccount) {
    throw new Error("Google account not found");
  }

  const now = new Date();
  const expiresAt = googleAccount.accessTokenExpiresAt;

  if (expiresAt && expiresAt > new Date(now.getTime() + 5 * 60 * 1000)) {
    return googleAccount.accessToken!;
  }

  if (!googleAccount.refreshToken) {
    throw new Error("No refresh token");
  }

  try {
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oAuth2Client.setCredentials({
      refresh_token: googleAccount.refreshToken,
    });

    const { credentials } = await oAuth2Client.refreshAccessToken();

    await db
      .update(account)
      .set({
        accessToken: credentials.access_token!,
        accessTokenExpiresAt: credentials.expiry_date
          ? new Date(credentials.expiry_date)
          : null,
        refreshToken: credentials.refresh_token || googleAccount.refreshToken,
        updatedAt: new Date(),
      })
      .where(eq(account.id, googleAccount.id));

    return credentials.access_token!;
  } catch (error) {
    console.error("error refreshing the token", error);
  }
}
