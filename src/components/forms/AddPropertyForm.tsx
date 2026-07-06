"use client";

import { useState } from "react";
import { createProperty } from "@/lib/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Plus } from "lucide-react";

export function AddPropertyForm() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Tambah Properti</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Tambah Properti" description="Isi data kos atau kontrakan baru">
        <form action={async (fd) => { await createProperty(fd); setOpen(false); }} className="space-y-4">
          <Input label="Nama Kos" name="name" placeholder="Kos Melati" required />
          <Input label="Alamat" name="address" placeholder="Jl. Melati No. 12" required />
          <Input label="Kota" name="city" placeholder="Bandung" required />
          <Input label="Nama Pemilik" name="ownerName" placeholder="Pak Budi" required />
          <Input label="No. WhatsApp" name="ownerPhone" placeholder="081234567890" required />
          <Input label="Catatan" name="notes" placeholder="Opsional" />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setOpen(false)}>Batal</Button>
            <Button type="submit" className="flex-1">Simpan</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}