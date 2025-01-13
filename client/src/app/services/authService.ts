// src/services/authService.ts
import { InteractiveBrowserCredential } from '@azure/identity'

// Configure Azure AD information
const tenantId = '72f988bf-86f1-41af-91ab-2d7cd011db47' // Azure tenant ID
const clientId = '04b07795-8ddb-461a-bbee-02f9e1bf7b46' // Azure application client ID
const redirectUri = 'http://localhost:3000' // Application redirect URI

export const getAccessToken = async () => {
    try {
        // Initialize InteractiveBrowserCredential
        const credential = new InteractiveBrowserCredential({
            tenantId,
            clientId,
            redirectUri,
        })

        // Get access token
        const tokenResponse = await credential.getToken('https://management.azure.com/.default') // Requested scope
        const accessToken = tokenResponse.token
        console.log('Access Token:', accessToken)

        return accessToken
    } catch (error) {
        console.error('Error obtaining token:', error)
        throw error
    }
}

export const sendTokenToBackend = async (accessToken: string) => {
    try {
        const response = await fetch('<your-backend-api-url>', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`, // Add Bearer Token
            },
            body: JSON.stringify({
                // Other data to send to the backend
            }),
        })

        if (response.ok) {
            console.log('Token sent successfully!')
        } else {
            console.error('Error sending token to backend:', response.status)
        }
    } catch (error) {
        console.error('Network error:', error)
    }
}
