"use client";

import { useState } from "react";
import { format, isSameDay } from "date-fns";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DateNightEvent {
  title: string;
  description: string;
  date: Date;
}

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<DateNightEvent[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");

  const handleAddEvent = () => {
    if (date && newEventTitle) {
      const newEvent: DateNightEvent = {
        title: newEventTitle,
        description: newEventDescription,
        date: date,
      };
      setEvents([...events, newEvent]);
      setDialogOpen(false);
      setNewEventTitle("");
      setNewEventDescription("");
    }
  };

  const selectedDateEvents = date
    ? events.filter((event) => isSameDay(event.date, date))
    : [];

  return (
    <div className="flex h-screen flex-col p-4 md:p-6">
      <header className="border-b pb-4">
        <h1 className="font-headline text-3xl font-bold">Our Calendar</h1>
        <p className="text-muted-foreground">
          Let's plan our adventures together.
        </p>
      </header>

      <div className="mt-6 flex flex-col gap-6 md:flex-row">
        <Card className="flex-shrink-0 md:w-auto">
          <CardContent className="p-2 md:p-4">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(selectedDate) => {
                  setDate(selectedDate);
                  if (selectedDate) {
                    setDialogOpen(true);
                  }
                }}
                className="rounded-md"
                components={{
                  DayContent: ({ date, ...props }) => {
                    const isEventDay = events.some((event) =>
                      isSameDay(event.date, date)
                    );
                    return (
                      <div
                        {...props}
                        className="relative h-full w-full"
                      >
                        <span {...props.children?.props}>{date.getDate()}</span>
                        {isEventDay && (
                          <div className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-primary" />
                        )}
                      </div>
                    );
                  },
                }}
              />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Add Date Night for {date ? format(date, "PPP") : ""}
                  </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={newEventTitle}
                      onChange={(e) => setNewEventTitle(e.target.value)}
                      className="col-span-3"
                      placeholder="e.g., Movie Night"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Notes
                    </Label>
                    <Textarea
                      id="description"
                      value={newEventDescription}
                      onChange={(e) => setNewEventDescription(e.target.value)}
                      className="col-span-3"
                      placeholder="e.g., Get popcorn and our favorite snacks!"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                     <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleAddEvent}>Save Date</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>
                Plans for {date ? format(date, "MMMM d, yyyy") : "..."}
              </CardTitle>
              <CardDescription>
                Here's what we have planned for this day.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDateEvents.length > 0 ? (
                <ul className="space-y-4">
                  {selectedDateEvents.map((event, index) => (
                    <li
                      key={index}
                      className="rounded-lg border bg-muted/50 p-4"
                    >
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {event.description}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No Plans Yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Click a date on the calendar to add a new date night!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
