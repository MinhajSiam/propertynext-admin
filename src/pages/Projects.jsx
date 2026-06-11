import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, MapPin, Trash2, Edit, X, Save, Upload } from 'lucide-react';

// !!! এখানে আপনার ক্লাউডিনারি তথ্য বসান !!!
const CLOUDINARY_CLOUD_NAME = "dhs7c5scp";
const CLOUDINARY_UPLOAD_PRESET = "propertyNext";

// --- ছোট হেল্পার কম্পোনেন্টগুলো মূল ফাংশনের বাইরে রাখা হলো ---
const SectionTitle = ({ title }) => (
    <h3 className="text-md font-bold text-gray-800 border-b pb-2 mb-4 mt-8">{title}</h3>
);

const InputField = ({ label, name, value, onChange, type = "text", placeholder, isTextArea = false }) => (
    <div className="mb-4">
        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">{label}</label>
        {isTextArea ? (
            <textarea name={name} value={value} onChange={onChange} rows="3"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:ring-1 focus:ring-brandLime focus:border-brandLime text-sm" placeholder={placeholder} />
        ) : (
            <input type={type} name={name} value={value} onChange={onChange}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:ring-1 focus:ring-brandLime focus:border-brandLime text-sm" placeholder={placeholder} />
        )}
    </div>
);
// --------------------------------------------------------------------------

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false); // ফাইল আপলোডের আলাদা স্টেট
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        title: '', location: '', status: 'upcoming', mainImage: '',
        landArea: '', facing: '', height: '', totalUnits: '', sizeOfUnits: '', handover: '',
        overview: '', structuralFeatures: '', flooring: '', kitchenBath: '', electrical: '',
        locationAdvantages: '', galleryImages: '',
        floorPlanA: '', floorPlanB: '', groundFloorPlan: '', videoUrl: '', mapUrl: '',
        brochureUrl: '' // নতুন ব্রোশিওর ফিল্ড
    });

    useEffect(() => { fetchProjects(); }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('https://propertynextv2-backend.onrender.com/api/projects/all');
            if (response.data.success) setProjects(response.data.data);
        } catch (error) { console.error("Error fetching:", error); }
    };

    // --- ফাইল আপলোড করার আপডেট করা ফাংশন (Image এবং PDF উভয়ের জন্য) ---
    const handleFileUpload = async (file) => {
        if (!file) return null;
        setUploading(true);
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        try {
            // এখানে /image/upload এর বদলে /auto/upload দেওয়া হয়েছে যাতে সব ফাইল সাপোর্ট করে
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

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const submitData = { ...formData };
        if (formData.galleryImages && typeof formData.galleryImages === 'string') submitData.galleryImages = formData.galleryImages.split(',').map(url => url.trim());
        if (formData.locationAdvantages && typeof formData.locationAdvantages === 'string') submitData.locationAdvantages = formData.locationAdvantages.split(',').map(item => item.trim());

        if (submitData.mapUrl && submitData.mapUrl.includes('<iframe')) {
            const match = submitData.mapUrl.match(/src="([^"]+)"/);
            if (match) submitData.mapUrl = match[1];
        }

        if (submitData.videoUrl && submitData.videoUrl.includes('<iframe')) {
            const match = submitData.videoUrl.match(/src="([^"]+)"/);
            if (match) submitData.videoUrl = match[1];
        }

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
        setFormData({
            ...project,
            galleryImages: project.galleryImages ? project.galleryImages.join(', ') : '',
            locationAdvantages: project.locationAdvantages ? project.locationAdvantages.join(', ') : ''
        });
        setEditingId(project._id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setFormData({
            title: '', location: '', status: 'upcoming', mainImage: '', landArea: '', facing: '', height: '', totalUnits: '', sizeOfUnits: '', handover: '', overview: '', structuralFeatures: '', flooring: '', kitchenBath: '', electrical: '', locationAdvantages: '', galleryImages: '', floorPlanA: '', floorPlanB: '', groundFloorPlan: '', videoUrl: '', mapUrl: '', brochureUrl: ''
        });
        setEditingId(null);
    };

    // ফাইল ইনপুট ফিল্ডের জন্য কাস্টম কম্পোনেন্ট (কোড গোছানোর জন্য)
    const FileUploadField = ({ label, name, accept }) => (
        <div className="mb-4">
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">{label}</label>
            <div className="flex items-center gap-2">
                <input type="file" accept={accept} onChange={async (e) => {
                    const fileUrl = await handleFileUpload(e.target.files[0]);
                    if (fileUrl) {
                        setFormData(prev => ({ ...prev, [name]: fileUrl }));
                        alert(`${label} uploaded successfully! 🚀`);
                    }
                }} className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-brandLime file:text-gray-900 hover:file:bg-lime-300 cursor-pointer" />
            </div>
            {formData[name] && <p className="text-[10px] text-green-600 truncate mt-1">✔ File Loaded: {formData[name]}</p>}
        </div>
    );

    return (
        <div className="pb-10">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manage Projects</h1>
                    <p className="text-gray-500 text-sm">Add or update complete property details.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                <div className="xl:col-span-8 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-darkGreen flex items-center gap-2">
                            {editingId ? 'Update Project Details' : 'Add New Project'}
                        </h2>
                        {editingId && <button onClick={resetForm} className="text-red-500 hover:bg-red-50 p-2 rounded-full"><X size={18} /></button>}
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">

                            <div className="md:col-span-2"><SectionTitle title="1. Basic Information" /></div>
                            <InputField label="Project Title *" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. The Lumina Residencies" />
                            <InputField label="Location *" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. South Kafrul, Dhaka" />

                            {/* মেইন কভার ইমেজ সরাসরি আপলোড */}
                            <FileUploadField label="Main Cover Image *" name="mainImage" accept="image/*" />

                            <div className="mb-4">
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Status *</label>
                                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
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

                            {/* ব্রোশিওর PDF সরাসরি আপলোড বাটন */}
                            <FileUploadField label="Project Brochure (PDF)" name="brochureUrl" accept=".pdf" />

                            <InputField label="Google Map Embed URL" name="mapUrl" value={formData.mapUrl} onChange={handleChange} placeholder="Paste Map code or link here..." />
                            <div className="md:col-span-2">
                                <InputField label="Location Advantages (Comma separated)" name="locationAdvantages" value={formData.locationAdvantages} onChange={handleChange} placeholder="e.g. Airport - 15 Mins, Metro Station - 5 Mins" />
                            </div>

                            <div className="md:col-span-2"><SectionTitle title="4. Technical Specifications" /></div>
                            <InputField label="Structural Features" name="structuralFeatures" value={formData.structuralFeatures} onChange={handleChange} isTextArea={true} placeholder="Bullet points using commas..." />
                            <InputField label="Flooring & Finishing" name="flooring" value={formData.flooring} onChange={handleChange} isTextArea={true} placeholder="Bullet points using commas..." />
                            <InputField label="Kitchen & Bathrooms" name="kitchenBath" value={formData.kitchenBath} onChange={handleChange} isTextArea={true} placeholder="Bullet points using commas..." />
                            <InputField label="Electrical & Elevators" name="electrical" value={formData.electrical} onChange={handleChange} isTextArea={true} placeholder="Bullet points using commas..." />

                            <div className="md:col-span-2"><SectionTitle title="5. Media & Floor Plans" /></div>
                            <div className="md:col-span-2">
                                <InputField label="Gallery Images (Comma separated URLs for now)" name="galleryImages" value={formData.galleryImages} onChange={handleChange} isTextArea={true} placeholder="https://img1.jpg, https://img2.jpg" />
                            </div>
                            <div className="md:col-span-2">
                                <InputField label="Virtual Tour (YouTube Embed URL)" name="videoUrl" value={formData.videoUrl} onChange={handleChange} placeholder="https://www.youtube.com/embed/..." />
                            </div>

                            {/* ফ্লোর প্ল্যানগুলো সরাসরি আপলোড বাটন */}
                            <FileUploadField label="Floor Plan Type A" name="floorPlanA" accept="image/*" />
                            <FileUploadField label="Floor Plan Type B" name="floorPlanB" accept="image/*" />
                            <FileUploadField label="Ground Floor Plan" name="groundFloorPlan" accept="image/*" />

                        </div>

                        <button type="submit" disabled={loading || uploading} className="mt-8 bg-darkGreen text-brandLime font-bold px-8 py-3 rounded-md hover:bg-black transition-colors flex items-center gap-2">
                            <Save size={16} /> {loading ? 'Saving Data...' : uploading ? 'Uploading File...' : (editingId ? 'Update Project' : 'Save Project Data')}
                        </button>
                    </form>
                </div>

                {/* Right Side List */}
                <div className="xl:col-span-4 flex flex-col gap-4">
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-2">
                        <h3 className="font-bold text-gray-800">Saved Projects ({projects.length})</h3>
                    </div>
                    <div className="flex flex-col gap-4 overflow-y-auto pr-2 max-h-[1200px]">
                        {projects.map((project) => (
                            <div key={project._id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col relative group">
                                <div className="h-32 bg-gray-200 relative overflow-hidden">
                                    <img src={project.mainImage} alt={project.title} className="w-full h-full object-cover" />
                                    <div className="absolute top-2 right-2 flex gap-1 z-10">
                                        <button onClick={() => handleEdit(project)} className="bg-white p-1.5 rounded text-blue-600 hover:bg-blue-600 hover:text-white shadow"><Edit size={14} /></button>
                                        <button onClick={() => handleDelete(project._id)} className="bg-white p-1.5 rounded text-red-500 hover:bg-red-600 hover:text-white shadow"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                                <div className="p-3">
                                    <h3 className="font-bold text-sm text-gray-900 truncate">{project.title}</h3>
                                    <p className="text-xs text-gray-500 truncate"><MapPin size={10} className="inline mr-1" />{project.location}</p>
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