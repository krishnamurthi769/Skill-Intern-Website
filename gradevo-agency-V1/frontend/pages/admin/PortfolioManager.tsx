import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Plus, Save, X, Upload, Filter } from 'lucide-react';

interface PortfolioItem {
    id: number;
    title: string;
    category: string;
    image: string;
    description: string;
    project_url?: string;
    tech_stack?: string;
    is_featured?: boolean;
}

const CATEGORIES = ['All', 'Brand Solutions', 'Tech Solutions', 'Media Solutions', 'Others'];

const PortfolioManager: React.FC = () => {
    const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
    const [filteredPortfolio, setFilteredPortfolio] = useState<PortfolioItem[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState<Partial<PortfolioItem>>({});
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [itemsToShow, setItemsToShow] = useState(12); // Show 12 items initially

    useEffect(() => {
        fetchPortfolio();
    }, []);

    useEffect(() => {
        if (selectedCategory === 'All') {
            setFilteredPortfolio(portfolio);
        } else {
            setFilteredPortfolio(portfolio.filter(item => item.category === selectedCategory));
        }
        setItemsToShow(12); // Reset when category changes
    }, [selectedCategory, portfolio]);

    const fetchPortfolio = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/content/portfolio`);
        const data = await res.json();
        setPortfolio(data);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure?')) {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/content/portfolio/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });

            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    alert('Session expired. Please login again.');
                    window.location.href = '/#/admin/login';
                    return;
                }
                alert('Failed to delete project');
                return;
            }
            fetchPortfolio();
        }
    };

    const handleSave = async () => {
        const formData = new FormData();
        formData.append('title', currentItem.title || '');
        formData.append('category', currentItem.category || 'Brand Solutions');
        formData.append('description', currentItem.description || '');
        formData.append('project_url', currentItem.project_url || '');
        formData.append('tech_stack', currentItem.tech_stack || '');
        formData.append('is_featured', String(currentItem.is_featured || false));

        if (imageFile) {
            formData.append('image', imageFile);
        } else if (currentItem.image) {
            formData.append('image', currentItem.image);
        }

        const url = currentItem.id
            ? `${import.meta.env.VITE_API_URL}/api/content/portfolio/${currentItem.id}`
            : `${import.meta.env.VITE_API_URL}/api/content/portfolio`;

        const method = currentItem.id ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData,
        });

        if (!res.ok) {
            if (res.status === 401 || res.status === 403) {
                alert('Session expired. Please login again.');
                window.location.href = '/#/admin/login';
                return;
            }
            alert('Failed to save project');
            return;
        }

        setIsEditing(false);
        setCurrentItem({});
        setImageFile(null);
        fetchPortfolio();
    };

    const displayedItems = filteredPortfolio.slice(0, itemsToShow);
    const hasMore = filteredPortfolio.length > itemsToShow;

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold">Manage Portfolio</h2>
                <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded border">
                        <Filter size={16} className="text-gray-500" />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="bg-transparent border-none focus:outline-none text-sm"
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={() => { setIsEditing(true); setCurrentItem({ category: 'Brand Solutions' }); setImageFile(null); }}
                        className="bg-gradevo-blue text-white px-4 py-2 rounded flex items-center gap-2 whitespace-nowrap"
                    >
                        <Plus size={20} /> Add Project
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedItems.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded shadow flex flex-col h-full">
                        <div className="relative h-40 mb-4 bg-gray-100 rounded overflow-hidden">
                            {item.image && (
                                <img
                                    src={item.image.startsWith('http') ? item.image : `${import.meta.env.VITE_API_URL}${item.image}`}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                        <div className="flex-1">
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{item.category}</span>
                            <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{item.description}</p>
                            {item.tech_stack && (
                                <p className="text-xs text-gray-500 mb-2">
                                    <span className="font-semibold">Tech:</span> {item.tech_stack}
                                </p>
                            )}
                        </div>
                        <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                            <button onClick={() => { setCurrentItem(item); setIsEditing(true); setImageFile(null); }} className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded">
                                <Edit size={20} />
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* View More Button */}
            {hasMore && (
                <div className="mt-8 text-center">
                    <button
                        onClick={() => setItemsToShow(prev => prev + 12)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        View More ({filteredPortfolio.length - itemsToShow} remaining)
                    </button>
                </div>
            )}

            {isEditing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white p-6 rounded-lg w-full max-w-lg my-8">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">{currentItem.id ? 'Edit Project' : 'Add Project'}</h3>
                            <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Project Title"
                                className="w-full border p-2 rounded"
                                value={currentItem.title || ''}
                                onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
                            />
                            <select
                                className="w-full border p-2 rounded"
                                value={currentItem.category || 'Brand Solutions'}
                                onChange={(e) => setCurrentItem({ ...currentItem, category: e.target.value })}
                            >
                                {CATEGORIES.filter(c => c !== 'All').map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <textarea
                                placeholder="Project Description"
                                className="w-full border p-2 rounded h-24"
                                value={currentItem.description || ''}
                                onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Project URL (e.g., https://example.com)"
                                className="w-full border p-2 rounded"
                                value={currentItem.project_url || ''}
                                onChange={(e) => setCurrentItem({ ...currentItem, project_url: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Tech Stack (e.g., React, Node.js, Tailwind)"
                                className="w-full border p-2 rounded"
                                value={currentItem.tech_stack || ''}
                                onChange={(e) => setCurrentItem({ ...currentItem, tech_stack: e.target.value })}
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Project Thumbnail</label>
                                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded flex items-center gap-2 border">
                                    <Upload size={16} />
                                    <span className="text-sm">Upload Image</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files?.[0]) {
                                                setImageFile(e.target.files[0]);
                                            }
                                        }}
                                    />
                                </label>
                                {imageFile ? (
                                    <span className="text-sm text-green-600 truncate">{imageFile.name}</span>
                                ) : currentItem.image ? (
                                    <span className="text-sm text-gray-500 truncate">Current image set</span>
                                ) : null}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_featured"
                                className="w-4 h-4"
                                checked={currentItem.is_featured || false}
                                onChange={(e) => setCurrentItem({ ...currentItem, is_featured: e.target.checked })}
                            />
                            <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">
                                Featured (Show in Selected Work)
                            </label>
                        </div>

                        <button
                            onClick={handleSave}
                            className="w-full bg-gradevo-blue text-white py-2 rounded hover:bg-blue-700 transition-colors flex justify-center items-center gap-2"
                        >
                            <Save size={20} /> Save
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PortfolioManager;
