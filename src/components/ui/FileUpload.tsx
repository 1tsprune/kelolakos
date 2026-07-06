"use client";

import { useState } from "react";
import { Upload } from "lucide-react";

export function FileUpload({
  name = "photoUrl",
  label,
  defaultValue,
  accept = "image/*",
}: {
  name?: string;
  label: string;
  defaultValue?: string;
  accept?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState(defaultValue ?? "");

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url: uploaded } = await res.json();
      setUrl(uploaded);
    }
    setUploading(false);
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[var(--ink)]">{label}</label>
      <div className="flex items-center gap-3">
        <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[var(--border)] px-4 py-3 text-sm text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]">
          <Upload className="h-4 w-4" />
          {uploading ? "Mengupload..." : "Pilih file"}
          <input type="file" accept={accept} className="hidden" onChange={handleChange} />
        </label>
        {url && <img src={url} alt="Preview" className="h-12 w-12 rounded-lg object-cover ring-1 ring-[var(--border)]" />}
      </div>
      <input type="hidden" name={name} value={url} />
    </div>
  );
}