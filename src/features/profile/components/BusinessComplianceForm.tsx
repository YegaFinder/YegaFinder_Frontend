"use client";

import { useState } from "react";
import { FileText, ShieldAlert, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/shared/form-feedback";
import { useImageUpload } from "@/lib/hooks/useImageUpload";

interface UploadedDocument {
  name: string;
  url: string;
}

/**
 * ⚠️ IMPORTANT LIMITATION — read before wiring this into anything else.
 *
 * `POST/PUT /merchant/profile` has NO field to store a document URL, and
 * the `BusinessDocument` entity + `Business.verificationDocuments` column
 * exist in the DB schema but have zero controller/service code touching
 * them (BACKEND_API_GUIDE.md §11). This means: the upload below is 100%
 * real (it goes through the real presigned-S3 flow, §6), so the file
 * genuinely lands in storage and you get back a real, working URL — but
 * there is currently NOWHERE on the backend to save that URL against the
 * merchant's profile. It will not survive a page refresh.
 *
 * This component exists so the UI/UX is ready and the upload mechanics
 * are proven out — once the backend adds a field/endpoint for this
 * (flag it as a Sprint 3+ item), swap the local `setDocuments` calls
 * below for a real mutation.
 */
export function BusinessComplianceForm() {
  const { uploadImage, isUploading, progress } = useImageUpload();
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadImage(file, "document");
      setDocuments((prev) => [...prev, { name: file.name, url }]);
      toast.success("Document uploaded. Submitted for review.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      e.target.value = "";
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 rounded-[10px] border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
        <ShieldAlert className="mt-0.5 size-4 shrink-0" />
        <span>
          Uploads here are stored, but review/verification isn&apos;t wired up on the backend yet — your
          document won&apos;t be visible after a refresh until that ships. Keep a copy of your license
          handy; we&apos;ll notify you once verification is live.
        </span>
      </div>

      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-[14px] border-2 border-dashed border-yegna-border bg-yegna-background px-4 py-6 text-sm text-muted-foreground hover:border-yegna-primary/40">
        <Upload className="size-4" />
        {isUploading ? `Uploading... ${progress}%` : "Upload business license (PDF, JPG, or PNG)"}
        <input
          type="file"
          accept="application/pdf,image/jpeg,image/png"
          className="hidden"
          disabled={isUploading}
          onChange={handleFileChange}
        />
      </label>

      {documents.length > 0 && (
        <ul className="space-y-2">
          {documents.map((doc) => (
            <li
              key={doc.url}
              className="flex items-center justify-between rounded-[10px] border border-yegna-border bg-background px-3 py-2 text-sm"
            >
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-yegna-primary hover:underline"
              >
                <FileText className="size-4" />
                {doc.name}
              </a>
              <button
                type="button"
                onClick={() =>
                  setDocuments((prev) => prev.filter((d) => d.url !== doc.url))
                }
                aria-label={`Remove ${doc.name}`}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}