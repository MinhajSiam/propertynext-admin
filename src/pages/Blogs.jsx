import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Edit, X, Save, ExternalLink } from 'lucide-react';

const CLOUDINARY_CLOUD_NAME = "dhs7c5scp";
const CLOUDINARY_UPLOAD_PRESET = "propertyNext";

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [fileInputKey, setFileInputKey] = useState(Date.now());

    const initialState = { title: '', category: 'Real Estate', mainImage: '', content: '' };
    const [formData, setFormData] = useState(initialState);

    useEffect(() => { fetchBlogs(); }, []);

    const fetchBlogs = async () => {
        try {
            const response = await axios.get('https://propertynextv2-backend.onrender.com/api/blogs/all');
            if (response.data.success) setBlogs(response.data.data);
        } catch (error) { console.error("Error fetching blogs:", error); }
    };

    const handleFileUpload = async (file) => {
        if (!file) return null;
        setUploading(true);
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, { method: 'POST', body: data });
            const fileData = await res.json();
            setUploading(false);
            return fileData.secure_url;
        } catch (error) {
            console.error("Upload Error:", error);
            setUploading(false);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingId) {
                await axios.put(`https://propertynextv2-backend.onrender.com/api/blogs/${editingId}`, formData);
                alert('Blog updated successfully! 🎉');
            } else {
                await axios.post('https://propertynextv2-backend.onrender.com/api/blogs/add', formData);
                alert('Blog published successfully! 🎉');
            }
            setFormData(initialState);
            setEditingId(null);
            setFileInputKey(Date.now());
            fetchBlogs();
        } catch (error) {
            alert('Failed to save blog!');
        } finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this blog?")) {
            await axios.delete(`https://propertynextv2-backend.onrender.com/api/blogs/${id}`);
            fetchBlogs();
        }
    };

    return (
        <div className="p-6 pb-10">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Blogs</h1>
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Form */}
                <div className="xl:col-span-7 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Blog Title *</label>
                            <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border rounded-md text-sm focus:ring-1 focus:ring-brandLime outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Category *</label>
                            <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border rounded-md text-sm outline-none">
                                <option value="Real Estate">Real Estate</option>
                                <option value="Interior">Interior Design</option>
                                <option value="Lifestyle">Lifestyle</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Cover Image *</label>
                            <input key={fileInputKey} type="file" accept="image/*" onChange={async (e) => {
                                const url = await handleFileUpload(e.target.files[0]);
                                if (url) setFormData(prev => ({ ...prev, mainImage: url }));
                            }} className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-brandLime cursor-pointer" />
                            {formData.mainImage && <img src={formData.mainImage} className="mt-2 h-20 w-32 object-cover rounded border" alt="" />}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Blog Content *</label>
                            <textarea required rows="8" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="w-full px-3 py-2 bg-gray-50 border rounded-md text-sm focus:ring-1 focus:ring-brandLime outline-none" placeholder="Write full article here..." />
                        </div>
                        <button type="submit" disabled={loading || uploading} className="bg-gray-900 text-brandLime font-bold px-6 py-2.5 rounded-lg hover:bg-black transition-colors">
                            {loading ? 'Saving...' : uploading ? 'Uploading Image...' : editingId ? 'Update Blog' : 'Publish Blog'}
                        </button>
                    </form>
                </div>
                {/* List */}
                <div className="xl:col-span-5 flex flex-col gap-4">
                    <div className="bg-white p-4 rounded-xl border font-bold text-gray-800 flex justify-between"><span>Published Articles</span><span className="bg-lime-100 text-lime-800 text-xs px-2.5 py-0.5 rounded-full">{blogs.length}</span></div>
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                        {blogs.map(b => (
                            <div key={b._id} className="bg-white p-3 border rounded-xl flex gap-3 relative group">
                                <img src={b.mainImage} className="w-20 h-20 object-cover rounded-lg bg-gray-100 shrink-0" alt="" />
                                <div class="overflow-hidden pr-12"><span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-bold uppercase">{b.category}</span><h3 className="font-bold text-sm text-gray-900 mt-1 truncate">{b.title}</h3></div>
                                <div class="absolute right-2 top-3 flex gap-1"><button onClick={() => { setFormData(b); setEditingId(b._id); }} className="p-1.5 text-blue-600 bg-gray-50 rounded-md"><Edit size={14} /></button><button onClick={() => handleDelete(b._id)} className="p-1.5 text-red-500 bg-gray-50 rounded-md"><Trash2 size={14} /></button></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blogs;