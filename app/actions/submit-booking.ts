"use server";

import { services } from "@/data/content";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { createBookingCard, type TrelloBookingData } from "@/lib/trello";

const MAX_NAME = 200;
const MAX_EMAIL = 254;
const MAX_NOTES = 2000;
const MAX_NEIGHBORHOOD = 300;

export type BookingFormData = {
  serviceId: string | null;
  duration: number | null;
  locationType: string;
  neighborhood: string;
  date: string;
  name: string;
  email: string;
  notes: string;
};

export type SubmitBookingResult = { success: true } | { success: false; error: string };

function formatDateForDisplay(date: string): string {
  if (!date || !date.trim()) return "Flexible";
  const [y, m, d] = date.split("-");
  if (!d) return date;
  return `${d}/${m}/${y}`;
}

export async function submitBooking(formData: BookingFormData): Promise<SubmitBookingResult> {
  try {
    const { serviceId, duration, locationType, neighborhood, date, name, email, notes } = formData;

    if (!serviceId?.trim()) return { success: false, error: "Please select a treatment." };
    if (duration == null || duration < 1) return { success: false, error: "Please select a duration." };
    if (!locationType?.trim()) return { success: false, error: "Please select a location type." };
    if (!neighborhood?.trim()) return { success: false, error: "Please enter neighbourhood or hotel." };
    if (!name?.trim()) return { success: false, error: "Please enter your name." };
    if (!email?.trim()) return { success: false, error: "Please enter your email." };

    if (name.length > MAX_NAME) return { success: false, error: "Name is too long." };
    if (email.length > MAX_EMAIL) return { success: false, error: "Email is too long." };
    if (notes.length > MAX_NOTES) return { success: false, error: "Notes are too long." };
    if (neighborhood.length > MAX_NEIGHBORHOOD) return { success: false, error: "Neighbourhood is too long." };

    const service = services.find((s) => s.id === serviceId);
    if (!service) return { success: false, error: "Invalid treatment selected." };

    const dateDisplay = formatDateForDisplay(date);
    const bookingDetails: TrelloBookingData = {
      serviceName: service.name,
      duration,
      locationType,
      neighborhood,
      dateDisplay,
      name: name.trim(),
      email: email.trim(),
      notes: notes.trim() || undefined
    };

    try {
      const supabase = getSupabaseAdmin();
      await supabase.from("bookings").insert({
        service_id: serviceId,
        service_name: service.name,
        duration,
        location_type: locationType,
        neighborhood: neighborhood.trim(),
        preferred_date: date.trim() || null,
        client_name: bookingDetails.name,
        client_email: bookingDetails.email,
        notes: bookingDetails.notes || null
      });
    } catch (dbError) {
      // Best-effort: log and continue; Trello is the critical path
      console.error("Bookings insert failed:", dbError);
    }

    try {
      await createBookingCard(bookingDetails);
    } catch (trelloError) {
      console.error("Trello create card failed:", trelloError);
      return {
        success: false,
        error: "Could not create booking request. Please try again or call to book."
      };
    }

    return { success: true };
  } catch (e) {
    console.error("submitBooking error:", e);
    return {
      success: false,
      error: e instanceof Error ? e.message : "Something went wrong. Please try again."
    };
  }
}
