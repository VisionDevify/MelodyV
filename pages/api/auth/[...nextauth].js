import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import spotifyAPI, { LOGIN_URL } from "../../../lib/spotify"

async function refreshAccessToken(token) {
    try{
        spotifyAPI.setAccessToken(token.accessToken)
        spotifyAPI.setRefreshToken(token.refreshToken)

        const { body: refreshedToken } = await spotifyAPI.refreshAccessToken()
        console.log('REFRESHED TOKEN IS', refreshedToken);

        return {
            ...token,
            accessToken: refreshedToken.access_token,
            accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
        }
    } catch(error) {
        console.log(error)

        return {
            ...token,
            error: 'RefreshAccessTokenError'
        }
    }
}
export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
      signIn: '/login'
  },
  callbacks: {
      async jwt({ token, account, user }){
          if(account && user) {
              return {
                  ...token,
                  accessToken: account.access_token,
                  refreshToken: account.refresh_token,
                  username: account.providerAccountId,
                  accountTokenExpires: account.expires_at * 1000, // I am handling expiry times in Milliseconds hence * 1000
              }
          }
          // Returns previous token if access token has not expired yet.
          if(Date.now() < token.accessTokenExpires) {
              console.log('EXISTING ACCESSTOKEN IS VALID...');
              return token;
            }
          // Checks if the access token has expired and refreshes it.   
            console.log('ACCESS TOKEN HAS EXPIRED, REFRESHING...')
            return await refreshAccessToken(token)
      },

      async session({ session, token }) {
          session.user.accessToken = token.accessToken;
          session.user.refreshToken = token.refreshToken;
          session.user.username = token.username;
          return session;
      }
  }
})