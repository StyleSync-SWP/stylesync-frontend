import { useEffect, useRef, useCallback } from 'react';

interface GoogleUser {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

interface UseGoogleAuthReturn {
  login: () => void;
  isLoaded: boolean;
}

// Load Google Identity Services script
const loadGoogleScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.getElementById('google-identity-script')) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-identity-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google script'));
    document.body.appendChild(script);
  });
};

export const useGoogleAuth = (
  onSuccess: (user: GoogleUser) => void,
  onError?: (error: Error) => void
): UseGoogleAuthReturn => {
  const isLoadedRef = useRef(false);
  const clientRef = useRef<any>(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || clientId === 'your-google-client-id.apps.googleusercontent.com') {
      console.warn('Google Client ID not configured');
      return;
    }

    const initGoogle = async () => {
      try {
        await loadGoogleScript();
        
        // Wait for google to be available
        if (!window.google?.accounts?.oauth2) {
          console.warn('Google Identity Services not available');
          return;
        }

        clientRef.current = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'email profile openid',
          callback: async (response) => {
            if (response.error) {
              onError?.(new Error(response.error));
              return;
            }

            try {
              // Fetch user info from Google
              const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${response.access_token}` },
              }).then((res) => {
                if (!res.ok) throw new Error('Failed to fetch user info');
                return res.json();
              });

              onSuccess({
                email: userInfo.email,
                name: userInfo.name,
                picture: userInfo.picture,
                sub: userInfo.sub,
              });
            } catch (error) {
              onError?.(error instanceof Error ? error : new Error('Failed to get user info'));
            }
          },
        });

        isLoadedRef.current = true;
      } catch (error) {
        console.error('Failed to initialize Google Auth:', error);
        onError?.(error instanceof Error ? error : new Error('Failed to initialize'));
      }
    };

    initGoogle();
  }, [onSuccess, onError]);

  const login = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.requestAccessToken();
    } else {
      onError?.(new Error('Google Auth not initialized'));
    }
  }, [onError]);

  return { login, isLoaded: isLoadedRef.current };
};

// Types for Google Identity Services
declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: {
              access_token?: string;
              error?: string;
            }) => void;
          }) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
  }
}

export default useGoogleAuth;
