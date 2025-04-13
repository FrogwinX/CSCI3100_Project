"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "@/hooks/useSession";
import { getAllTags, Tag, getPostById, updatePost } from "@/utils/posts";
import { useRouter } from "next/navigation";
import { getProxyImageUrl } from "@/utils/imageUtils";

interface Post {
  id: string;
  title: string;
  content: string;
  tagNameList: string[];
  imageAPIList: string[];
}

export default function EditPost({ params: paramsPromise }: { params: Promise<{ postId: string }> }) {
  const [postId, setPostId] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [isTagMenuOpen, setIsTagMenuOpen] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [textLength, setTextLength] = useState<number>(0);
  const [tagFetchError, setTagFetchError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { session, loading, refresh } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchParams = async () => {
      const params = await paramsPromise;
      setPostId(params.postId);
    };
    fetchParams();
  }, [paramsPromise]);

  useEffect(() => {
    const fetchData = async () => {
      if (loading || !postId) return;

      if (!session?.isLoggedIn || !session?.token) {
        setTagFetchError("請先登入以加載標籤");
        return;
      }

      try {
        const allTags = await getAllTags();
        if (allTags.length === 0) {
          setTagFetchError("伺服器無可用標籤");
        } else {
          setAllTags(allTags);
          setTagFetchError(null);
        }

        const post: Post | null = await getPostById(postId);
        console.log("Fetched post data:", post);

        if (post) {
          setTitle(post.title);

          const tagNameList = post.tagNameList || [];
          const postTags = tagNameList
            .map((tagName) => {
              const matchingTag = allTags.find((t) => t.tagName === tagName);
              return matchingTag || { tagId: "", tagName };
            })
            .filter((tag) => tag.tagId !== "");
          setTags(postTags);
          console.log("Converted tags:", postTags);

          setExistingImages(post.imageAPIList || []);
          console.log("Post images:", post.imageAPIList);

          let newContent = post.content || "";
          newContent = newContent.replace(/\n/g, "<br>");
          const div = document.createElement("div");
          div.innerHTML = newContent;

          if (post.imageAPIList && post.imageAPIList.length > 0) {
            post.imageAPIList.forEach((imageUrl, index) => {
              const wrapper = document.createElement("div");
              wrapper.className = "relative w-full my-2";
              wrapper.dataset.imageUrl = imageUrl;
              wrapper.dataset.fileName = `image-${index + 1}`;
              wrapper.innerHTML = `<div class="image-placeholder-${index}"></div><br>`;
              div.appendChild(wrapper);
            });
          }

          if (!contentRef.current) {
            console.error("contentRef 未準備好");
            return;
          }
          contentRef.current.innerHTML = div.innerHTML;
          setContent(div.innerHTML);

          // 動態渲染圖片，使用代理路由
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
                    <img src="${proxyImageUrl}" alt="Existing Image" style="max-width: 100%; height: auto; display: none;" data-file-name="image-${index + 1}" />
                    <p class="text-red-500" style="display: none;">無法加載圖片: 伺服器錯誤</p>
                  </div>
                `;
                placeholder.replaceWith(imgWrapper);

                // 添加事件監聽器處理圖片加載和錯誤
                const img = imgWrapper.querySelector("img");
                const skeleton = imgWrapper.querySelector(".skeleton");
                const errorMessage = imgWrapper.querySelector("p.text-red-500");

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

                  // 清理事件監聽器，避免重複添加
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
        } else {
          setTagFetchError("找不到貼文");
        }
      } catch (error) {
        console.error("加載資料失敗:", error);
        setTagFetchError("無法加載資料");
        setAllTags([]);
      }
    };

    fetchData();
  }, [session, loading, postId]);

  const handleAddTag = () => {
    if (loading) return;

    if (!session?.isLoggedIn) {
      alert("Please log in to select tags");
      return;
    }

    setIsTagMenuOpen((prev) => !prev);
  };

  const toggleTag = (tag: Tag) => {
    if (tags.some((t) => t.tagId === tag.tagId)) {
      setTags(tags.filter((t) => t.tagId !== tag.tagId));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleImageUpload = () => {
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      if (!file.type.match("image/(png|jpeg)")) {
        setSubmitError("Only PNG and JPEG formats are supported");
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setSubmitError("Image file is too large, maximum limit is 5MB");
        return;
      }

      const extension = file.name.split(".").pop();
      const newFileName = `image-${images.length + existingImages.length + 1}.${extension}`;
      const renamedFile = new File([file], newFileName, { type: file.type });

      setImages((prevImages) => [...prevImages, renamedFile]);

      const imgSrc = URL.createObjectURL(file);
      const imgElement = document.createElement("img");
      imgElement.src = imgSrc;
      imgElement.alt = "Uploaded Image";
      imgElement.dataset.fileName = newFileName;
      imgElement.style.maxWidth = "100%";
      imgElement.style.height = "auto";
      if (contentRef.current) {
        contentRef.current.appendChild(imgElement);
        contentRef.current.appendChild(document.createElement("br"));
      }
    }
  };

  const handleClipClick = () => {
    fileInputRef.current?.click();
  };

  const getTextLength = (text: string) => {
    const cleanText = text.replace(/\[image:[^\]]+\]/g, "");
    return cleanText.length || 0;
  };

  const handleContentChange = () => {
    if (contentRef.current) {
      const div = document.createElement("div");
      div.innerHTML = contentRef.current.innerHTML;
      const images = div.querySelectorAll("img");
      images.forEach((img) => {
        const fileName = img.dataset.fileName || "";
        if (fileName) {
          const placeholder = `[image:${fileName}]`;
          const textNode = document.createTextNode(placeholder);
          img.parentNode?.replaceChild(textNode, img);
        }
      });

      const formattedContent = div.innerHTML;
      setContent(formattedContent);

      const cleanText = div.textContent || "";
      setTextLength(getTextLength(cleanText));
    }
  };

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

  useEffect(() => {
    if (contentRef.current) {
      const textContent = contentRef.current.textContent || "";
      const length = getTextLength(textContent);
      if (length > 1000) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.isLoggedIn) {
      setSubmitError("Please log in first");
      return;
    }

    if (!title || !content) {
      setSubmitError("Title and content cannot be empty");
      return;
    }

    setSubmitError(null);

    if (!postId) {
      setSubmitError("Post ID is not available");
      return;
    }

    try {
      await updatePost(postId, title, content, tags, images, existingImages);
      router.push(`/forum/post/${postId}`);
    } catch (error: any) {
      console.error("Update post error:", error);
      if (error.message.includes("Authentication failed")) {
        setSubmitError("Authentication failed, please log in again");
        refresh();
      } else if (error.message.includes("Unsupported media type")) {
        setSubmitError("Unsupported request format, please contact the administrator");
      } else if (error.message.includes("Server error")) {
        setSubmitError("Server error, please contact the administrator");
      } else {
        setSubmitError(error.message || "Failed to update post, please try again later");
      }
    }
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
            className="input input-bordered w-full rounded-lg"
          />
          <div className="flex justify-end">
            <span className="text-sm text-gray-500 mt-1">{title.length}/100</span>
          </div>
        </div>
        <div className="form-control">
          <div className="flex items-center space-x-2 flex-wrap gap-2">
            <button
              type="button"
              onClick={handleAddTag}
              className="btn btn-outline btn-primary rounded-lg"
            >
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
                <span className="text-sm text-gray-500">No tags selected</span>
              )}
            </div>
          </div>
          {isTagMenuOpen && (
            <div className="mt-2 p-4 bg-gray-100 rounded-lg shadow max-h-60 overflow-y-auto">
              {loading ? (
                <p>Loading tags...</p>
              ) : tagFetchError ? (
                <p className="text-red-500">{tagFetchError}</p>
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
            <span className="label-text">Post Content</span>
          </label>
          <div className="border border-gray-300 rounded-t-lg">
            <div className="bg-gray-100 p-2 flex space-x-1 border-b border-gray-300">
              <button type="button" className="btn btn-ghost btn-xs text-gray-600">
                <span className="font-bold">B</span>
              </button>
              <button type="button" className="btn btn-ghost btn-xs text-gray-600">
                <span className="italic">I</span>
              </button>
              <button type="button" className="btn btn-ghost btn-xs text-gray-600">
                <span className="underline">U</span>
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-xs text-gray-600"
                onClick={handleClipClick}
              >
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
              className="w-full p-2 border border-gray-300 rounded-b-lg focus:outline-none"
              style={{ minHeight: "10rem", overflowY: "auto" }}
            />
          </div>
          <div className="flex justify-end">
            <span className="text-sm text-gray-500 mt-1">{textLength}/1000</span>
          </div>
        </div>
        {submitError && <p className="text-red-500">{submitError}</p>}
        <button
          type="submit"
          className="btn bg-[#A3DFFA] text-[#1A3C34] hover:bg-[#8CCFF7] float-right rounded-lg"
        >
          Save
        </button>
      </form>
    </div>
  );
}