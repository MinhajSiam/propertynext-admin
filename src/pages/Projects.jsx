import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, Building2, MapPin, Trash2, Edit, X, Save } from 'lucide-react';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Form State (আপনার চাওয়া সব ফিল্ড এখানে আছে)
    const [formData, setFormData] = useState({
        title: '', location: '', status: 'upcoming', mainImage: '',
        // At a Glance
        landArea: '', facing: '', height: '', totalUnits: '', sizeOfUnits: '', handover: '',
        // Overview & Technical
        overview: '', structuralFeatures: '', flooring: '', kitchenBath: '', electrical: '',
        // Location Advantages (Comma separated list)
        locationAdvantages: '',
        // Media (Comma separated links)
        galleryImages: '', floorPlanA: '', floorPlanB: '', groundFloorPlan: '', videoUrl: '', mapUrl: ''
    });

    useEffect(() => { fetchProjects(); }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('https://propertynextv2-backend.onrender.com/api/projects/all');
            if (response.data.success) setProjects(response.data.data);
        } catch (error) { console.error("Error fetching:", error); }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Data formatting before sending to backend
        const submitData = { ...formData };
        if (formData.galleryImages) submitData.galleryImages = formData.galleryImages.split(',').map(url => url.trim());
        if (formData.locationAdvantages) submitData.locationAdvantages = formData.locationAdvantages.split(',').map(item => item.trim());

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
            title: '', location: '', status: 'upcoming', mainImage: '', landArea: '', facing: '', height: '', totalUnits: '', sizeOfUnits: '', handover: '', overview: '', structuralFeatures: '', flooring: '', kitchenBath: '', electrical: '', locationAdvantages: '', galleryImages: '', floorPlanA: '', floorPlanB: '', groundFloorPlan: '', videoUrl: '', mapUrl: ''
        });
        setEditingId(null);
    };

    // UI Components
    const SectionTitle = ({ title }) => (
        <h3 className="text-md font-bold text-gray-800 border-b pb-2 mb-4 mt-8">{title}</h3>
    );

    const InputField = ({ label, name, type = "text", placeholder, isTextArea = false }) => (
        <div className="mb-4">
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">{label}</label>
            {isTextArea ? (
                <textarea name={name} value={formData[name]} onChange={handleChange} rows="3"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:ring-1 focus:ring-brandLime focus:border-brandLime text-sm" placeholder={placeholder} />
            ) : (
                <input type={type} name={name} value={formData[name]} onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:ring-1 focus:ring-brandLime focus:border-brandLime text-sm" placeholder={placeholder} />
            )}
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

                {/* Left Side: BIG Form */}
                <div className="xl:col-span-8 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-darkGreen flex items-center gap-2">
                            {editingId ? <Edit size={18} className="text-brandLime" /> : <PlusCircle size={18} className="text-brandLime" />}
                            {editingId ? 'Update Project Details' : 'Add New Project'}
                        </h2>
                        {editingId && <button onClick={resetForm} className="text-red-500 hover:bg-red-50 p-2 rounded-full"><X size={18} /></button>}
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">

                            <div className="md:col-span-2"><SectionTitle title="1. Basic Information" /></div>
                            <InputField label="Project Title *" name="title" placeholder="e.g. The Lumina Residencies" />
                            <InputField label="Location *" name="location" placeholder="e.g. South Kafrul, Dhaka" />
                            <InputField label="Main Cover Image URL *" name="mainImage" placeholder="https://..." />
                            <div className="mb-4">
                                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Status *</label>
                                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm">
                                    <option value="upcoming">Upcoming</option>
                                    <option value="ongoing">Ongoing</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>

                            <div className="md:col-span-2"><SectionTitle title="2. At a Glance" /></div>
                            <InputField label="Land Area" name="landArea" placeholder="e.g. 6.55 Katha" />
                            <InputField label="Facing" name="facing" placeholder="e.g. North-West" />
                            <InputField label="Building Height" name="height" placeholder="e.g. B + GF + 8 Floors" />
                            <InputField label="Total Units" name="totalUnits" placeholder="e.g. 16" />
                            <InputField label="Size of Units" name="sizeOfUnits" placeholder="e.g. 1135 Sft, 1175 Sft" />
                            <InputField label="Handover Date" name="handover" placeholder="e.g. July 2026" />

                            <div className="md:col-span-2"><SectionTitle title="3. Overview & Location" /></div>
                            <div className="md:col-span-2">
                                <InputField label="Project Overview Details" name="overview" isTextArea={true} placeholder="Write the main description here..." />
                            </div>
                            <div className="md:col-span-2">
                                <InputField label="Location Advantages (Comma separated)" name="locationAdvantages" placeholder="e.g. Airport - 15 Mins, Metro Station - 5 Mins" />
                                <InputField label="Google Map Embed URL" name="mapUrl" placeholder="https://www.google.com/maps/embed?..." />
                            </div>

                            <div className="md:col-span-2"><SectionTitle title="4. Technical Specifications" /></div>
                            <InputField label="Structural Features" name="structuralFeatures" isTextArea={true} placeholder="Bullet points using commas..." />
                            <InputField label="Flooring & Finishing" name="flooring" isTextArea={true} placeholder="Bullet points using commas..." />
                            <InputField label="Kitchen & Bathrooms" name="kitchenBath" isTextArea={true} placeholder="Bullet points using commas..." />
                            <InputField label="Electrical & Elevators" name="electrical" isTextArea={true} placeholder="Bullet points using commas..." />

                            <div className="md:col-span-2"><SectionTitle title="5. Media & Gallery" /></div>
                            <div className="md:col-span-2">
                                <InputField label="Gallery Images (Comma separated URLs)" name="galleryImages" isTextArea={true} placeholder="https://img1.jpg, https://img2.jpg" />
                            </div>
                            <InputField label="Virtual Tour (YouTube Embed URL)" name="videoUrl" placeholder="https://www.youtube.com/embed/..." />
                            <InputField label="Floor Plan Type A (Image URL)" name="floorPlanA" placeholder="https://..." />
                            <InputField label="Floor Plan Type B (Image URL)" name="floorPlanB" placeholder="https://..." />
                            <InputField label="Ground Floor Plan (Image URL)" name="groundFloorPlan" placeholder="https://..." />

                        </div>

                        <button type="submit" disabled={loading} className="mt-8 bg-darkGreen text-brandLime font-bold px-8 py-3 rounded-md hover:bg-black transition-colors flex items-center gap-2">
                            <Save size={16} /> {loading ? 'Saving Data...' : (editingId ? 'Update Complete Project' : 'Save Project Data')}
                        </button>
                    </form>
                </div>

                {/* Right Side: Projects List (Sidebar style) */}
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