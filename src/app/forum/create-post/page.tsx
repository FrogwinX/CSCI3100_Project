"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "@/hooks/useSession";
import { getAllTags, Tag, createPost } from "@/utils/posts";
import { useRouter } from "next/navigation";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef as useDnDRef, useState as useDnDState } from "react";

export default function CreatePost() {
  // State variables
  const [title, setTitle] = useState<string>(""); // Post title
  const [tags, setTags] = useState<Tag[]>([]); // Selected tags
  const [allTags, setAllTags] = useState<Tag[]>([]); // All available tags from server
  const [isTagMenuOpen, setIsTagMenuOpen] = useState<boolean>(false); // Toggle for tag selection menu
  const [content, setContent] = useState<string>(""); // Post content (HTML string with placeholders)
  const [textLength, setTextLength] = useState<number>(0); // Length of the plain text content
  const [tagFetchError, setTagFetchError] = useState<string | null>(null); // Error message for tag fetching
  const [submitError, setSubmitError] = useState<string | null>(null); // Error message for post submission
  const [images, setImages] = useState<File[]>([]); // Uploaded image files
  const fileInputRef = useRef<HTMLInputElement>(null); // Reference to file input for image upload
  const contentRef = useRef<HTMLDivElement>(null); // Reference to content editable div
  const [dragIndex, setDragIndex] = useDnDState<number | null>(null);
  const dragOverIndex = useDnDRef<number | null>(null);

  const { session, loading, refresh } = useSession();
  const router = useRouter();

  // Fetch all tags when the component mounts or session changes
  useEffect(() => {
    const fetchTags = async () => {
      if (loading) return; // Wait for session to load

      if (!session?.isLoggedIn || !session?.token) {
        setTagFetchError("Please log in to load tags");
        return;
      }

      try {
        const tags = await getAllTags();
        if (tags.length === 0) {
          setTagFetchError("No tags available from server");
        } else {
          setAllTags(tags);
          setTagFetchError(null);
        }
      } catch {
        setTagFetchError("Failed to load tags");
        setAllTags([]);
      }
    };

    fetchTags();
  }, [session, loading]);

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
  const handleImageUpload = () => {
    const files = fileInputRef.current?.files;
    if (!files || files.length === 0) return;

    const newImages: File[] = [];
    let insertTags: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Validate file type (only PNG and JPEG allowed)
      if (!file.type.match("image/(png|jpeg)")) {
        setSubmitError("Only PNG and JPEG formats are supported");
        continue;
      }
      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setSubmitError("Image file is too large, maximum limit is 5MB");
        continue;
      }
      // Rename file using a simple format
      const extension = file.name.split(".").pop();
      const newFileName = `image-${images.length + newImages.length + 1}.${extension}`;
      const renamedFile = new File([file], newFileName, { type: file.type });
      newImages.push(renamedFile);
      insertTags.push(`[image:${newFileName}]`);
    }
    if (newImages.length === 0) return;
    setImages((prevImages) => [...prevImages, ...newImages]);

    // 在光標處插入多個 [image:xxx]
    if (contentRef.current) {
      contentRef.current.focus(); // 確保focus不會跑到title
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const placeholder = insertTags.join('');
        range.deleteContents();
        range.insertNode(document.createTextNode(placeholder));
        // 移動光標到placeholder之後
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
        handleContentChange();
      } else {
        // 沒有光標時直接加到最後
        contentRef.current.appendChild(document.createTextNode(insertTags.join('')));
        handleContentChange();
      }
    } else {
      // 沒有contentRef時直接setContent
      setContent((prev) => prev + insertTags.join(''));
    }
  };

  // Trigger file input click for image upload
  const handleClipClick = () => {
    fileInputRef.current?.click();
  };

  // Calculate the length of the plain text content (excluding image placeholders)
  const getTextLength = (text: string) => {
    // Remove image placeholders to calculate the actual text length
    const cleanText = text.replace(/\[image:[^\]]+\]/g, "");
    return cleanText.length || 0;
  };

  // Handle changes in the content editable div
  const handleContentChange = () => {
    if (contentRef.current) {
      // Get the HTML content and replace images with placeholders
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
      images.forEach((img) => {
        const fileName = img.dataset.fileName || "";
        if (fileName) {
          const placeholder = `[image:${fileName}]`;
          const textNode = document.createTextNode(placeholder);
          img.parentNode?.replaceChild(textNode, img);
        }
      });

      // Preserve the HTML structure
      const formattedContent = div.innerHTML;
      setContent(formattedContent);

      // Calculate the text length (excluding image placeholders)
      const cleanText = div.textContent || "";
      setTextLength(getTextLength(cleanText));
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

  // Handle form submission to create a post
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

    try {
      const postId = await createPost(title, content, tags, images);
      if (postId) {
        // Navigate to the newly created post's page
        router.push(`/forum/post/${postId}`);
      } else {
        setSubmitError("Failed to create post, unable to retrieve post ID");
      }
    } catch (error: unknown) {
      // Set message to either standard error message or API error message
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes("Authentication failed")) {
        setSubmitError("Authentication failed, please log in again");
        refresh();
      } else if (message.includes("Unsupported media type")) {
        setSubmitError("Unsupported request format, please contact the administrator");
      } else if (message.includes("Server error")) {
        setSubmitError("Server error, please contact the administrator");
      } else {
        setSubmitError(message || "Failed to create post, please try again later");
      }
    }
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

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };
  const handleDragOver = (index: number) => {
    dragOverIndex.current = index;
  };
  const handleDrop = () => {
    if (dragIndex === null || dragOverIndex.current === null || dragIndex === dragOverIndex.current) {
      setDragIndex(null);
      dragOverIndex.current = null;
      return;
    }
    // 調整 images 狀態
    setImages((prev) => {
      const newArr = [...prev];
      const [removed] = newArr.splice(dragIndex, 1);
      newArr.splice(dragOverIndex.current!, 0, removed);
      return newArr;
    });
    // 調整 content 裡的 [image:xxx] 順序
    setContent((prevContent) => {
      const regex = /\[image:[^\]]+\]/g;
      let tagsInContent = prevContent.match(regex) || [];
      // 用新順序替換
      const newTags = images.map(img => `[image:${img.name}]`);
      let idx = 0;
      let replaced = prevContent.replace(regex, () => newTags[idx++] || "");
      return replaced;
    });
    setDragIndex(null);
    dragOverIndex.current = null;
  };

  return (
    <div className="w-full px-4 pt-4 pb-6 h-full">
      <h1 className="text-4xl font-bold mb-6">Create Post</h1>
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
              {tags.map((tag) => (
                <span key={tag.tagId} className="badge badge-primary">
                  {tag.tagName}
                </span>
              ))}
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
                <FontAwesomeIcon icon={faImage} />
              </button>
              <input
                type="file"
                accept="image/png,image/jpeg"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
                multiple
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
        {images.length > 0 && (
          <div className="flex gap-2 flex-wrap my-2">
            {images.map((img, idx) => (
              <div
                key={img.name}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={e => { e.preventDefault(); handleDragOver(idx); }}
                onDrop={handleDrop}
                className={`relative border rounded p-1 bg-base-200 ${dragIndex === idx ? 'ring-2 ring-primary' : ''}`}
                style={{ width: 80, height: 80 }}
              >
                <img src={URL.createObjectURL(img)} alt={img.name} className="object-cover w-full h-full rounded" />
                <div className="absolute top-0 right-0 text-xs bg-error text-white rounded px-1 cursor-pointer" onClick={() => setImages(images.filter((_, i) => i !== idx))}>×</div>
              </div>
            ))}
          </div>
        )}
        {submitError && <p className="text-error">{submitError}</p>}
        <button type="submit" className="btn btn-primary float-right rounded-lg">
          Post
        </button>
      </form>
    </div>
  );
}
