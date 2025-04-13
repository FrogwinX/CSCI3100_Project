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