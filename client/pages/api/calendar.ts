import { promises as fs } from "fs";
import { join } from "path";
import { cwd } from "process";
import { authenticate } from "@google-cloud/local-auth";
import { google, Auth, calendar_v3 } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const TOKEN_PATH = join(cwd(), "token.json");
const CREDENTIALS_PATH = join(cwd(), "credentials.json");

async function loadSavedCredentialsIfExist(): Promise<Auth.OAuth2Client | null> {
  try {
    const content = await fs.readFile(TOKEN_PATH, "utf8");
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials) as Auth.OAuth2Client;
  } catch (err) {
    return null;
  }
}

async function saveCredentials(client: Auth.OAuth2Client) {
  const content = await fs.readFile(CREDENTIALS_PATH, "utf8");
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

async function authorize(): Promise<Auth.OAuth2Client> {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = (await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  })) as Auth.OAuth2Client;
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

async function listEvents(auth: Auth.OAuth2Client) {
  const calendar = google.calendar({ version: "v3", auth });
  const res = await calendar.events.list({
    calendarId: "primary",
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
  });
  return res.data.items;
}

async function createCalendar(auth: Auth.OAuth2Client, summary: string) {
  const calendar = google.calendar({ version: "v3", auth });
  const res = await calendar.calendars.insert({
    requestBody: {
      summary,
    },
  });
  return res.data;
}

async function checkIfCalendarExists(auth: Auth.OAuth2Client, summary: string) {
  const calendar = google.calendar({ version: "v3", auth });
  const res = await calendar.calendarList.list();
  const calendars = res.data.items;
  if (!calendars) {
    return false;
  }
  return calendars.some((calendar) => calendar.summary === summary);
}

export { authorize, listEvents, createCalendar, checkIfCalendarExists };
