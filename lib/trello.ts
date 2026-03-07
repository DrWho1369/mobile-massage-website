import "server-only";

export type TrelloBookingData = {
  serviceName: string;
  duration: number;
  locationType: string;
  neighborhood: string;
  dateDisplay: string;
  name: string;
  email: string;
  notes?: string;
};

export async function createBookingCard(bookingData: TrelloBookingData): Promise<void> {
  const key = process.env.TRELLO_API_KEY;
  const token = process.env.TRELLO_API_TOKEN;
  const idList = process.env.TRELLO_LIST_ID;

  if (!key || !token || !idList) {
    throw new Error(
      "Missing TRELLO_API_KEY, TRELLO_API_TOKEN, or TRELLO_LIST_ID. Add them to .env.local."
    );
  }

  const title = `[New Booking] ${bookingData.name} - ${bookingData.dateDisplay}`;
  const location = [bookingData.locationType, bookingData.neighborhood].filter(Boolean).join(" · ") || "Not specified";
  const specialNotes = bookingData.notes?.trim() || "None";

  const desc = [
    `**Service:** ${bookingData.serviceName} (${bookingData.duration} mins)`,
    `**Date & Time:** ${bookingData.dateDisplay}`,
    `**Location:** ${location}`,
    `**Contact:** ${bookingData.email}`,
    `**Special Notes:** ${specialNotes}`
  ].join("\n\n");

  const url = new URL("https://api.trello.com/1/cards");
  url.searchParams.set("key", key);
  url.searchParams.set("token", token);

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idList, name: title, desc })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Trello API error (${res.status}): ${text || res.statusText}`);
  }
}
