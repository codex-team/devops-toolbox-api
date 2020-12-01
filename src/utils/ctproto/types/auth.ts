/**
 * Represents the object that is used to authorize connected client.
 * This is an app-related data, so we don't know its structure.
 */
export interface AuthRequestPayload extends Object {}

/**
 * App-related authorized client data
 * returned by onAuth callback
 */
export interface AuthData extends Object {}