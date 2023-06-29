import { UserManager } from "oidc-client-ts";
import React, { createContext, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  authenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  token: string | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Returns the authentication context of the current user.
 *
 * @return {object} The authentication context object.
 * @throws {Error} Throws an error if used outside of an AuthProvider.
 */
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const userManager = new Promise<UserManager>((resolve, reject) => {
    // only run this in the browser where the required apis are available
    if (typeof window === "undefined") return reject();

    //TODO replace with real values
    resolve(
      new UserManager({
        authority: "http://localhost:7788",
        client_id: "220605625510461443@dmun",
        redirect_uri: "http://localhost:3000",
        post_logout_redirect_uri: "http://localhost:3000",
      }),
    );
  });

  const login = async () => {
    (await userManager).signinRedirect();
  };

  const logout = async () => {
    (await userManager).signoutRedirect();
  };

  const [authenticated, setAuthenticated] = React.useState<boolean>(false);
  const [token, setToken] = React.useState<string | undefined>();

  useEffect(() => {
    (async () => {
      const urlObj = new URL(window.location.href);

      if (urlObj.searchParams.has("state") && urlObj.searchParams.has("code")) {
        await (await userManager).signinRedirectCallback(window.location.href);
        ["state", "code"].forEach((param) => {
          urlObj.searchParams.delete(param);
        });
        
        //TODO the replacement seems to not work perfectly here
        router.replace(urlObj.toString());
      }

      const user = await (await userManager).getUser();
      if (user) {
        setAuthenticated(true);
        setToken(user.access_token);
      } else {
        setAuthenticated(false);
        setToken(undefined);
      }
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ login, logout, authenticated, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuth };
