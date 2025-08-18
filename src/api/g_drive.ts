// src/utils/googleDrive.ts
let tokenClient: any = null;
let accessToken: string | null = null;

// Initialize Google OAuth client
export function initGoogleDrive(clientId: string, scopes: string) {
  // @ts-ignore
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: scopes,
    callback: (resp: any) => {
      if (resp.access_token) {
        accessToken = resp.access_token;
      }
    },
  });
}

// Trigger sign-in and get token
export function requestAccessToken(onSuccess: (token: string) => void, onError: (err: string) => void) {
  if (!tokenClient) {
    onError("Google token client not initialized.");
    return;
  }
  tokenClient.callback = (resp: any) => {
    if (resp.access_token) {
      accessToken = resp.access_token;
      onSuccess(accessToken);
    } else {
      onError("Failed to get access token.");
    }
  };
  tokenClient.requestAccessToken({ prompt: "consent" });
}

// List files inside "HCA_Dataset" folder
export async function listHcaDatasetFiles() {
  if (!accessToken) throw new Error("Not authenticated.");

  // 1. Find folder ID
  const folderRes = await fetch(
    "https://www.googleapis.com/drive/v3/files?q=" +
      encodeURIComponent("name = 'HCA_Dataset' and mimeType = 'application/vnd.google-apps.folder' and trashed = false"),
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const folderData = await folderRes.json();
  if (!folderData.files || folderData.files.length === 0) {
    throw new Error("'HCA_Dataset' folder not found in your Google Drive.");
  }
  const folderId = folderData.files[0].id;

  // 2. List files in that folder
  const filesRes = await fetch(
    "https://www.googleapis.com/drive/v3/files?q=" +
      encodeURIComponent(`'${folderId}' in parents and trashed = false`),
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const filesData = await filesRes.json();
  return filesData.files || [];
}
