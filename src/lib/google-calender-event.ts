import { google } from "googleapis";
import { oauth2 } from "googleapis/build/src/apis/oauth2";

export async function createGooglecalendarEvent({
  accessToken,
  summary,
  description,
  startTime,
  endTime,
  attendees = [],
}: {
  accessToken: string;
  summary: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  attendees?: string[];
}) {
  const oAuth2Client = new google.auth.OAuth2();
  oAuth2Client.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

  try {
    const event = await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary,
        description,
        start: {
          dateTime: startTime.toISOString(),
          timeZone: "America/Los_Angeles",
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: "America/Los_Angeles",
        },
        attendees: attendees.map((email) => ({ email })),
        reminders: {
          useDefault: false,
          overrides: [
            {
              method: "email",
              minutes: 24 * 60,
            },
            {
              method: "popup",
              minutes: 30,
            },
          ],
        },
      },
    });
    return {
      success: true,
      eventId: event.data.id,
      htmlLink: event.data.htmlLink,
    };
  } catch (error) {
    console.error("Calendar event creation failed:", error);
    return { success: false, error };
  }
}


export async function updateGooglecalendarEvent({
    accessToken,
    eventId,
    summary,
    startTime,
    endTime,
    }: {
    accessToken: string;
    eventId: string;
    summary: string;
    startTime: Date;
    endTime: Date;
}){
    const oAuth2Client = new google.auth.OAuth2();
    oAuth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    try{
        const event = await calendar.events.patch({
            calendarId: "primary",
            eventId: eventId,
            requestBody: {
                summary,
                start:{
                    dateTime: startTime.toISOString(),
                },
                end:{
                    dateTime:endTime.toISOString(),
                }
            }
    })
    return {
        success:true
    }
}
    catch(error){
        console.error("Calendar event update failed:", error);
        return { success: false, error };
    }
}

export async function deleteGooglecalendarEvent({
    accessToken,
    eventId,
}:{
    accessToken:string,
    eventId:string
}){

    const oAuth2Client = new google.auth.OAuth2();
    oAuth2Client.setCredentials({access_token:accessToken});

    const calendar=google.calendar({version:"v3",auth:oAuth2Client});

    try{
        await calendar.events.delete({
            calendarId:"primary",
            eventId:eventId
        });
        return ({
            success:true
        })
    }
    catch(error){
        console.error("Calendar event deletion failed:", error);
        return { success: false, error };
    }
}
