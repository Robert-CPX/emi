export const Config = {
  CONNECTION_HOSTNAME: process.env.CONNECTION_HOSTNAME,
  CONNECTION_SSL: process.env.CONNECTION_SSL === 'true',
  GENERATE_TOKEN_URL: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/inworld/generateSessionToken`,
  SCENE_NAME: "workspaces/default-upyjqviok36wsxukslekpq/characters/emi2",
  DISCONNECT_TIMEOUT: 8 * 60 * 1000, //time out after 8 minutes
};