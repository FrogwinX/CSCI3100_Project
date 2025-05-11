interface uploadImageResponse {
  message: string;
  data: {
    imageId: number;
    imageAPI: string;
    isSuccess: boolean;
  };
}

export function getProxyImageUrl(url: string): string {
  // Handle case where URL already contains the API path
  if (url.includes("flowchatbackend.azurewebsites.net/api/")) {
    const urlParts = url.split("/api/");
    if (urlParts.length > 1) {
      return `/api/${urlParts[1]}`;
    }
  }
  return url;
}

export async function uploadImage(file: File): Promise<{ imageId: number; imageAPI: string }> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/Image/uploadImage", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: uploadImageResponse = await response.json();
    if (!data.data.isSuccess) {
      console.error("Image upload failed:", data.message);
      return { imageId: 0, imageAPI: "" };
    }

    // Return the imageId and imageAPI
    return {
      imageId: data.data.imageId,
      imageAPI: data.data.imageAPI,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { imageId: 0, imageAPI: "" };
  }
}
