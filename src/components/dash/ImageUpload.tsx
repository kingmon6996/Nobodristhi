import { ImagePlus, X } from "lucide-react";
import { useState } from "react";

export function ImageUpload({ onChange, disabled }: { onChange?: (files: File[]) => void; disabled?: boolean }) {
  const [files, setFiles] = useState<{ file: File; url: string; name: string }[]>([]);

  const add = (list: FileList | null) => {
    if (!list || disabled) return;
    const next = Array.from(list).map((f) => ({ file: f, url: URL.createObjectURL(f), name: f.name }));
    const merged = [...files, ...next];
    setFiles(merged);
    onChange?.(merged.map((m) => m.file));
  };

  const remove = (i: number) => {
    if (disabled) return;
    const merged = files.filter((_, idx) => idx !== i);
    setFiles(merged);
    onChange?.(merged.map((m) => m.file));
  };

  return (
    <div className={disabled ? 'opacity-50 pointer-events-none' : ''}>
      <label
        className="block rounded-lg border border-dashed border-border bg-surface/40 px-6 py-10 text-center cursor-pointer hover:bg-surface transition-colors"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          add(e.dataTransfer.files);
        }}
      >
        <ImagePlus className="h-6 w-6 mx-auto text-muted-foreground" />
        <div className="mt-3 text-sm font-medium">Drop images or click to upload</div>
        <div className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP up to 10MB each</div>
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          disabled={disabled}
          onChange={(e) => add(e.target.files)}
        />
      </label>
      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
          {files.map((f, i) => (
            <div key={i} className="group relative aspect-[4/3] overflow-hidden rounded-md border border-border bg-muted">
              <img src={f.url} alt={f.name} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => remove(i)}
                disabled={disabled}
                className="absolute top-1 right-1 h-6 w-6 rounded-full bg-background/90 border border-border grid place-items-center opacity-0 group-hover:opacity-100 transition"
              >
                <X className="h-3 w-3" />
              </button>
              <div className="absolute bottom-0 inset-x-0 px-2 py-1 text-[10px] truncate bg-background/80 border-t border-border">
                {f.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
