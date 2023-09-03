# auth
This is a library project, it only exports modules but is not runnable or intended to run as a standalone application. It can/should be used by other projects to manage authentication and permissions.

## ZITADEL
[ZITADEL](https://zitadel.com/) is the OpenID Connect issuer used in munify. This works the same way as "Login with Google" or Microsoft, Github etc. does. Except we selfhost the issuer, instead of relying on a company to do this for us.
If you are new to OpenID, have a look [here](https://openid.net/developers/how-connect-works/). For development this project contains a compose file which starts an instance on http://localhost:7788. It will be started automatically on running the root dev script. See https://zitadel.com/docs/self-hosting/deploy/compose for docs on Docker hosting and the default credentials.

## src
The src dir contains various modules for interacting with the OpenID connect standard and ZITADEL. The index re-exports various types to be available externally for library users.

## permissions class
The permissions class inside [scr/types/permissions.ts](./src/types/permissions.ts) contains business logic for granting user permissions based on their ZITADEL metadata. It should be used to manage how permissions are set/checked in the application.

## dev-full
In reqular development mode (`bun run dev`) this component does not starty any processes. If you need a running ZITADEL instance, use `bun run dev-full`. 

### How are permissions set in development mode without a ZITADEL instance running?
Please see [chase/backend/src/plugins/auth.ts](chase/backend/src/plugins/auth.ts). This is an authentication/introspection hook in the chase backend. Chase uses this hook, which internally uses this component (the auth component). In development mode, this does not actually (fully) use the auth component, but instead mocks the data via an manually set permissions class. Feel free to adjust this to your development needs, if you need to develop/test authentication related things.

#### Why don't just use a ZITADEL instance?
We want to keep the entry barrier for new developers low. Configuring ZITADEL isn't trivial, so we decided to mock instead. Feel free to configure ZITADEL and use a live instance if you want to! If you need help with this, contact us in the discussion section.