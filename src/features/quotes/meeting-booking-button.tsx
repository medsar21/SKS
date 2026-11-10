"use client";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/features/cms/site-content";

export function MeetingBookingButton() {
  const { settings } = useSiteContent();
  const url = settings.externalLinks.calendlyUrl;
  if (!url) return null;
  return (
    <Button asChild variant="outline">
      <a href={url} target="_blank" rel="noopener noreferrer">
        <CalendarDays size={17} aria-hidden="true" />
        Prendre un rendez-vous Teams
      </a>
    </Button>
  );
}
