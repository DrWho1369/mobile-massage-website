"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { services } from "@/data/content";
import { submitBooking } from "@/app/actions/submit-booking";
import { CursorHover } from "@/components/custom-cursor";
import { CalendarDays, CheckCircle2, Loader2, Phone, User2 } from "lucide-react";

const BOOKING_PHONE = "07736365252";

type Step = 0 | 1 | 2 | 3 | 4;

type BookingState = {
  serviceId: string | null;
  duration: number | null;
  locationType: "Home" | "Hotel" | "Office" | "";
  neighborhood: string;
  date: string;
  name: string;
  email: string;
  notes: string;
};

const initialState: BookingState = {
  serviceId: null,
  duration: null,
  locationType: "",
  neighborhood: "",
  date: "",
  name: "",
  email: "",
  notes: ""
};

const cardVariants = {
  initial: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 40 : -40
  }),
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45 }
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -40 : 40,
    transition: { duration: 0.35 }
  })
};

const stepsLabels = ["Treatment", "Duration", "Location", "Details", "Review"];

/** Format YYYY-MM-DD to DD/MM/YYYY for UK display; empty string returns "Flexible". */
function formatDateForDisplay(date: string): string {
  if (!date || !date.trim()) return "Flexible";
  const [y, m, d] = date.split("-");
  if (!d) return date;
  return `${d}/${m}/${y}`;
}

export function BookingJourney() {
  const [step, setStep] = useState<Step>(0);
  const [direction, setDirection] = useState(1);
  const [booking, setBooking] = useState<BookingState>(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const currentService = booking.serviceId
    ? services.find((s) => s.id === booking.serviceId) ?? null
    : null;

  const goToStep = (next: Step) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
    setSubmitError(null);
  };

  const handleNext = () => {
    if (step < 4) {
      goToStep((step + 1) as Step);
    } else {
      // Submit via Server Action only (Trello card + optional Supabase). No mailto.
      setSubmitError(null);
      startTransition(async () => {
        const result = await submitBooking({
          serviceId: booking.serviceId,
          duration: booking.duration,
          locationType: booking.locationType,
          neighborhood: booking.neighborhood,
          date: booking.date,
          name: booking.name,
          email: booking.email,
          notes: booking.notes
        });
        if (result.success) {
          setSubmitted(true);
        } else {
          setSubmitError(result.error ?? "Something went wrong.");
        }
      });
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return Boolean(booking.serviceId);
      case 1:
        return Boolean(booking.duration);
      case 2:
        return Boolean(booking.locationType && booking.neighborhood);
      case 3:
        return Boolean(booking.name && booking.email);
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <section
      id="booking"
      className="bg-sand/60 py-20 md:py-28"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-stone/70">
              Booking Journey
            </p>
            <h2 className="font-serifLux text-2xl text-stone md:text-3xl">
              A calm, guided way to reserve your ritual.
            </h2>
            <p className="text-sm text-stone/80 md:text-base">
              Instead of a long, overwhelming form, move through a few focused
              moments to shape the massage that meets you best.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-start">
          <div className="glass-panel relative overflow-hidden bg-pearl/70 p-5 md:p-6">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-peach/40 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-sage/40 blur-3xl" />

            <div className="relative mb-5 flex items-center justify-between gap-4">
              <ol className="flex flex-1 gap-1 text-[11px] uppercase tracking-[0.2em] text-stone/70">
                {stepsLabels.map((label, index) => {
                  const active = step === index;
                  const completed = index < step || submitted;
                  return (
                    <li
                      key={label}
                      className="flex flex-1 flex-col items-center gap-1"
                    >
                      <div
                        className={`h-1 w-full rounded-full ${
                          completed
                            ? "bg-sage"
                            : active
                            ? "bg-sage/70"
                            : "bg-stone/20"
                        }`}
                      />
                      <span
                        className={`hidden text-[10px] md:block ${
                          active
                            ? "text-stone"
                            : completed
                            ? "text-stone/70"
                            : "text-stone/50"
                        }`}
                      >
                        {label}
                      </span>
                    </li>
                  );
                })}
              </ol>
              <span className="text-[11px] uppercase tracking-[0.2em] text-stone/60">
                Step {step + 1} of 5
              </span>
            </div>

            <div className="relative min-h-[210px] md:min-h-[230px]">
              <AnimatePresence
                custom={direction}
                initial={false}
                mode="wait"
              >
                {!submitted ? (
                  <motion.div
                    key={step}
                    custom={direction}
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="relative"
                  >
                    {step === 0 && (
                      <StepTreatment booking={booking} setBooking={setBooking} />
                    )}
                    {step === 1 && (
                      <StepDuration
                        booking={booking}
                        setBooking={setBooking}
                        currentService={currentService}
                      />
                    )}
                    {step === 2 && (
                      <StepLocation
                        booking={booking}
                        setBooking={setBooking}
                      />
                    )}
                    {step === 3 && (
                      <StepDetails
                        booking={booking}
                        setBooking={setBooking}
                      />
                    )}
                    {step === 4 && (
                      <StepReview booking={booking} currentService={currentService} />
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="submitted"
                    custom={direction}
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                  >
                    <Confirmation />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {submitError && (
              <p className="mt-4 text-sm text-peach">{submitError}</p>
            )}
            {!submitted && (
              <div className="relative mt-6 flex flex-wrap items-center justify-between gap-4">
                <button
                  disabled={step === 0}
                  onClick={() => goToStep((step - 1) as Step)}
                  className="text-xs uppercase tracking-[0.2em] text-stone/60 disabled:opacity-40"
                >
                  Back
                </button>
                <div className="flex items-center gap-3">
                  {step === 4 && (
                    <a
                      href={`tel:${BOOKING_PHONE}`}
                      className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-stone/70 hover:text-stone"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      Call to book
                    </a>
                  )}
                  <CursorHover>
                    <motion.button
                      type="button"
                      className={`btn-primary text-xs uppercase tracking-[0.25em] bg-sage text-pearl disabled:opacity-50 transition-opacity duration-200 ${isPending ? "opacity-80" : ""}`}
                      whileHover={canProceed() && !isPending ? { scale: 1.03 } : undefined}
                      whileTap={canProceed() && !isPending ? { scale: 0.97 } : undefined}
                      disabled={!canProceed() || isPending}
                      onClick={handleNext}
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending…
                        </>
                      ) : step === 4 ? (
                        "Request Booking"
                      ) : (
                        "Next"
                      )}
                    </motion.button>
                  </CursorHover>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 text-sm text-stone/80 md:text-xs">
            <div className="glass-panel bg-pearl/90 p-4">
              <h3 className="mb-2 text-xs uppercase tracking-[0.25em] text-stone/70">
                At-a-glance summary
              </h3>
              <ul className="space-y-1.5">
                <li>
                  <span className="text-stone/60">Treatment: </span>
                  <span className="font-medium text-stone">
                    {currentService?.name ?? "To be selected"}
                  </span>
                </li>
                <li>
                  <span className="text-stone/60">Duration: </span>
                  <span className="font-medium text-stone">
                    {booking.duration
                      ? `${booking.duration} minutes`
                      : "To be selected"}
                  </span>
                </li>
                <li>
                  <span className="text-stone/60">Location: </span>
                  <span className="font-medium text-stone">
                    {booking.locationType
                      ? `${booking.locationType} · ${booking.neighborhood || "Neighbourhood pending"}`
                      : "To be selected"}
                  </span>
                </li>
                <li>
                  <span className="text-stone/60">Preferred date: </span>
                  <span className="font-medium text-stone">
                    {formatDateForDisplay(booking.date)}
                  </span>
                </li>
              </ul>
            </div>
            <div className="rounded-3xl border border-dashed border-stone/30 bg-pearl/80 p-4">
              <p className="text-[11px] leading-relaxed text-stone/75">
                Submitting this journey sends your preferences to Thomas. He&apos;ll
                confirm availability, any travel fees, and a narrowed arrival
                window before finalising payment details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type StepProps = {
  booking: BookingState;
  setBooking: React.Dispatch<React.SetStateAction<BookingState>>;
};

function StepTreatment({ booking, setBooking }: StepProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-serifLux text-xl text-stone">
        Which ritual feels right for this moment?
      </h3>
      <p className="text-sm text-stone/80">
        Choose the experience that best matches how you&apos;d like to feel
        when the massage is complete.
      </p>
      <div className="mt-2 grid gap-3 md:grid-cols-2">
        {services.map((service) => {
          const selected = booking.serviceId === service.id;
          return (
            <button
              key={service.id}
              type="button"
              onClick={() =>
                setBooking((prev) => ({
                  ...prev,
                  serviceId: service.id,
                  duration: null
                }))
              }
              className={`glass-panel flex flex-col items-start gap-1.5 bg-pearl/90 p-3 text-left text-xs transition-all ${
                selected
                  ? "border-sage/70 bg-sage/10 shadow-peach-glow"
                  : "hover:border-sage/50 hover:bg-pearl"
              }`}
            >
              <span className="text-[10px] uppercase tracking-[0.25em] text-stone/70">
                {service.tag}
              </span>
              <span className="font-serifLux text-base text-stone">
                {service.name}
              </span>
              <span className="text-[11px] text-stone/80 line-clamp-2">
                {service.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepDuration({
  booking,
  setBooking,
  currentService
}: StepProps & { currentService: (typeof services)[number] | null }) {
  const options = currentService?.durationOptions ?? [60, 90, 120];
  return (
    <div className="space-y-4">
      <h3 className="font-serifLux text-xl text-stone">
        How long would you like to drift?
      </h3>
      <p className="text-sm text-stone/80">
        We recommend 90 minutes for a fully immersive, unhurried experience.
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((minutes) => {
          const selected = booking.duration === minutes;
          return (
            <button
              key={minutes}
              type="button"
              onClick={() =>
                setBooking((prev) => ({ ...prev, duration: minutes }))
              }
              className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em] transition-all ${
                selected
                  ? "bg-sage text-pearl shadow-peach-glow"
                  : "bg-pearl/80 text-stone/80 hover:bg-sage/15"
              }`}
            >
              {minutes} minutes
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepLocation({ booking, setBooking }: StepProps) {
  const types: BookingState["locationType"][] = ["Home", "Hotel", "Office"];
  return (
    <div className="space-y-4">
      <h3 className="font-serifLux text-xl text-stone">
        Where should we meet you?
      </h3>
      <p className="text-sm text-stone/80">
        Thomas arrives with everything needed for your ritual — table, linens,
        curated music, and aromatherapy.
      </p>

      <div className="flex flex-wrap gap-2">
        {types.map((type) => {
          const selected = booking.locationType === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() =>
                setBooking((prev) => ({ ...prev, locationType: type }))
              }
              className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em] transition-all ${
                selected
                  ? "bg-sage text-pearl shadow-peach-glow"
                  : "bg-pearl/80 text-stone/80 hover:bg-sage/15"
              }`}
            >
              {type}
            </button>
          );
        })}
      </div>

      <div className="grid gap-3 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <label className="text-xs text-stone/80">
          Neighbourhood or hotel
          <input
            type="text"
            value={booking.neighborhood}
            onChange={(e) =>
              setBooking((prev) => ({ ...prev, neighborhood: e.target.value }))
            }
            className="mt-1 w-full rounded-full border border-stone/20 bg-pearl/80 px-3 py-2 text-xs outline-none ring-0 placeholder:text-stone/40 focus:border-sage/70"
            placeholder="e.g. Epsom Town Centre, Ewell, etc."
          />
        </label>
        <label className="text-xs text-stone/80">
          Ideal date
          <div
            className="relative mt-1 flex cursor-pointer items-center gap-2 rounded-full border border-stone/20 bg-pearl/80 px-3 py-2 text-xs text-stone focus-within:border-sage/70"
            onClick={(e) => {
              const target = (e.currentTarget as HTMLElement).querySelector<HTMLInputElement>('input[type="date"]');
              target?.showPicker?.();
            }}
          >
            <CalendarDays className="h-4 w-4 shrink-0 text-stone/60" />
            <input
              type="date"
              value={booking.date}
              onChange={(e) =>
                setBooking((prev) => ({ ...prev, date: e.target.value }))
              }
              className="w-full min-w-0 flex-1 bg-transparent text-stone outline-none [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full"
            />
          </div>
        </label>
      </div>
    </div>
  );
}

function StepDetails({ booking, setBooking }: StepProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-serifLux text-xl text-stone">
        Finally, a few details so we can confirm.
      </h3>
      <p className="text-sm text-stone/80">
        Your information is used only to coordinate this booking — never shared
        or added to noisy lists.
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="text-xs text-stone/80">
          Full name
          <div className="mt-1 flex items-center gap-2 rounded-full border border-stone/20 bg-pearl/80 px-3 py-2 text-xs">
            <User2 className="h-4 w-4 text-stone/60" />
            <input
              type="text"
              value={booking.name}
              onChange={(e) =>
                setBooking((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full bg-transparent outline-none placeholder:text-stone/40"
              placeholder="How should we address you?"
            />
          </div>
        </label>
        <label className="text-xs text-stone/80">
          Email
          <input
            type="email"
            value={booking.email}
            onChange={(e) =>
              setBooking((prev) => ({ ...prev, email: e.target.value }))
            }
            className="mt-1 w-full rounded-full border border-stone/20 bg-pearl/80 px-3 py-2 text-xs outline-none ring-0 placeholder:text-stone/40 focus:border-sage/70"
            placeholder="For confirmations only"
          />
        </label>
      </div>
      <label className="text-xs text-stone/80">
        Notes for your therapist
        <textarea
          value={booking.notes}
          onChange={(e) =>
            setBooking((prev) => ({ ...prev, notes: e.target.value }))
          }
          className="mt-1 h-24 w-full resize-none rounded-3xl border border-stone/20 bg-pearl/80 px-3 py-2 text-xs outline-none ring-0 placeholder:text-stone/40 focus:border-sage/70"
          placeholder="Injuries, preferences, access instructions — anything you’d like Thomas to know."
        />
      </label>
    </div>
  );
}

function StepReview({
  booking,
  currentService
}: {
  booking: BookingState;
  currentService: (typeof services)[number] | null;
}) {
  return (
    <div className="space-y-4">
      <h3 className="font-serifLux text-xl text-stone">
        Review your calm, then request.
      </h3>
      <p className="text-sm text-stone/80">
        A final glance at what you&apos;re inviting in. You&apos;ll receive a
        confirmation or a tailored alternative time.
      </p>
      <div className="rounded-3xl bg-pearl/80 p-4 text-xs text-stone/85">
        <ul className="space-y-2">
          <li>
            <span className="text-stone/60">Treatment: </span>
            <span className="font-medium">
              {currentService?.name ?? "Not specified"}
            </span>
          </li>
          <li>
            <span className="text-stone/60">Duration: </span>
            <span className="font-medium">
              {booking.duration ? `${booking.duration} minutes` : "Not specified"}
            </span>
          </li>
          <li>
            <span className="text-stone/60">Location: </span>
            <span className="font-medium">
              {booking.locationType || "Not specified"}{" "}
              {booking.neighborhood && `· ${booking.neighborhood}`}
            </span>
          </li>
          <li>
            <span className="text-stone/60">Preferred date: </span>
            <span className="font-medium">
              {formatDateForDisplay(booking.date)}
            </span>
          </li>
          <li>
            <span className="text-stone/60">Guest: </span>
            <span className="font-medium">
              {booking.name || "Not specified"} · {booking.email || "Email pending"}
            </span>
          </li>
        </ul>
        {booking.notes && (
          <div className="mt-3 border-t border-stone/15 pt-3">
            <p className="mb-1 text-stone/60">Notes for your therapist:</p>
            <p className="text-stone/85">{booking.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Confirmation() {
  return (
    <div className="space-y-6 py-4 text-center">
      <div className="flex justify-center">
        <div className="relative">
          <div className="h-16 w-16 rounded-full bg-sage/15" />
          <CheckCircle2 className="absolute left-1/2 top-1/2 h-11 w-11 -translate-x-1/2 -translate-y-1/2 text-sage" />
        </div>
      </div>
      <h3 className="font-serifLux text-2xl text-stone sm:text-3xl">
        Thank you. Your ritual request is en route.
      </h3>
      <p className="text-sm text-stone/80 max-w-md mx-auto">
        Thomas will be in touch shortly to confirm your appointment and any
        travel details.
      </p>
    </div>
  );
}

