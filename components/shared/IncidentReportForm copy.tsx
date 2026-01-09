'use client';
import { useState, useRef, useEffect } from 'react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { toast } from 'sonner';
import { incidentReportSchema } from '@/lib/validation';
import { createPitch } from '@/lib/actions';
import emailjs from '@emailjs/browser';
import LocationPicker from './LocationPicker';

type Preview = {
  id: string;
  file: File;
  url: string;
};

const IncidentReportForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, setIsPending] = useState(false);
  const [previews, setPreviews] = useState<Preview[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)

  // === 1. File selection handler ===
  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;
if (!coords) {
  toast.error("Please select a location on the map");
  setIsPending(false);
  return;
}
    const newPreviews: Preview[] = [];

    Array.from(files).forEach((file) => {
      // Only allow images
      if (!file.type.startsWith('image/')) {
        toast.error(`File "${file.name}" is not an image and was skipped.`);
        return;
      }

      const url = URL.createObjectURL(file);
      newPreviews.push({
        id: `${file.name}-${file.size}-${Date.now()}`,
        file,
        url,
      });
    });

    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  // === 2. Remove preview ===
  const removePreview = (id: string) => {
    setPreviews((prev) => {
      const toRemove = prev.find((p) => p.id === id);
      if (toRemove) {
        URL.revokeObjectURL(toRemove.url);
      }
      return prev.filter((p) => p.id !== id);
    });
  };

  // === 3. Cleanup object URLs on unmount or when previews change ===
  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  // === 4. Clear all previews ===
  const clearAllPreviews = () => {
    previews.forEach((p) => URL.revokeObjectURL(p.url));
    setPreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // === 5. Open file chooser ===
  const openFileChooser = () => fileInputRef.current?.click();

  // === 6. Form submit handler ===
  const handleFormSubmit = async (formData: FormData) => {
    setIsPending(true);
    setErrors({});

    try {
      // Client-side validation
      const formValue = {
        title: (formData.get('title') as string) ?? '',
        type: (formData.get('type') as string) ?? '',
        description: (formData.get('description') as string) ?? '',
        location: (formData.get('location') as string) ?? '',
        date: (formData.get('date') as string) ?? '',
      };

      await incidentReportSchema.parseAsync(formValue);

      // Append selected files to formData
      previews.forEach((p) => {
        formData.append('attachments[]', p.file, p.file.name);
      });

      // Submit to server
      const result = await createPitch({ error: '', status: 'INITIAL' }, formData);

      if (result.status === 'SUCCESS') {
        const reporterEmail = result.reporterEmail;
        const reporterName = result.reporterName || 'Reporter';

        const emailParams = {
          title: formValue.title,
          category: formValue.type,
          location: formValue.location,
          description: formValue.description,
          reported_date: formValue.date,
          reporter_email: reporterEmail || 'Anonymous',
          reporter_name: reporterName,
        };

        try {
          const emailPromises: Promise<any>[] = [];

          // Admin notification
          emailPromises.push(
            emailjs.send(
              'service_dmlmw07',
              'template_ydugj3g',
              emailParams,
              'tcIhGsDKIFHRbn4Q3'
            )
          );

          // Reporter confirmation
          if (reporterEmail) {
            emailPromises.push(
              emailjs.send(
                'service_dmlmw07',
                'template_fxb9ezu',
                {
                  ...emailParams,
                  email: reporterEmail, // Use {{email}} in EmailJS template as "To" field
                },
                'tcIhGsDKIFHRbn4Q3'
              )
            );
          }

          await Promise.all(emailPromises);

          toast.success(
            reporterEmail
              ? 'Incident reported! Confirmation sent to your email.'
              : 'Incident reported successfully.'
          );
        } catch (emailErr) {
          console.error('Email sending failed:', emailErr);
          toast.warning('Incident saved, but email notification failed.');
        }

        router.push(`/incidents/${result._id}`);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        const mapped: Record<string, string> = {};
        Object.entries(fieldErrors).forEach(([key, msgs]) => {
          if (msgs && Array.isArray(msgs)) {
            mapped[key] = msgs.join(', ');
          }
        });
        setErrors(mapped);
        toast.error('Please correct the errors in the form.');
      } else {
        console.error('Submission error:', error);
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form
      action={handleFormSubmit}
      className="w-full max-w-4xl mx-auto bg-[#f9f9f9] my-10 space-y-8 px-8 py-8 rounded-xl shadow"
    >
      <h2 className="text-2xl font-semibold text-gray-900">Report an Incident</h2>

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Incident Title
        </label>
        <Input id="title" name="title" required placeholder="Incident Title" />
        {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}
      </div>

      {/* Type */}
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
          Type of incident
        </label>
        <select id="type" name="type" required className="w-full px-4 py-3 rounded-lg border">
          <option value="">Select incident type</option>
          <option value="Fire">Fire</option>
          <option value="Abduction">Abduction</option>
          <option value="Mass Killing">Mass Killing</option>
          <option value="Other">Other</option>
        </select>
        {errors.type && <p className="mt-2 text-sm text-red-600">{errors.type}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          required
          className="min-h-[140px]"
          placeholder="Describe the incident"
        />
        {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description}</p>}
      </div>

      {/* Attachments */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Attachments (images)
        </label>

        <div className="border border-dashed border-gray-300 rounded-lg p-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            name="attachments"
            onChange={(e) => handleFilesSelected(e.target.files)}
            className="hidden"
          />

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Upload photos or screenshots (optional).</p>
            <div className="flex items-center gap-2">
              <Button type="button" onClick={openFileChooser} className="px-3 py-2 text-sm">
                Choose Files
              </Button>
              <Button
                type="button"
                onClick={clearAllPreviews}
                className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200"
                disabled={previews.length === 0}
              >
                Clear
              </Button>
            </div>
          </div>

          {/* Preview Grid */}
          {previews.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {previews.map((p) => (
                <div key={p.id} className="relative rounded-md overflow-hidden border">
                  <img src={p.url} alt={p.file.name} className="object-cover w-full h-28" />
                  <button
                    type="button"
                    onClick={() => removePreview(p.id)}
                    className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 shadow"
                    aria-label={`Remove ${p.file.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Location & Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <Input id="location" name="location" required placeholder="City, parish, or specific place" />
          {errors.location && <p className="mt-2 text-sm text-red-600">{errors.location}</p>}
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
            Date of Incident
          </label>
          <Input id="date" name="date" type="date" required />
          {errors.date && <p className="mt-2 text-sm text-red-600">{errors.date}</p>}
        </div>
      </div>
      <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Select Location on Map
  </label>

  <LocationPicker
    onSelect={(lat, lng) => {
      setCoords({ lat, lng })
    }}
  />

  {coords && (
    <p className="mt-2 text-sm text-gray-600">
      Selected: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
    </p>
  )}
      </div>
      <input type="hidden" name="lat" value={coords?.lat ?? ""} />
      <input type="hidden" name="lng" value={coords?.lng ?? ""} />
      {/* Submit */}
      <div className="flex items-center gap-4">
        <Button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
        >
          {isPending ? 'Submitting...' : 'Submit Incident'}
          <Send className="ml-1 h-4 w-4" />
        </Button>
        <p className="text-sm text-gray-500">You must be signed in to report.</p>
      </div>
    </form>
  );
};

export default IncidentReportForm;