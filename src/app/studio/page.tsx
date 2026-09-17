'use client';

import { useState, useEffect } from 'react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

export default function StudioPage() {
  const [secret, setSecret] = useState('');
  const [isAuthed, setIsAuthed] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [duration, setDuration] = useState('');
  const [featured, setFeatured] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');

  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('randimms_upload_secret');
    if (saved) {
      setSecret(saved);
    }
  }, []);

  const checkAuth = async () => {
    if (!secret.trim()) {
      setMessage({ type: 'error', text: 'Enter upload secret' });
      return;
    }

    try {
      const res = await fetch('/api/categories');
      const cats = await res.json();
      setCategories(cats);

      const res2 = await fetch('/api/tags');
      const t = await res2.json();
      setTags(t);

      if (cats.length > 0) setCategoryId(cats[0].id);

      setIsAuthed(true);
      localStorage.setItem('randimms_upload_secret', secret);
      setMessage({ type: 'success', text: 'Authenticated. You can now upload.' });
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to load data' });
    }
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!title.trim() || !categoryId) {
      setMessage({ type: 'error', text: 'Title and category are required' });
      return;
    }

    if (uploadMode === 'file' && !file) {
      setMessage({ type: 'error', text: 'Select a video file' });
      return;
    }

    if (uploadMode === 'url' && !videoUrl.trim()) {
      setMessage({ type: 'error', text: 'Enter video URL' });
      return;
    }

    setUploading(true);

    try {
      const form = new FormData();
      form.append('secret', secret);
      form.append('title', title);
      form.append('description', description);
      form.append('category_id', categoryId);
      form.append('duration', duration || '0');
      form.append('featured', featured ? '1' : '0');
      form.append('tagIds', JSON.stringify(selectedTags));

      if (uploadMode === 'file' && file) {
        form.append('video', file);
      } else {
        form.append('video_url', videoUrl);
      }

      if (thumbnailFile) {
        form.append('thumbnail', thumbnailFile);
      } else if (thumbnailUrl) {
        form.append('thumbnail_url', thumbnailUrl);
      }

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: form,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setMessage({ type: 'success', text: `Video uploaded! ID: ${data.id}` });

      // Reset
      setTitle('');
      setDescription('');
      setDuration('');
      setSelectedTags([]);
      setFile(null);
      setThumbnailFile(null);
      setThumbnailUrl('');
      setVideoUrl('');
      setFeatured(false);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setUploading(false);
    }
  };

  if (!isAuthed) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] p-8">
          <div className="mb-6">
            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center mb-4">
              <span className="font-black text-black">R</span>
            </div>
            <h1 className="text-[20px] font-bold">Studio Access</h1>
            <p className="mt-2 text-[13px] text-white/50">Enter your upload secret to access the private uploader. Set UPLOAD_SECRET in your .env file.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[12px] font-medium text-white/70 mb-1.5 block">Upload Secret</label>
              <input
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Enter secret key"
                className="w-full h-11 px-4 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white placeholder:text-white/30 text-[14px] focus:outline-none focus:border-white/20"
              />
            </div>

            <button onClick={checkAuth} className="w-full h-11 rounded-xl bg-white text-black font-medium text-[14px] hover:bg-white/90 transition-colors">
              Unlock Studio
            </button>

            {message && (
              <div className={`rounded-xl px-4 py-3 text-[13px] ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {message.text}
              </div>
            )}

            <div className="pt-4 border-t border-white/[0.06] text-[12px] text-white/30 leading-relaxed">
              <p>Default secret for development is <code className="bg-white/[0.08] px-1.5 py-0.5 rounded text-white/60">randimms_secret_2024</code> — change it in production via UPLOAD_SECRET env variable.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight">Upload Video</h1>
          <p className="text-[13px] text-white/50 mt-1">Add new videos to randimms</p>
        </div>
        <button
          onClick={() => {
            setIsAuthed(false);
            setSecret('');
            localStorage.removeItem('randimms_upload_secret');
          }}
          className="h-9 px-4 rounded-full bg-white/[0.08] hover:bg-white/[0.12] text-[13px] border border-white/[0.08]"
        >
          Lock
        </button>
      </div>

      <form onSubmit={handleUpload} className="space-y-6 rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6 sm:p-8">
        {/* Upload mode */}
        <div className="flex rounded-full bg-white/[0.06] p-1 w-fit">
          <button type="button" onClick={() => setUploadMode('file')} className={`h-8 px-4 rounded-full text-[13px] font-medium transition-colors ${uploadMode === 'file' ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}>
            Upload File
          </button>
          <button type="button" onClick={() => setUploadMode('url')} className={`h-8 px-4 rounded-full text-[13px] font-medium transition-colors ${uploadMode === 'url' ? 'bg-white text-black' : 'text-white/60 hover:text-white'}`}>
            From URL
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="sm:col-span-2">
            <label className="text-[12px] font-medium text-white/70 mb-1.5 block">Title *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="My awesome video" className="w-full h-11 px-4 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white placeholder:text-white/30 text-[14px] focus:outline-none focus:border-white/20" required />
          </div>

          <div className="sm:col-span-2">
            <label className="text-[12px] font-medium text-white/70 mb-1.5 block">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your video..." rows={4} className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white placeholder:text-white/30 text-[14px] focus:outline-none focus:border-white/20 resize-none" />
          </div>

          <div>
            <label className="text-[12px] font-medium text-white/70 mb-1.5 block">Category *</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full h-11 px-4 rounded-xl bg-[#1a1a1a] border border-white/[0.08] text-white text-[14px] focus:outline-none focus:border-white/20">
              {categories.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#1a1a1a]">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[12px] font-medium text-white/70 mb-1.5 block">Duration (seconds)</label>
            <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 120" className="w-full h-11 px-4 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white placeholder:text-white/30 text-[14px] focus:outline-none focus:border-white/20" />
          </div>

          {uploadMode === 'file' ? (
            <div className="sm:col-span-2">
              <label className="text-[12px] font-medium text-white/70 mb-1.5 block">Video File * (mp4, webm, mov, m3u8)</label>
              <div className="rounded-xl border border-dashed border-white/[0.15] bg-white/[0.02] p-6 text-center hover:bg-white/[0.04] transition-colors">
                <input type="file" accept="video/*,.m3u8" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" id="video-file" />
                <label htmlFor="video-file" className="cursor-pointer">
                  <div className="mx-auto h-10 w-10 rounded-full bg-white/[0.08] flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div className="text-[13px] text-white/70">{file ? file.name : 'Click to select video or drag here'}</div>
                  <div className="text-[11px] text-white/30 mt-1">{file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : 'Max 500MB, mp4 recommended • HLS .m3u8 supported via URL mode'}</div>
                </label>
              </div>
            </div>
          ) : (
            <div className="sm:col-span-2">
              <label className="text-[12px] font-medium text-white/70 mb-1.5 block">Video URL * (mp4, HLS .m3u8, CDN)</label>
              <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://.../video.mp4 or https://.../playlist.m3u8" className="w-full h-11 px-4 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white placeholder:text-white/30 text-[14px] focus:outline-none focus:border-white/20" />
              <p className="text-[11px] text-white/30 mt-1.5">Supports mp4, webm, <span className="text-white/60 font-medium">HLS (.m3u8) for adaptive bitrate</span>, Bunny CDN, Cloudflare Stream, S3, etc. Player auto-detects HLS and shows quality selector.</p>
            </div>
          )}

          <div>
            <label className="text-[12px] font-medium text-white/70 mb-1.5 block">Thumbnail File (image)</label>
            <input type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} className="w-full text-[13px] text-white/50 file:mr-3 file:h-9 file:px-4 file:rounded-full file:border-0 file:bg-white file:text-black file:text-[13px] file:font-medium hover:file:bg-white/90 file:cursor-pointer cursor-pointer" />
          </div>

          <div>
            <label className="text-[12px] font-medium text-white/70 mb-1.5 block">Or Thumbnail URL</label>
            <input value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} placeholder="https://.../thumb.jpg" className="w-full h-11 px-4 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white placeholder:text-white/30 text-[14px] focus:outline-none focus:border-white/20" />
          </div>

          <div className="sm:col-span-2">
            <label className="text-[12px] font-medium text-white/70 mb-2 block">Tags</label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button key={tag.id} type="button" onClick={() => handleTagToggle(tag.id)} className={`rounded-full px-3 h-8 text-[12px] font-medium border transition-colors ${selectedTags.includes(tag.id) ? 'bg-white text-black border-white' : 'bg-white/[0.06] text-white/60 border-white/[0.08] hover:bg-white/[0.10] hover:text-white'}`}>
                  #{tag.name}
                </button>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2 flex items-center gap-3 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4 rounded border-white/20 bg-white/[0.06] text-white focus:ring-0" />
              <span className="text-[13px] text-white/70">Mark as featured (shows on homepage hero)</span>
            </label>
          </div>
        </div>

        {message && (
          <div className={`rounded-xl px-4 py-3 text-[13px] ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {message.text}
          </div>
        )}

        <button type="submit" disabled={uploading} className="w-full h-12 rounded-xl bg-white text-black font-medium text-[14px] hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          {uploading ? 'Uploading...' : 'Upload Video'}
        </button>

        <div className="text-[11px] text-white/30 leading-relaxed space-y-1">
          <p>Videos stored in <code className="bg-white/[0.08] px-1 py-0.5 rounded">public/uploads</code> and metadata in SQLite. For HLS: upload .ts segments to CDN and paste .m3u8 URL via URL mode — player uses hls.js with auto quality.</p>
          <p>CDN-ready: Supports external URLs, Bunny.net, Cloudflare Stream, S3, R2. Caching headers configured for .m3u8 (short) and .ts / mp4 (long). Fast start via preload=metadata.</p>
        </div>
      </form>
    </div>
  );
}
