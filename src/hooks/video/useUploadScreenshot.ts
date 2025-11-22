import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUploadScreenshot(videoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(`/api/videos/${videoId}/screenshots`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed: ${res.statusText}`);
      } else {
        console.log("Screenshot taken successfully");
      }

      return res.json();
    },

    // 🚀 After upload → refresh the screenshots
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["screenshots", videoId],
      });
    },

    onError: (err) => {
      console.error("Error uploading screenshot:", err);
    },
  });
}
