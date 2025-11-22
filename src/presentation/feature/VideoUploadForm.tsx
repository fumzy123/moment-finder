import { useState, type FormEvent, useRef } from "react";

export default function VideoUploadForm() {
  const [responseMessage, setResponseMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleVideoUpload(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);

    // todo: Update to useMutation hook
    const response = await fetch("/api/videos/", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.message) {
      setResponseMessage(data.message);
    }

    if (response.ok) {
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  }

  function triggerFileSelect() {
    fileInputRef.current?.click();
  }

  return (
    <form onSubmit={handleVideoUpload}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        id="selectedVideo"
        name="selectedVideo"
        accept="video/*"
        className="hidden"
        onChange={() => {
          // Auto-submit when file selected
          const form = fileInputRef.current?.closest("form");
          form?.requestSubmit();
        }}
      />

      {/* Upload Button */}
      <button
        type="button"
        onClick={triggerFileSelect}
        className="flex items-center gap-2 px-4 py-2 rounded-md border-b-4"
      >
        {/* <Upload size={18} /> */}
        Upload Video
      </button>

      {responseMessage && (
        <p className="mt-2 text-sm text-green-600">
          {responseMessage}
        </p>
      )}
    </form>
  );
}
