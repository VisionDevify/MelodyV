import { signIn, useSession } from "next-auth/react"
import { useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_CLIENT_SECRET,
    clientSecret: process.env.NEXT_PUBLIC_CLIENT_ID,
})

function useSpotify() {
    const { data: session, status } = useSession()
    
    useEffect(() => {
        if (session) {
            // If the refesh access token attempt fails it redirects user to login...
            if(session.error === "RefreshAcessTokenError") {
                signIn();
            }

            spotifyApi.setAccessToken(session.user.accessToken)
        }
    }, [session])
    return spotifyApi;
}

export default useSpotify
