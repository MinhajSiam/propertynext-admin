import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Trash2, Edit, X, Save, ExternalLink } from 'lucide-react';

const CLOUDINARY_CLOUD_NAME = "dhs7c5scp";
const CLOUDINARY_UPLOAD_PRESET = "propertyNext";

// --- Section Title Component ---
const SectionTitle = ({ title }) => (
    <h3 className="text-md font-bold text-gray-800 border-b pb-2 mb-4 mt-8">{title}</h3>
);

// --- Input Field Component ---
const InputField = ({ label, name, value, onChange, type = "text", placeholder, isTextArea = false }) => (
    <div className="mb-4">
        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">{label}</label>
        {isTextArea ? (
            <textarea name={name} value={value || ''} onChange={onChange} rows="3"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:ring-1 focus:ring-brandLime focus:border-brandLime text-sm" placeholder={placeholder} />
        ) : (
            <input type={type} name={name} value={value || ''} onChange={onChange}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:ring-1 focus:ring-brandLime focus:border-brandLime text-sm" placeholder={placeholder} />
        )}
    </div>
);

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [fileInputKey, setFileInputKey] = useState(Date.now()); // ইনপুট ফিল্ড রিসেট করার জন্য

    const initialState = {
        title: '', location: '', status: 'upcoming', mainImage: '',
        landArea: '', facing: '', height: '', totalUnits: '', sizeOfUnits: '', handover: '',
        overview: '', structuralFeatures: '', flooring: '', kitchenBath: '', electrical: '',
        locationAdvantages: [], galleryImages: [],
        floorPlanA: '', floorPlanB: '', groundFloorPlan: '', videoUrl: '', mapUrl: '',
        brochureUrl: ''
    };

    const [formData, setFormData] = useState(initialState);

    useEffect(() => { fetchProjects(); }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('https://propertynextv2-backend.onrender.com/api/projects/all');
            if (response.data.success) setProjects(response.data.data.reverse());
        } catch (error) { console.error("Error fetching:", error); }
    };

    // --- Smart URL Formatters ---
    const formatYoutubeUrl = (url) => {
        if (!url) return '';
        if (url.includes('<iframe')) {
            const match = url.match(/src="([^"]+)"/);
            return match ? match[1] : url;
        }
        if (url.includes('watch?v=')) return url.replace('watch?v=', 'embed/').split('&')[0];
        if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'youtube.com/embed/');
        return url;
    };

    const formatMapUrl = (url) => {
        if (!url) return '';
        if (url.includes('<iframe')) {
            const match = url.match(/src="([^"]+)"/);
            return match ? match[1] : url;
        }
        return url;
    };

    // --- Cloudinary Upload Logic ---
    const handleFileUpload = async (file) => {
        if (!file) return null;
        setUploading(true);
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, {
                method: 'POST',
                body: data,
            });
            const fileData = await res.json();
            setUploading(false);

            if (fileData.error) {
                alert("Upload Error: " + fileData.error.message);
                return null;
            }
            return fileData.secure_url;
        } catch (error) {
            console.error("Cloudinary Upload Error:", error);
            setUploading(false);
            alert("File upload failed!");
            return null;
        }
    };

    const handleGalleryUpload = async (files) => {
        setUploading(true);
        const uploadedUrls = [];
        for (let i = 0; i < files.length; i++) {
            const data = new FormData();
            data.append('file', files[i]);
            data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

            try {
                const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, {
                    method: 'POST', body: data,
                });
                const fileData = await res.json();
                if (fileData.secure_url) uploadedUrls.push(fileData.secure_url);
            } catch (error) { console.error("Gallery Upload Error:", error); }
        }
        setUploading(false);
        return uploadedUrls;
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // --- Submit Logic ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const submitData = { ...formData };

        // String to Array formatting
        if (typeof submitData.locationAdvantages === 'string') {
            submitData.locationAdvantages = submitData.locationAdvantages.split(',').map(item => item.trim()).filter(Boolean);
        }

        // URL formatting
        submitData.videoUrl = formatYoutubeUrl(submitData.videoUrl);
        submitData.mapUrl = formatMapUrl(submitData.mapUrl);

        try {
            if (editingId) {
                await axios.put(`https://propertynextv2-backend.onrender.com/api/projects/${editingId}`, submitData);
                alert('Project updated successfully! 🎉');
            } else {
                await axios.post('https://propertynextv2-backend.onrender.com/api/projects/add', submitData);
                alert('Project added successfully! 🎉');
            }
            resetForm();
            fetchProjects();
        } catch (error) {
            alert('Failed to save project!');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this project?")) {
            await axios.delete(`https://propertynextv2-backend.onrender.com/api/projects/${id}`);
            fetchProjects();
        }
    };

    const handleEdit = (project) => {
        setFormData({ ...project });
        setEditingId(project._id);
        setFileInputKey(Date.now()); // ফাইল ইনপুটগুলো ক্লিয়ার করার জন্য
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setFormData(initialState);
        setEditingId(null);
        setFileInputKey(Date.now());
    };

    // --- Custom File Upload Field ---
    const FileUploadField = ({ label, name, accept }) => (
        <div className="mb-4">
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">{label}</label>
            <input
                key={fileInputKey} // Force re-render when needed
                type="file"
                accept={accept}
                onChange={async (e) => {
                    const fileUrl = await handleFileUpload(e.target.files[0]);
                    if (fileUrl) {
                        setFormData(prev => ({ ...prev, [name]: fileUrl }));
                    }
                }}
                className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-brandLime file:text-gray-900 hover:file:bg-lime-300 cursor-pointer"
            />
            {formData[name] && (
                <div className="mt-2 flex items-center gap-2 text-xs font-medium text-green-600 bg-green-50 p-2 rounded-md border border-green-100">
                    <span>✔ Uploaded</span>
                    <a href={formData[name]} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline ml-auto">
                        View <ExternalLink size={12} />
                    </a>
                </div>
            )}
        </div>
    );

    return (
        <div className="pb-10 p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Manage Projects</h1>
                <p className="text-gray-500 text-sm">Add or update complete property details.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Form Section */}
                <div className="xl:col-span-8 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            {editingId ? '✏️ Update Project Details' : '➕ Add New Project'}
                        </h2>
                        {editingId && <button onClick={resetForm} className="text-red-500 hover:bg-red-50 p-2 rounded-full"><X size={18} /></button>}
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">

                            <div className="md:col-span-2"><SectionTitle title="1. Basic Information" /></div>
                            <InputField label="Project Title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. The Lumina Residencies" />
                            <InputField label="Location" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. South Kafrul, Dhaka" />
                            <FileUploadField label="Main Cover Image" name="mainImage" accept="image/*" />

                            <div className="mb-4">
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Status</label>
                                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none focus:border-brandLime">
                                    <option value="upcoming">Upcoming</option>
                                    <option value="ongoing">Ongoing</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>

                            <div className="md:col-span-2"><SectionTitle title="2. At a Glance" /></div>
                            <InputField label="Land Area" name="landArea" value={formData.landArea} onChange={handleChange} placeholder="e.g. 6.55 Katha" />
                            <InputField label="Facing" name="facing" value={formData.facing} onChange={handleChange} placeholder="e.g. North-West" />
                            <InputField label="Building Height" name="height" value={formData.height} onChange={handleChange} placeholder="e.g. B + GF + 8 Floors" />
                            <InputField label="Total Units" name="totalUnits" value={formData.totalUnits} onChange={handleChange} placeholder="e.g. 16" />
                            <InputField label="Size of Units" name="sizeOfUnits" value={formData.sizeOfUnits} onChange={handleChange} placeholder="e.g. 1135 Sft, 1175 Sft" />
                            <InputField label="Handover Date" name="handover" value={formData.handover} onChange={handleChange} placeholder="e.g. July 2026" />

                            <div className="md:col-span-2"><SectionTitle title="3. Overview, Brochure & Location" /></div>
                            <div className="md:col-span-2">
                                <InputField label="Project Overview Details" name="overview" value={formData.overview} onChange={handleChange} isTextArea={true} placeholder="Write the main description here..." />
                            </div>
                            <FileUploadField label="Project Brochure (PDF)" name="brochureUrl" accept=".pdf" />

                            <InputField label="Virtual Tour (YouTube Link)" name="videoUrl" value={formData.videoUrl} onChange={handleChange} placeholder="Paste YouTube link here..." />

                            <div className="md:col-span-2">
                                <InputField label="Google Map Embed URL or Link" name="mapUrl" value={formData.mapUrl} onChange={handleChange} placeholder="Paste Map code or link here..." />
                            </div>
                            <div className="md:col-span-2">
                                <InputField label="Location Advantages (Comma separated)" name="locationAdvantages"
                                    value={Array.isArray(formData.locationAdvantages) ? formData.locationAdvantages.join(', ') : formData.locationAdvantages}
                                    onChange={handleChange} placeholder="e.g. Airport - 15 Mins, Metro Station - 5 Mins" />
                            </div>

                            <div className="md:col-span-2"><SectionTitle title="4. Technical Specifications" /></div>
                            <InputField label="Structural Features" name="structuralFeatures" value={formData.structuralFeatures} onChange={handleChange} isTextArea={true} placeholder="Bullet points using commas..." />
                            <InputField label="Flooring & Finishing" name="flooring" value={formData.flooring} onChange={handleChange} isTextArea={true} placeholder="Bullet points using commas..." />
                            <InputField label="Kitchen & Bathrooms" name="kitchenBath" value={formData.kitchenBath} onChange={handleChange} isTextArea={true} placeholder="Bullet points using commas..." />
                            <InputField label="Electrical & Elevators" name="electrical" value={formData.electrical} onChange={handleChange} isTextArea={true} placeholder="Bullet points using commas..." />

                            <div className="md:col-span-2"><SectionTitle title="5. Media & Floor Plans" /></div>

                            <div className="md:col-span-2 mb-6 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Gallery Images (Multiple Selection)</label>
                                <input
                                    key={fileInputKey}
                                    type="file" multiple accept="image/*"
                                    onChange={async (e) => {
                                        const urls = await handleGalleryUpload(e.target.files);
                                        if (urls.length > 0) {
                                            setFormData(prev => ({
                                                ...prev,
                                                galleryImages: prev.galleryImages ? [...prev.galleryImages, ...urls] : urls
                                            }));
                                        }
                                    }}
                                    className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-brandLime file:text-gray-900 hover:file:bg-lime-300 cursor-pointer"
                                />
                                {formData.galleryImages && formData.galleryImages.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {formData.galleryImages.map((img, idx) => (
                                            <div key={idx} className="relative group w-16 h-16 shadow-sm">
                                                <img src={img} className="w-full h-full object-cover rounded border border-gray-200" alt="Preview" />
                                                <button type="button"
                                                    onClick={() => setFormData({ ...formData, galleryImages: formData.galleryImages.filter((_, i) => i !== idx) })}
                                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                                ><X size={12} /></button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => setFormData({ ...formData, galleryImages: [] })}
                                            className="text-[11px] text-red-500 font-bold hover:underline ml-2 flex items-center"
                                        >Clear All</button>
                                    </div>
                                )}
                            </div>

                            <FileUploadField label="Floor Plan Type A" name="floorPlanA" accept="image/*" />
                            <FileUploadField label="Floor Plan Type B" name="floorPlanB" accept="image/*" />
                            <div className="md:col-span-2">
                                <FileUploadField label="Ground Floor Plan" name="groundFloorPlan" accept="image/*" />
                            </div>

                        </div>

                        <button type="submit" disabled={loading || uploading} className="mt-8 w-full md:w-auto bg-gray-900 text-brandLime font-bold px-8 py-3.5 rounded-lg hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-lg">
                            <Save size={18} /> {loading ? 'Saving Data...' : uploading ? 'Uploading Files...' : (editingId ? 'Update Project Information' : 'Publish New Project')}
                        </button>
                    </form>
                </div>

                {/* Right Side Projects List */}
                <div className="xl:col-span-4 flex flex-col gap-4">
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800">Saved Projects</h3>
                        <span className="bg-lime-100 text-lime-800 text-xs font-bold px-3 py-1 rounded-full">{projects.length} Total</span>
                    </div>
                    <div className="flex flex-col gap-4 overflow-y-auto pr-2 max-h-[800px] custom-scrollbar">
                        {projects.map((project) => (
                            <div key={project._id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col relative group">
                                <div className="h-36 bg-gray-200 relative overflow-hidden">
                                    <img src={project.mainImage} alt={project.title} className="w-full h-full object-cover" />
                                    <div className="absolute top-2 right-2 flex gap-1.5 z-10">
                                        <button onClick={() => handleEdit(project)} className="bg-white p-2 rounded-lg text-blue-600 hover:bg-blue-600 hover:text-white shadow-md transition-colors"><Edit size={14} /></button>
                                        <button onClick={() => handleDelete(project._id)} className="bg-white p-2 rounded-lg text-red-500 hover:bg-red-600 hover:text-white shadow-md transition-colors"><Trash2 size={14} /></button>
                                    </div>
                                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                                        {project.status}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-sm text-gray-900 truncate mb-1">{project.title}</h3>
                                    <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                                        <MapPin size={12} className="text-brandLime" /> {project.location}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Projects;