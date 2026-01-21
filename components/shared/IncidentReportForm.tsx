'use client';

import { useState, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query'; // Added this
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { toast } from 'sonner';
import { incidentReportSchema } from '@/lib/validation';
import { createPitch } from '@/lib/actions';
import emailjs from '@emailjs/browser';
import LocationPicker from './LocationPicker';
import { compressImage } from '@/lib/utils';

type Preview = {
  id: string;
  file: File;
  url: string;
};

const IncidentReportForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [isCompressing, setIsCompressing] = useState(false); // Local state for file processing
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  
  const router = useRouter();
  const queryClient = useQueryClient();

  // === Mutation Logic ===
  const { mutate: submitReport, isPending: isSubmitting } = useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await createPitch({ error: '', status: 'INITIAL' }, formData);
      if (result.status === 'ERROR') throw new Error(result.error);
      return result;
    },
    onSuccess: async (result, variables) => {
      // 1. Invalidate queries so the home page updates immediately
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });

      // 2. Extract data for EmailJS (from the original formData variables)
      const reporterEmail = result.reporterEmail;
      const reporterName = result.reporterName || 'Reporter';

      const emailParams = {
        title: variables.get('title'),
        category: variables.get('type'),
        location: variables.get('location'),
        description: variables.get('description'),
        reported_date: variables.get('date'),
        reporter_email: reporterEmail || 'Anonymous',
        reporter_name: reporterName,
      };

      try {
        const emailPromises = [];
        emailPromises.push(emailjs.send('service_dmlmw07', 'template_ydugj3g', emailParams, 'tcIhGsDKIFHRbn4Q3'));
        if (reporterEmail) {
          emailPromises.push(emailjs.send('service_dmlmw07', 'template_fxb9ezu', { ...emailParams, email: reporterEmail }, 'tcIhGsDKIFHRbn4Q3'));
        }
        await Promise.all(emailPromises);
        toast.success(reporterEmail ? 'Incident reported! Emails sent.' : 'Incident reported successfully.');
      } catch (err) {
        toast.warning('Incident saved, but email notification failed.');
      }

      // 3. Navigate
      router.push(`/incidents/${result._id}`);
    },
    onError: (error: any) => {
      console.error('Submission error:', error);
      toast.error(error.message || 'An unexpected error occurred.');
    },
  });

  const handleFormSubmit = async (formData: FormData) => {
    setErrors({});
    if (!coords) {
      toast.error("Please select a location on the map");
      return;
    }

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

      // Append selected files
      previews.forEach((p) => {
        formData.append('attachments', p.file); // Adjusted to match standard FormData append
      });

      // Execute the mutation
      submitReport(formData);
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
      }
    }
  };

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsCompressing(true);
    const newPreviews: Preview[] = [];
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue;
        const processedFile = await compressImage(file);
        const url = URL.createObjectURL(processedFile);
        newPreviews.push({ id: `${processedFile.name}-${Date.now()}`, file: processedFile, url });
      }
      setPreviews((prev) => [...prev, ...newPreviews]);
    } finally {
      setIsCompressing(false);
    }
  };

  const removePreview = (id: string) => {
    setPreviews((prev) => {
      const target = prev.find(p => p.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((p) => p.id !== id);
    });
  };

  useEffect(() => {
    return () => previews.forEach((p) => URL.revokeObjectURL(p.url));
  }, [previews]);

  const isPending = isCompressing || isSubmitting;

  return (
    <form action={handleFormSubmit} className="w-full max-w-4xl mx-auto bg-[#f9f9f9] my-10 space-y-8 px-8 py-8 rounded-xl shadow">
      <h2 className="text-2xl font-semibold text-gray-900">Report an Incident</h2>

      {/* ... (Keep your Title, Type, and Description inputs exactly as they were) ... */}

      {/* Attachments */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Attachments (images)</label>
        <div className="border border-dashed border-gray-300 rounded-lg p-4">
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFilesSelected(e.target.files)} />
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Upload photos or screenshots (optional).</p>
            <div className="flex items-center gap-2">
              <Button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-2 text-sm">Choose Files</Button>
              <Button type="button" onClick={() => setPreviews([])} className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200" disabled={previews.length === 0}>Clear</Button>
            </div>
          </div>

          {previews.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {previews.map((p) => (
                <div key={p.id} className="relative rounded-md overflow-hidden border">
                  <img src={p.url} alt="preview" className="object-cover w-full h-28" />
                  <button type="button" onClick={() => removePreview(p.id)} className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 shadow">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Map and hidden inputs */}
      <LocationPicker onSelect={(lat, lng) => setCoords({ lat, lng })} />
      <input type="hidden" name="lat" value={coords?.lat ?? ""} />
      <input type="hidden" name="lng" value={coords?.lng ?? ""} />

      {/* Submit */}
      <div className="flex items-center gap-4">
        <Button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg min-w-[180px]"
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin h-4 w-4" />
              {isCompressing ? 'Processing...' : 'Submitting...'}
            </>
          ) : (
            <>
              Submit Incident <Send className="ml-1 h-4 w-4" />
            </>
          )}
        </Button>
        <p className="text-sm text-gray-500">You must be signed in to report.</p>
      </div>
    </form>
  );
};

export default IncidentReportForm;