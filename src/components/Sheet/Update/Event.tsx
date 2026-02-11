"use client";

import dynamic from "next/dynamic";
import { useForm } from "@tanstack/react-form";
import toast from "react-hot-toast";

import TextError from "@/components/TextError";
import Input from "@/components/ui/Input";
import { api } from "@/trpc/react";
import { type EventSelect, eventUpdateSchema } from "@/types/event";

// Leaflet MAP (client only)
const MapPicker = dynamic(() => import("@/components/MapPicker"), {
  ssr: false,
});

export default function SheetUpdateEvent({
  closeSheet,
  selectedData,
}: {
  closeSheet: () => void;
  selectedData: EventSelect;
}) {
  const utils = api.useUtils();

  const { mutate } = api.event.updateEvent.useMutation({
    onError: ({ message }) => {
      toast.dismiss();
      toast.error(message);
    },
    onMutate: () => {
      toast.loading("Loading...");
    },
    onSuccess: ({ message }) => {
      utils.event.invalidate();
      toast.dismiss();
      toast.success(message);
      closeSheet();
    },
  });

  const form = useForm({
    defaultValues: {
      id: selectedData.id,
      title: selectedData.title,
      startDate: selectedData.startDate,
      endDate: selectedData.endDate,
      latitude: selectedData.latitude,
      longitude: selectedData.longitude,
      description: selectedData.description,
    },
    validators: {
      onSubmit: eventUpdateSchema,
    },
    onSubmit: ({ value }) => {
      // Convert datetime-local inputs to ISO (UTC) so server compares consistently
      const payload = {
        ...value,
        startDate: value.startDate ? new Date(value.startDate).toISOString() : value.startDate,
        endDate: value.endDate ? new Date(value.endDate).toISOString() : value.endDate,
      };

      mutate(payload);
    },
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="flex min-h-screen items-start justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <h1 className="font-bold mb-6 text-gray-800">Update Event</h1>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            {/* TITLE */}
            <form.Field name="title">
              {(field) => (
                <>
                  <Input
                    label="Title"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    variant="secondary"
                  />
                  <TextError field={field} />
                </>
              )}
            </form.Field>

            {/* START DATE */}
            <form.Field name="startDate">
              {(field) => (
                <>
                  <Input
                    label="Start Date"
                    type="datetime-local"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    variant="secondary"
                  />
                  <TextError field={field} />
                </>
              )}
            </form.Field>

            {/* END DATE */}
            <form.Field name="endDate">
              {(field) => (
                <>
                  <Input
                    label="End Date"
                    type="datetime-local"
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    variant="secondary"
                  />
                  <TextError field={field} />
                </>
              )}
            </form.Field>

            {/* MAP + LOCATION */}
            <form.Field name="latitude">
              {(latField) => (
                <form.Field name="longitude">
                  {(lngField) => (
                    <>
                      <label className="text-sm font-medium">
                        Lokasi Event
                      </label>

                      <MapPicker
                        lat={latField.state.value}
                        lng={lngField.state.value}
                        onChange={(lat, lng) => {
                          latField.handleChange(lat);
                          lngField.handleChange(lng);
                        }}
                      />

                      {/* READ ONLY COORDINATE */}
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <Input
                          label="Latitude"
                          value={latField.state.value || ""}
                          readOnly
                          variant="secondary"
                        />
                        <Input
                          label="Longitude"
                          value={lngField.state.value || ""}
                          readOnly
                          variant="secondary"
                        />
                      </div>

                      <TextError field={latField} />
                      <TextError field={lngField} />
                    </>
                  )}
                </form.Field>
              )}
            </form.Field>

            {/* DESCRIPTION */}
            <form.Field name="description">
              {(field) => (
                <>
                  <Input
                    label="Description"
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    variant="secondary"
                  />
                  <TextError field={field} />
                </>
              )}
            </form.Field>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 pt-4">
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {isSubmitting ? "Memproses..." : "Update"}
                  </button>
                )}
              </form.Subscribe>

              <button
                type="button"
                onClick={closeSheet}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
