import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, Building2, MapPin, Trash2, Edit, X } from 'lucide-react';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null); // এডিট করার জন্য প্রজেক্টের ID ট্র্যাকিং

    const [formData, setFormData] = useState({
        title: '',
        location: '',
        status: 'upcoming',
        mainImage: ''
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await axios.get('https://propertynextv2-backend.onrender.com/api/projects/all');
            if (response.data.success) {
                setProjects(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ফর্ম সাবমিট (Add এবং Update দুটোর জন্যই)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingId) {
                // Update Project
                const response = await axios.put(`https://propertynextv2-backend.onrender.com/api/projects/${editingId}`, formData);
                if (response.data.success) alert('Project updated successfully! 🎉');
            } else {
                // Add New Project
                const response = await axios.post('https://propertynextv2-backend.onrender.com/api/projects/add', formData);
                if (response.data.success) alert('Project added successfully! 🎉');
            }

            resetForm();
            fetchProjects();
        } catch (error) {
            alert(editingId ? 'Failed to update project!' : 'Failed to add project!');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // প্রজেক্ট ডিলিট করা
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this project?")) {
            try {
                const response = await axios.delete(`https://propertynextv2-backend.onrender.com/api/projects/${id}`);
                if (response.data.success) {
                    fetchProjects(); // ডিলিট হওয়ার পর লিস্ট আপডেট করা
                }
            } catch (error) {
                alert("Failed to delete project");
                console.error("Error deleting project:", error);
            }
        }
    };

    // প্রজেক্ট এডিট মোডে আনা
    const handleEdit = (project) => {
        setFormData({
            title: project.title,
            location: project.location,
            status: project.status,
            mainImage: project.mainImage
        });
        setEditingId(project._id);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // ফর্মের কাছে পেজ স্ক্রল করে নিয়ে যাবে
    };

    // ফর্ম রিসেট করা
    const resetForm = () => {
        setFormData({ title: '', location: '', status: 'upcoming', mainImage: '' });
        setEditingId(null);
    };

    return (
        <div>
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manage Projects</h1>
                    <p className="text-gray-500 mt-2 text-[15px]">Add new properties and manage existing ones.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Side: Add/Edit Project Form */}
                <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100 h-fit">
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-xl font-bold text-darkGreen flex items-center gap-2">
                            {editingId ? <Edit size={20} className="text-brandLime" /> : <PlusCircle size={20} className="text-brandLime" />}
                            {editingId ? 'Update Project' : 'Add New Project'}
                        </h2>
                        {editingId && (
                            <button onClick={resetForm} className="text-gray-400 hover:text-red-500 transition-colors">
                                <X size={20} />
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Project Title</label>
                            <input
                                type="text" name="title" value={formData.title} onChange={handleChange} required
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandLime/50 focus:border-brandLime transition-all"
                                placeholder="e.g. PropertyNext Tower"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Location</label>
                            <input
                                type="text" name="location" value={formData.location} onChange={handleChange} required
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandLime/50 focus:border-brandLime transition-all"
                                placeholder="e.g. Gulshan 1, Dhaka"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                            <select
                                name="status" value={formData.status} onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandLime/50 focus:border-brandLime transition-all"
                            >
                                <option value="upcoming">Upcoming</option>
                                <option value="ongoing">Ongoing</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Main Image URL</label>
                            <input
                                type="text" name="mainImage" value={formData.mainImage} onChange={handleChange} required
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandLime/50 focus:border-brandLime transition-all"
                                placeholder="https://link-to-image.jpg"
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit" disabled={loading}
                                className="flex-1 bg-darkGreen text-brandLime font-bold py-3 rounded-lg hover:bg-black transition-colors flex justify-center items-center gap-2"
                            >
                                {loading ? 'Saving...' : (editingId ? 'Update' : 'Save Project')}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Side: Projects List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-darkGreen">All Projects ({projects.length})</h2>
                        </div>

                        <div className="p-6">
                            {projects.length === 0 ? (
                                <div className="text-center py-10 text-gray-400">
                                    <Building2 size={48} className="mx-auto mb-3 opacity-20" />
                                    <p>No projects found. Add your first project!</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {projects.map((project) => (
                                        <div key={project._id} className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-white flex flex-col">

                                            {/* Image Container */}
                                            <div className="h-44 bg-gray-200 overflow-hidden relative">
                                                <img
                                                    src={project.mainImage}
                                                    alt={project.title}
                                                    className="w-full h-full object-cover"
                                                />

                                                {/* Status Badge (Top Left) */}
                                                <span className={`absolute top-3 left-3 text-[10px] font-bold px-3 py-1 rounded-full uppercase shadow-md z-20 ${project.status === 'completed' ? 'bg-green-500 text-white' :
                                                    project.status === 'ongoing' ? 'bg-blue-500 text-white' :
                                                        'bg-brandLime text-darkGreen'
                                                    }`}>
                                                    {project.status}
                                                </span>

                                                {/* Action Buttons (Top Right) - এখন সবসময় দেখা যাবে */}
                                                <div className="absolute top-3 right-3 z-30 flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(project)}
                                                        className="bg-white p-2 rounded-md text-blue-600 hover:bg-blue-600 hover:text-white shadow-md transition-colors"
                                                        title="Edit Project"
                                                    >
                                                        <Edit size={16} strokeWidth={2.5} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(project._id)}
                                                        className="bg-white p-2 rounded-md text-red-500 hover:bg-red-600 hover:text-white shadow-md transition-colors"
                                                        title="Delete Project"
                                                    >
                                                        <Trash2 size={16} strokeWidth={2.5} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="p-5 flex-1 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">{project.title}</h3>
                                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                                        <MapPin size={14} className="text-gray-400 shrink-0" />
                                                        <span className="truncate">{project.location}</span>
                                                    </p>
                                                </div>
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Projects;