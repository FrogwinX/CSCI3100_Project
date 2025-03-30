'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from '@/hooks/useSession';
import { getAllTags, Tag, createPost } from '@/utils/posts'; // 引入 createPost
import { useRouter } from 'next/navigation'; // 引入 useRouter 用於跳轉

export default function CreatePost() {
  const [title, setTitle] = useState<string>('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [isTagMenuOpen, setIsTagMenuOpen] = useState<boolean>(false);
  const [content, setContent] = useState<string>('');
  const [textLength, setTextLength] = useState<number>(0);
  const [tagFetchError, setTagFetchError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null); // 新增：提交錯誤狀態
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { session, loading, refresh } = useSession();
  const router = useRouter(); // 用於跳轉

  useEffect(() => {
    const fetchTags = async () => {
      if (loading) {
        console.log('Session is still loading, waiting...');
        return;
      }

      if (!session?.isLoggedIn || !session?.token) {
        console.log('User is not logged in or token is not available');
        setTagFetchError('Please log in to load tags');
        return;
      }

      try {
        console.log('Fetching tags with token:', session.token);
        const tags = await getAllTags();
        console.log('Received tags:', tags);

        if (tags.length === 0) {
          console.warn('No tags returned from API');
          setTagFetchError('No tags available from server');
        } else {
          setAllTags(tags);
          setTagFetchError(null);
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
        setTagFetchError('Failed to load tags');
        setAllTags([]);
      }
    };

    fetchTags();
  }, [session, loading]);

  const handleAddTag = () => {
    if (loading) return;

    if (!session?.isLoggedIn) {
      alert('Please log in to select tags');
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
    if (file && contentRef.current) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgSrc = event.target?.result as string;
        const imgElement = document.createElement('img');
        imgElement.src = imgSrc;
        imgElement.alt = 'Uploaded Image';
        imgElement.style.maxWidth = '100%';
        imgElement.style.height = 'auto';
        contentRef.current.appendChild(imgElement);
        contentRef.current.appendChild(document.createElement('br'));
        setContent(contentRef.current.innerHTML);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClipClick = () => {
    fileInputRef.current?.click();
  };

  const getTextLength = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent?.length || 0;
  };

  const handleContentChange = () => {
    if (contentRef.current) {
      const newContent = contentRef.current.innerHTML;
      setContent(newContent);
    }
  };

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

  useEffect(() => {
    if (contentRef.current) {
      const newContent = contentRef.current.innerHTML;
      const length = getTextLength(newContent);
      if (length > 1000) {
        const text = contentRef.current.textContent || '';
        const truncatedText = text.substring(0, 1000);
        contentRef.current.innerHTML = truncatedText;
        setContent(truncatedText);
        setTextLength(1000);
      } else {
        setTextLength(length);
      }
    }
  }, [content]);

  // 新增：處理表單提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.isLoggedIn) {
      alert('請先登入');
      return;
    }

    if (!title || !content) {
      setSubmitError('標題和內容不能為空');
      return;
    }

    setSubmitError(null);

    const postId = await createPost(title, content, tags);
    if (postId) {
      router.push(`/posts/${postId}`);
    } else {
      setSubmitError('創建貼文失敗，請稍後再試');
    }
  };

  return (
    <div className="container max-w-3xl mx-auto">
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
                    accept="image/*"
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
  );
}