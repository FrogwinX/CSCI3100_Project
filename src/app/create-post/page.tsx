'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from '@/hooks/useSession';
import { getAllTags, Tag, createPost } from '@/utils/posts'; 
import { useRouter } from 'next/navigation'; 
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"; // Import FontAwesome icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesome component

export default function CreatePost() {
  // State variables
  const [title, setTitle] = useState<string>(''); // Post title
  const [tags, setTags] = useState<Tag[]>([]); // Selected tags
  const [allTags, setAllTags] = useState<Tag[]>([]); // All available tags from server
  const [isTagMenuOpen, setIsTagMenuOpen] = useState<boolean>(false); // Toggle for tag selection menu
  const [content, setContent] = useState<string>(''); // Post content (plain text)
  const [textLength, setTextLength] = useState<number>(0); // Length of the content text
  const [tagFetchError, setTagFetchError] = useState<string | null>(null); // Error message for tag fetching
  const [submitError, setSubmitError] = useState<string | null>(null); // Error message for post submission
  const [images, setImages] = useState<File[]>([]); // Uploaded image files
  const fileInputRef = useRef<HTMLInputElement>(null); // Reference to file input for image upload
  const contentRef = useRef<HTMLDivElement>(null); // Reference to content editable div

  const { session, loading, refresh } = useSession();
  const router = useRouter();

  // Fetch all tags when the component mounts or session changes
  useEffect(() => {
    const fetchTags = async () => {
      if (loading) return; // Wait for session to load

      if (!session?.isLoggedIn || !session?.token) {
        setTagFetchError('Please log in to load tags');
        return;
      }

      try {
        const tags = await getAllTags();
        if (tags.length === 0) {
          setTagFetchError('No tags available from server');
        } else {
          setAllTags(tags);
          setTagFetchError(null);
        }
      } catch (error) {
        setTagFetchError('Failed to load tags');
        setAllTags([]);
      }
    };

    fetchTags();
  }, [session, loading]);

  // Toggle the tag selection menu
  const handleAddTag = () => {
    if (loading) return;

    if (!session?.isLoggedIn) {
      alert('Please log in to select tags');
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
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      // Validate file type (only PNG and JPEG allowed)
      if (!file.type.match('image/(png|jpeg)')) {
        setSubmitError('Only PNG and JPEG formats are supported');
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setSubmitError('Image file is too large, maximum limit is 5MB');
        return;
      }

      // Rename file using a simple format
      const extension = file.name.split('.').pop();
      const newFileName = `image-${images.length + 1}.${extension}`;
      const renamedFile = new File([file], newFileName, { type: file.type });

      // Add the image to the images state
      setImages((prevImages) => [...prevImages, renamedFile]);

      // Display the image in the editor using a temporary URL and insert a placeholder
      const imgSrc = URL.createObjectURL(file);
      const imgElement = document.createElement('img');
      imgElement.src = imgSrc;
      imgElement.alt = 'Uploaded Image';
      imgElement.dataset.fileName = newFileName;
      imgElement.style.maxWidth = '100%';
      imgElement.style.height = 'auto';
      if (contentRef.current) {
        contentRef.current.appendChild(imgElement);
        contentRef.current.appendChild(document.createElement('br'));
      }
    }
  };

  // Trigger file input click for image upload
  const handleClipClick = () => {
    fileInputRef.current?.click();
  };

  // Calculate the length of the plain text content
  const getTextLength = (text: string) => {
    return text.length || 0;
  };

  // Handle changes in the content editable div
  const handleContentChange = () => {
    if (contentRef.current) {
      // Extract plain text content and replace images with placeholders
      const div = document.createElement('div');
      div.innerHTML = contentRef.current.innerHTML;
      const images = div.querySelectorAll('img');
      images.forEach((img) => {
        const fileName = img.dataset.fileName || '';
        if (fileName) {
          const placeholder = `[image:${fileName}]`;
          const textNode = document.createTextNode(placeholder);
          img.parentNode?.replaceChild(textNode, img);
        }
      });
      const cleanContent = div.textContent || '';
      setContent(cleanContent);
      setTextLength(getTextLength(cleanContent));
    }
  };

  // Adjust the height of the content editor dynamically
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.height = 'auto';
      const contentHeight = contentRef.current.scrollHeight;
      const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
      const fixedHeight = 4 * 16 + 3 * 16 + 3.75 * 16 + 2 * 16 + 1.125 * 16;
      const maxHeight = windowHeight > 0 ? windowHeight - fixedHeight : 9999;
      const newHeight = Math.min(Math.max(contentHeight, 160), maxHeight);
      contentRef.current.style.height = `${newHeight}px`;
    }
  }, [content]);

  // Limit the content length to 1000 characters
  useEffect(() => {
    if (contentRef.current) {
      const textContent = contentRef.current.textContent || '';
      const length = getTextLength(textContent);
      if (length > 1000) {
        const truncatedText = textContent.substring(0, 1000);
        contentRef.current.textContent = truncatedText;
        setContent(truncatedText);
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
      setSubmitError('Please log in first');
      return;
    }
  
    // Validate title and content
    if (!title || !content) {
      setSubmitError('Title and content cannot be empty');
      return;
    }
  
    setSubmitError(null);
  
    try {
      const postId = await createPost(title, content, tags, images);
      if (postId) {
        router.push('/forum/latest');
      } else {
        setSubmitError('Failed to create post, unable to retrieve post ID');
      }
    } catch (error: any) {
      if (error.message.includes("Authentication failed")) {
        setSubmitError("Authentication failed, please log in again");
        refresh();
      } else if (error.message.includes("Unsupported media type")) {
        setSubmitError("Unsupported request format, please contact the administrator");
      } else if (error.message.includes("Server error")) {
        setSubmitError("Server error, please contact the administrator");
      } else {
        setSubmitError(error.message || 'Failed to create post, please try again later');
      }
    }
  };

  // Handle click on the back button
  const handleBack = () => {
    router.back();
  };

  return (
    <div className="relative">
      <div className="container max-w-3xl mx-auto">
        {/* Back button positioned just to the left of the white box */}
        <div className="relative">
          <button
            onClick={handleBack}
            className="absolute top-4 -left-18 btn btn-circle btn-lg bg-base-100 z-10"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4" />
          </button>
          <div className="bg-white rounded-lg shadow h-[100vh] overflow-y-hidden m-0">
            <div className="p-6 overflow-y-auto h-full">
              <h1 className="text-4xl font-bold mb-6">Create Post</h1>
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
                    <span className="text-sm text-gray-500 mt-1">
                      {title.length}/100
                    </span>
                  </div>
                </div>
                <div className="form-control">
                  <div className="flex items-center space-x-2 flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="btn btn-outline btn-primary rounded-lg"
                    >
                      {isTagMenuOpen ? 'Close Tags' : 'Add Tags'}
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
                                  tags.some((t) => t.tagId === tag.tagId) ? 'btn-primary' : 'btn-accent'
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
                      <button type="button" className="btn btn-ghost btn-xs text-gray-600" onClick={handleClipClick}>
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
                      style={{ minHeight: '10rem', overflowY: 'auto' }}
                    />
                  </div>
                  <div className="flex justify-end">
                    <span className="text-sm text-gray-500 mt-1">
                      {textLength}/1000
                    </span>
                  </div>
                </div>
                {submitError && (
                  <p className="text-red-500">{submitError}</p>
                )}
                <button type="submit" className="btn bg-[#A3DFFA] text-[#1A3C34] hover:bg-[#8CCFF7] float-right rounded-lg">
                  Post
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}