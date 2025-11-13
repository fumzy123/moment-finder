import { useState, type FormEvent } from "react";

export default function VideoUploadForm() {
    // State
    const [responseMessage, setResponseMessage] = useState("");

    // Handle Event
    async function handleVideoUpload(event: FormEvent<HTMLFormElement>) {
        // Prevent the default form submission behavior of the browser
        event.preventDefault();

        const formData = new FormData(event.target as HTMLFormElement);
        const response = await fetch('/api/videos/', {
            method: 'POST',
            body: formData
        })
        const data = await response.json();

        if (data.message) {
            setResponseMessage(data.message);
        }

         // ✅ Reload index page after successful upload
        if (response.ok) {
            // small delay to show success message (optional)
            setTimeout(() => {
                window.location.reload();
                // or: window.location.href = "/";
            }, 1000);
        }
    }

    // Render
    return (
        <form onSubmit={handleVideoUpload}>
            <div>
                <label htmlFor="selectedVideo">Upload a Video</label>
                <input
                    type="file"
                    id="selectedVideo"
                    name="selectedVideo"
                    accept="video/*"
                />
            </div>
            <button type="submit">Submit</button>
            {responseMessage && <p>{responseMessage}</p>}
        </form>
    )
}