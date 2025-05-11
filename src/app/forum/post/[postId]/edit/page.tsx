"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "@/hooks/useSession";
import { getAllTags, Tag, getPostById, updatePost } from "@/utils/posts";
import { useRouter } from "next/navigation";
import { getProxyImageUrl, uploadImage } from "@/utils/images";
import { Post } from "@/utils/posts";

// EditPost component for editing an existing post
export default function EditPost({ params: paramsPromise }: { params: Promise<{ postId: string }> }) {
  // State variables
  const [postId, setPostId] = useState<string | null>(null); // Post ID
  const [title, setTitle] = useState<string>(""); // Post title
  const [tags, setTags] = useState<Tag[]>([]); // Selected tags
  const [allTags, setAllTags] = useState<Tag[]>([]); // All available tags from the server
  const [isTagMenuOpen, setIsTagMenuOpen] = useState<boolean>(false); // Toggle for tag selection menu
  const [content, setContent] = useState<string>(""); // Post content (HTML string with placeholders)
  const [textLength, setTextLength] = useState<number>(0); // Length of plain text content
  const [tagFetchError, setTagFetchError] = useState<string | null>(null); // Error message for tag fetching
  const [submitError, setSubmitError] = useState<string | null>(null); // Error message for post submission
  const [images, setImages] = useState<File[]>([]); // New images uploaded by the user
  const [existingImages, setExistingImages] = useState<string[]>([]); // Existing image URLs from the post
  const fileInputRef = useRef<HTMLInputElement>(null); // Reference to file input for image upload
  const contentRef = useRef<HTMLDivElement>(null); // Reference to content editable div
  const [showPreview, setShowPreview] = useState<boolean>(false);   

  const { session, loading, refresh } = useSession();
  const router = useRouter();

  // Fetch the post ID from params when the component mounts
  useEffect(() => {
    const fetchParams = async () => {
      const params = await paramsPromise;
      setPostId(params.postId);
    };
    fetchParams();
  }, [paramsPromise]);

  // Fetch tags and post data when the component mounts or session changes
  useEffect(() => {
    const fetchData = async () => {
      if (loading || !postId) return;

      if (!session?.isLoggedIn || !session?.token) {
        setTagFetchError("Please log in to load tags");
        return;
      }
      console.log(images);
      try {
        // Fetch all available tags
        const allTags = await getAllTags();
        if (allTags.length === 0) {
          setTagFetchError("No tags available from server");
        } else {
          setAllTags(allTags);
          setTagFetchError(null);
        }

        // Fetch the post data by ID
        const post: Post | null = await getPostById(postId);
        console.log("Fetched post data:", post);

        if (post) {
          setTitle(post.title);

          // Convert tag names to Tag objects
          const tagNameList = post.tagNameList || [];
          const postTags = tagNameList
            .map((tagName) => {
              const matchingTag = allTags.find((t) => t.tagName === tagName);
              return matchingTag || { tagId: "", tagName };
            })
            .filter((tag) => tag.tagId !== "");
          setTags(postTags);
          console.log("Converted tags:", postTags);

          // Set existing images from the post
          setExistingImages(post.imageAPIList || []);
          console.log("Post images:", post.imageAPIList);

          // Prepare the post content for the contentEditable div
          let newContent = post.content || "";
          newContent = newContent.replace(/\n/g, "<br>");
          const div = document.createElement("div");
          div.innerHTML = newContent;

          // Add placeholders for existing images
          if (post.imageAPIList && post.imageAPIList.length > 0) {
            post.imageAPIList.forEach((imageUrl, index) => {
              const wrapper = document.createElement("div");
              wrapper.className = "relative w-full my-2";
              wrapper.dataset.imageUrl = imageUrl;
              // Use the image URL as a unique identifier
              wrapper.dataset.imageId = imageUrl;
              wrapper.innerHTML = `<div class="image-placeholder-${index}"></div><br>`;
              div.appendChild(wrapper);
            });
          }

          if (!contentRef.current) {
            console.error("contentRef is not ready");
            return;
          }
          contentRef.current.innerHTML = div.innerHTML;
          setContent(div.innerHTML);

          // Dynamically render images using proxy URLs
          if (post.imageAPIList && post.imageAPIList.length > 0) {
            post.imageAPIList.forEach((imageUrl, index) => {
              const placeholder = contentRef.current?.querySelector(`.image-placeholder-${index}`);
              if (placeholder) {
                const proxyImageUrl = getProxyImageUrl(imageUrl);
                const imgWrapper = document.createElement("div");
                imgWrapper.className = "relative w-full";
                imgWrapper.innerHTML = `
                  <div class="image-container">
                    <div class="skeleton w-full h-48"></div>
                    <img src="${proxyImageUrl}" alt="Existing Image" style="max-width: 100%; height: auto; display: none;" data-image-id="${imageUrl}" />
                    <p class="text-red-500" style="display: none;"></p>
                  </div>
                `;
                placeholder.replaceWith(imgWrapper);

                const img = imgWrapper.querySelector("img") as HTMLImageElement;
                const skeleton = imgWrapper.querySelector(".skeleton") as HTMLDivElement;
                const errorMessage = imgWrapper.querySelector("p.text-red-500") as HTMLParagraphElement;

                if (img && skeleton && errorMessage) {
                  const onLoadHandler = () => {
                    skeleton.style.display = "none";
                    img.style.display = "block";
                  };

                  const onErrorHandler = () => {
                    skeleton.style.display = "none";
                    errorMessage.style.display = "block";
                    img.style.display = "none";
                  };

                  img.addEventListener("load", onLoadHandler);
                  img.addEventListener("error", onErrorHandler);

                  // Clean up event listeners to avoid duplicates
                  return () => {
                    img.removeEventListener("load", onLoadHandler);
                    img.removeEventListener("error", onErrorHandler);
                  };
                }
              }
            });
          }

          const cleanText = div.textContent || "";
          setTextLength(getTextLength(cleanText));

          const imageIndexes = (cleanText.match(/\[image:(?:image-)?(\d+)\.jpg\]/g) || [])
            .map(tag => Number(tag.match(/\[image:(?:image-)?(\d+)\.jpg\]/)?.[1] ?? 0));
          console.log("x values in [image:x]:", imageIndexes);
          // Check if continuous
          const isContinuous = imageIndexes.every((val, idx) => val === idx + 1);
          console.log("Are x values continuous and starting from 1:", isContinuous);

          const brTags = cleanText.match(/\[br\]/g) || [];
          console.log("Number of [br] tags:", brTags.length);

          const htmlTags = cleanText.match(/<[^>]+>/g) || [];
          console.log("Remaining html tags:", htmlTags);
        } else {
          setTagFetchError("Post not found");
        }
      } catch (error) {
        console.error("Failed to load data:", error);
        setTagFetchError("Failed to load data");
        setAllTags([]);
      }
    };

    fetchData();
  }, [session, loading, postId]);

  // Toggle the tag selection menu
  const handleAddTag = () => {
    if (loading) return;

    if (!session?.isLoggedIn) {
      alert("Please log in to select tags");
      return;
    }

    setIsTagMenuOpen((prev) => !prev);
  };

  // Add or remove a tag from the selected tags
  const toggleTag = (tag: Tag) => {
    if (tags.some((t) => t.tagId === tag.tagId)) {
      setTags(tags.filter((t) => t.tagId !== tag.tagId));
    } else {
      setTags([...tags, tag]);
    }
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type (only PNG and JPEG allowed)
      if (!file.type.match("image/(png|jpeg)")) {
        setSubmitError("Only PNG and JPEG formats are supported");
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setSubmitError("Image file is too large, maximum limit is 5MB");
        return;
      }

      try {
        // Upload the image and get the imageAPI
        const { imageAPI } = await uploadImage(file);
        if (!imageAPI) {
          setSubmitError("Failed to upload image");
          return;
        }

        // Add the image to the images state
        setImages((prevImages) => [...prevImages, file]);

        // 在光標處插入 [image:xxx]
        if (contentRef.current) {
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const placeholder = `[image:${imageAPI}]`;
            range.deleteContents();
            range.insertNode(document.createTextNode(placeholder));
            // 移動光標到placeholder之後
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
            // 觸發內容變更
            handleContentChange();
          } else {
            // 沒有光標時直接加到最後
            contentRef.current.appendChild(document.createTextNode(`[image:${imageAPI}]`));
            handleContentChange();
          }
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        setSubmitError("Failed to upload image");
      }
    }
  };

  // Trigger file input click for image upload
  const handleClipClick = () => {
    fileInputRef.current?.click();
  };

  // Calculate the length of the plain text content (excluding image placeholders)
  const getTextLength = (text: string) => {
    const cleanText = text.replace(/\[image:[^\]]+\]/g, "");
    return cleanText.length || 0;
  };

  // Handle changes in the content editable div
  const handleContentChange = () => {
    if (contentRef.current) {
      const div = document.createElement("div");
      div.innerHTML = contentRef.current.innerHTML;
      
      // Log original HTML content
      console.log('Original HTML content:', div.innerHTML);
      
      // Replace custom tags with HTML tags
      let content = div.innerHTML;
      content = content.replace(/\[b\](.*?)\[\/b\]/g, '<b>$1</b>');
      content = content.replace(/\[i\](.*?)\[\/i\]/g, '<i>$1</i>');
      content = content.replace(/\[u\](.*?)\[\/u\]/g, '<u>$1</u>');
      content = content.replace(/<br\s*\/?>/g, '[br]');
      // 彻底去除所有<div>和</div>
      content = content.replace(/<div\s*\/?>/g, '');
      content = content.replace(/<\/div>/g, '');
      
      // Log processed content
      console.log('Processed content:', content);
      
      // Log custom tags found
      const boldTags = (content.match(/\[b\](.*?)\[\/b\]/g) || []).length;
      const italicTags = (content.match(/\[i\](.*?)\[\/i\]/g) || []).length;
      const underlineTags = (content.match(/\[u\](.*?)\[\/u\]/g) || []).length;
      const brTags = (content.match(/\[br\]/g) || []).length;
      const divTags = (content.match(/\[div\](.*?)\[\/div\]/g) || []).length;
      const imageTags = (content.match(/\[image:[^\]]+\]/g) || []).length;
      
      console.log('Custom tags found:', {
        bold: boldTags,
        italic: italicTags,
        underline: underlineTags,
        br: brTags,
        div: divTags,
        image: imageTags
      });
      
      // Handle images
      const images = div.querySelectorAll("img");
      const remainingImageIds: string[] = [];

      // Replace images with placeholders and collect remaining image IDs
      images.forEach((img) => {
        const imageId = img.dataset.imageId || "";
        if (imageId) {
          const placeholder = `[image:${imageId}]`;
          const textNode = document.createTextNode(placeholder);
          img.parentNode?.replaceChild(textNode, img);
          remainingImageIds.push(imageId);
        }
      });

      // Update content state with the formatted HTML
      const formattedContent = div.innerHTML;
      setContent(formattedContent);

      // Calculate the text length (excluding image placeholders)
      const cleanText = div.textContent || "";
      setTextLength(getTextLength(cleanText));

      // Update existingImages to only include images still present in the content
      setExistingImages((prevImages) => {
        return prevImages.filter((imageUrl) => remainingImageIds.includes(imageUrl));
      });

      // Update images to only include new uploads still present in the content
      setImages((prevImages) => {
        return prevImages.filter((image) => remainingImageIds.includes(image.name));
      });
    }
  };

  // Adjust the height of the content editor dynamically
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.height = "auto";
      const contentHeight = contentRef.current.scrollHeight;
      const windowHeight = typeof window !== "undefined" ? window.innerHeight : 0;
      const fixedHeight = 4 * 16 + 3 * 16 + 3.75 * 16 + 2 * 16 + 1.125 * 16;
      const maxHeight = windowHeight > 0 ? windowHeight - fixedHeight : 9999;
      const newHeight = Math.min(Math.max(contentHeight, 160), maxHeight);
      contentRef.current.style.height = `${newHeight}px`;
    }
  }, [content]);

  // Limit the content length to 1000 characters (excluding image placeholders)
  useEffect(() => {
    if (contentRef.current) {
      const textContent = contentRef.current.textContent || "";
      const length = getTextLength(textContent);
      if (length > 1000) {
        // Truncate the text while preserving the HTML structure
        const div = document.createElement("div");
        div.innerHTML = contentRef.current.innerHTML;
        let currentLength = 0;
        const nodes = Array.from(div.childNodes);
        const newNodes: Node[] = [];

        for (const node of nodes) {
          if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent || "";
            const cleanText = text.replace(/\[image:[^\]]+\]/g, "");
            if (currentLength + cleanText.length <= 1000) {
              newNodes.push(node);
              currentLength += cleanText.length;
            } else {
              const remainingLength = 1000 - currentLength;
              const truncatedText = cleanText.substring(0, remainingLength);
              const newTextNode = document.createTextNode(truncatedText);
              newNodes.push(newTextNode);
              break;
            }
          } else if (node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName === "BR") {
            newNodes.push(node);
          }
        }

        div.innerHTML = "";
        newNodes.forEach((node) => div.appendChild(node));
        contentRef.current.innerHTML = div.innerHTML;
        setContent(div.innerHTML);
        setTextLength(1000);
      } else {
        setTextLength(length);
      }
    }
  }, [content]);

  // Handle form submission to update the post
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is logged in
    if (!session?.isLoggedIn) {
      setSubmitError("Please log in first");
      return;
    }

    // Validate title and content
    if (!title || !content) {
      setSubmitError("Title and content cannot be empty");
      return;
    }

    setSubmitError(null);

    // Check if post ID is available
    if (!postId) {
      setSubmitError("Post ID is not available");
      return;
    }

    try {
      console.log("images", images, "existingImages", existingImages);
      await updatePost(postId, title, content, tags, images, existingImages);
      router.push(`/forum/post/${postId}`);
    } catch (error: unknown) {
      // Set message to either standard error message or API error message
      const message = error instanceof Error ? error.message : String(error);
      console.error("Update post error:", message);
      if (message.includes("Authentication failed")) {
        setSubmitError("Authentication failed, please log in again");
        refresh();
      } else if (message.includes("Unsupported media type")) {
        setSubmitError("Unsupported request format, please contact the administrator");
      } else if (message.includes("Server error")) {
        setSubmitError("Server error, please contact the administrator");
      } else {
        setSubmitError(message || "Failed to update post, please try again later");
      }
    }
  };

    
  const handlePreviewToggle = () => {
    setShowPreview((prev) => !prev);
  };

  // Add these functions before the return statement
  const insertTag = (type: 'bold' | 'italic' | 'underline') => {
    if (!contentRef.current) return;
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    let tagStart = '';
    let tagEnd = '';
    
    switch (type) {
      case 'bold':
        tagStart = '[b]';
        tagEnd = '[/b]';
        break;
      case 'italic':
        tagStart = '[i]';
        tagEnd = '[/i]';
        break;
      case 'underline':
        tagStart = '[u]';
        tagEnd = '[/u]';
        break;
    }
    
    const newText = tagStart + selectedText + tagEnd;
    range.deleteContents();
    range.insertNode(document.createTextNode(newText));
    
    // Trigger content change
    handleContentChange();
  };

  return (
    <div className="w-full px-4 pt-4 pb-6 min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Edit Post</h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="form-control">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            placeholder="Title"
            className="input input-bordered w-full rounded-lg border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <div className="flex justify-end">
            <span className="text-sm text-base-content/70 mt-1">{title.length}/100</span>
          </div>
        </div>
        <div className="form-control">
          <div className="flex items-center space-x-2 flex-wrap gap-2">
            <button type="button" onClick={handleAddTag} className="btn btn-outline btn-primary rounded-lg">
              {isTagMenuOpen ? "Close Tags" : "Add Tags"}
            </button>
            <div className="flex flex-wrap gap-2">
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <span key={tag.tagId} className="badge badge-primary">
                    {tag.tagName}
                  </span>
                ))
              ) : (
                <span className="text-sm text-base-content/70">No tags selected</span>
              )}
            </div>
          </div>
          {isTagMenuOpen && (
            <div className="mt-2 p-4 bg-base-200 rounded-lg shadow max-h-60 overflow-y-auto">
              {loading ? (
                <p>Loading tags...</p>
              ) : tagFetchError ? (
                <p className="text-error">{tagFetchError}</p>
              ) : session?.isLoggedIn ? (
                allTags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <button
                        key={tag.tagId}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`btn btn-sm ${
                          tags.some((t) => t.tagId === tag.tagId) ? "btn-primary" : "btn-accent"
                        }`}
                      >
                        {tag.tagName}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p>No tags available</p>
                )
              ) : (
                <p>Please log in to select tags</p>
              )}
            </div>
          )}
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text text-base-content">Post Content</span>
          </label>
          <div className="border border-base-300 rounded-t-lg">
            <div className="bg-base-200 p-2 flex space-x-1 border-b border-base-300">
              <button type="button" className="btn btn-ghost btn-xs text-base-content/70" onClick={() => insertTag('bold')}>
                <span className="font-bold">B</span>
              </button>
              <button type="button" className="btn btn-ghost btn-xs text-base-content/70" onClick={() => insertTag('italic')}>
                <span className="italic">I</span>
              </button>
              <button type="button" className="btn btn-ghost btn-xs text-base-content/70" onClick={() => insertTag('underline')}>
                <span className="underline">U</span>
              </button>
              <button type="button" className="btn btn-ghost btn-xs text-base-content/70" onClick={handleClipClick}>
                <span>📎</span>
              </button>
              <input
                type="file"
                accept="image/png,image/jpeg"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <div
              ref={contentRef}
              contentEditable
              onInput={handleContentChange}
              className="w-full p-2 border border-base-300 rounded-b-lg focus:outline-none"
              style={{ minHeight: "10rem", overflowY: "auto" }}
            />
          </div>
          <div className="flex justify-end">
            <span className="text-sm text-base-content/70 mt-1">{textLength}/1000</span>
          </div>
        </div>
        {submitError && <p className="text-error">{submitError}</p>}
        <button type="submit" className="btn btn-primary float-right rounded-lg">
          Save
        </button>
      </form>
    </div>
  );
}
