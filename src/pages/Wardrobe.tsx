import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { wardrobeApi } from "../services/wardrobeApi";
import Menu from "../components/Menu";
import {
  IoSearch,
  IoAdd,
  IoClose,
  IoTrash,
  IoCloudUploadOutline,
  IoArrowBack,
} from "react-icons/io5";

import { FiChevronDown } from "react-icons/fi";
import LoadingOverlay from "../components/LoadingOverlay";

interface ClothingItem {
  id: string;
  name: string;
  brand: string;
  code: string;
  color: string;
  style: string;
  category: string;
  image: string;
  is_favorite?: boolean;
}

export default function Wardrobe() {
  const navigate = useNavigate();
  const [clothes, setClothes] = useState<ClothingItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchClothes = async () => {
      try {
        setIsLoading(true);
        const data = await wardrobeApi.getWardrobe();
        console.log("Wardrobe API returned:", data);
        console.log("Length:", data.length);
        const mappedData = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          brand: item.brand || "",
          code: item.code || "",
          color: item.color || "",
          style: item.style || "",
          category: item.category || "Uncategorized",
          image: item.image_base64,
          is_favorite: item.is_favorite || false,
        }));
        setClothes(mappedData);
      } catch (err) {
        console.error("Failed to load wardrobe", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClothes();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [editingItem, setEditingItem] = useState<ClothingItem | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedForDeletion, setSelectedForDeletion] = useState<Set<string>>(
    new Set(),
  );
  const [isUploading, setIsUploading] = useState(false);

  // Dynamically generate categories from actual wardrobe data
  const categories = [
    "All",
    "Favorites",
    ...Array.from(
      new Set(clothes.map((item) => item.category).filter(Boolean)),
    ),
  ].sort();

  const filteredClothes = clothes.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.color.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All"
        ? true
        : selectedCategory === "Favorites"
          ? item.is_favorite
          : item.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files); // pass the full FileList
    }
  };

  const handleFileUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    try {
      setIsUploading(true);
      const newItems: ClothingItem[] = [];

      for (const file of fileArray) {
        // sequential, not parallel
        const base64Image = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = () => reject(new Error("Read failed"));
          reader.readAsDataURL(file);
        });

        const newGarment = await wardrobeApi.addGarment({
          name: file.name.split(".")[0],
          image_base64: base64Image,
          brand: "Unknown",
          code: "",
        });

        newItems.push({
          id: newGarment.id,
          name: newGarment.name,
          brand: newGarment.brand || "",
          code: newGarment.code || "",
          color: newGarment.color || "",
          style: newGarment.style || "",
          category: newGarment.category || "Uncategorized",
          image: newGarment.image_base64,
        });
      }

      // Refresh wardrobe from backend after successful upload to fix display issue
      const data = await wardrobeApi.getWardrobe();
      const mappedData = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        brand: item.brand || "",
        code: item.code || "",
        color: item.color || "",
        style: item.style || "",
        category: item.category || "Uncategorized",
        image: item.image_base64,
        is_favorite: item.is_favorite || false,
      }));
      console.log("Mapped:", mappedData);
      setClothes(mappedData);
      setIsUploadModalOpen(false);
    } catch (err) {
      console.error("Failed to upload garments", err);
      alert(
        "Failed to upload one or more images. They might be too large or the server is busy.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleItemClick = (item: ClothingItem) => {
    setSelectedItem(item);
    setEditingItem({ ...item });
    setIsDetailModalOpen(true);
  };

  const formatCategory = (cat: string) =>
    cat
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  const handleSaveEdit = async () => {
    if (editingItem) {
      try {
        const updateData = {
          name: editingItem.name,
          brand: editingItem.brand,
          color: editingItem.color,
          style: editingItem.style,
          category: editingItem.category,
        };
        await wardrobeApi.updateGarment(editingItem.id, updateData);

        setClothes(
          clothes.map((item) =>
            item.id === editingItem.id ? { ...item, ...updateData } : item,
          ),
        );
        setIsDetailModalOpen(false);
        setSelectedItem(null);
        setEditingItem(null);
      } catch (err) {
        console.error("Failed to update garment", err);
        alert("Failed to save changes.");
      }
    }
  };

  const handleDelete = async () => {
    if (selectedItem) {
      try {
        await wardrobeApi.deleteGarment(selectedItem.id);
        setClothes(clothes.filter((item) => item.id !== selectedItem.id));
        setIsDetailModalOpen(false);
        setSelectedItem(null);
        setEditingItem(null);
      } catch (err) {
        console.error("Failed to delete garment", err);
        alert("Failed to delete garment.");
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedForDeletion.size === 0) return;

    try {
      setIsLoading(true);
      for (const id of selectedForDeletion) {
        await wardrobeApi.deleteGarment(id);
      }
      setClothes(clothes.filter((item) => !selectedForDeletion.has(item.id)));
      setSelectedForDeletion(new Set());
    } catch (err) {
      console.error("Failed to delete garments", err);
      alert("Failed to delete one or more garments.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCleanAll = async () => {
    if (clothes.length === 0) return;

    if (
      window.confirm(
        "Are you sure you want to delete all items from your wardrobe? This action cannot be undone.",
      )
    ) {
      try {
        setIsLoading(true);
        for (const item of clothes) {
          await wardrobeApi.deleteGarment(item.id);
        }
        setClothes([]);
        setSelectedForDeletion(new Set());
      } catch (err) {
        console.error("Failed to clean wardrobe", err);
        alert("Failed to clean wardrobe.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedForDeletion((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="bg-[#0f0204] min-h-dvh">
      {isLoading && <LoadingOverlay />}

      <Menu />

      <div className="px-10 py-10 max-w-[1360px] mx-auto">
        {/* Page header */}
        <div className="flex justify-between items-end mb-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-[rgba(245,237,227,0.4)] hover:text-[#C4A265] transition-colors"
            >
              <IoArrowBack size={24} />
            </button>
            <h1 className="font-serif text-[36px] text-[#F5EDE3] font-medium">
              My Clothes
            </h1>
          </div>
        </div>
        <div className="h-px bg-[rgba(196,162,101,0.09)] mb-8"></div>

        {/* Search and Filter Section – mobile‑friendly restructure */}
        <div className="flex flex-wrap gap-4 mb-8 items-center">
          {/* Search input */}
          <div className="relative flex-1 min-w-0 md:flex-[2]">
            <IoSearch
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[rgba(245,237,227,0.4)]"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name, brand or color..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1a0508] text-[#F5EDE3] border border-[rgba(196,162,101,0.14)] rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:border-[rgba(196,162,101,0.4)]"
            />
          </div>

          {/* Category dropdown */}
          <div className="relative bg-[#1a0508] border border-[rgba(196,162,101,0.14)] rounded-lg flex-1 md:flex-none md:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-transparent text-[#F5EDE3] w-full py-3 pl-4 pr-10 focus:outline-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-[#1a0508]">
                  {formatCategory(cat)}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2 text-[rgba(245,237,227,0.4)]">
              <FiChevronDown size={16} />
            </div>
          </div>

          {/* Add Clothes button – full width on mobile */}
          <button
            onClick={() => setIsUploadModalOpen(true)}
            disabled={isUploading}
            className={`flex items-center justify-center gap-2 bg-[#C4A265] text-[#1a0508] px-6 py-3 rounded-lg font-semibold hover:bg-[rgba(196,162,101,0.8)] transition-colors w-full md:w-auto ${
              isUploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <IoAdd size={18} />
            Add Clothes
          </button>

          {/* Delete Selected button – full width on mobile, only shown when items are selected */}
          {selectedForDeletion.size > 0 && (
            <button
              onClick={handleDeleteSelected}
              disabled={isUploading}
              className={`flex items-center justify-center gap-2 bg-[#1a0508] text-[#F5EDE3] px-4 py-3 font-medium hover:bg-[#34020E] transition-colors border border-[rgba(196,162,101,0.14)] w-full md:w-auto ${
                isUploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Delete Selected ({selectedForDeletion.size})
            </button>
          )}

          {/* Clean All button – full width on mobile */}
          <button
            onClick={handleCleanAll}
            disabled={isUploading}
            className={`flex items-center justify-center gap-2 bg-[#1a0508] text-[#F5EDE3] px-4 py-3 font-medium hover:bg-[#34020E] transition-colors border border-[rgba(196,162,101,0.14)] w-full md:w-auto ${
              isUploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Clean All
          </button>
        </div>

        {/* Clothes Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredClothes.map((item) => (
            <div
              key={item.id}
              className="bg-[#1a0508] border border-[rgba(196,162,101,0.14)] rounded-xl overflow-hidden cursor-pointer hover:border-[rgba(196,162,101,0.35)] transition-all relative"
            >
              {/* Selection checkbox */}
              <div
                className="absolute top-2 right-2 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSelection(item.id);
                }}
              >
                <div
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                    selectedForDeletion.has(item.id)
                      ? "bg-[#C4A265] border-[#C4A265]"
                      : "border-[rgba(196,162,101,0.3)] bg-[#1a0508]"
                  }`}
                >
                  {selectedForDeletion.has(item.id) && (
                    <div className="w-3 h-3 bg-[#1a0508] rounded-sm" />
                  )}
                </div>
              </div>

              <div onClick={() => handleItemClick(item)}>
                <div className="aspect-square bg-[#2a0a10]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-[#F5EDE3] font-medium text-sm truncate">
                    {item.name}
                  </h3>
                  <p className="text-[rgba(245,237,227,0.4)] text-xs">
                    {item.brand}
                  </p>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    <span className="text-xs bg-[#34020E] text-[rgba(245,237,227,0.6)] px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <span className="text-xs bg-[#0f0204] text-[rgba(245,237,227,0.6)] px-2 py-0.5 rounded">
                      {item.color}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a0508] border border-[rgba(196,162,101,0.14)] rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl text-[#F5EDE3] font-medium">
                Add Clothes
              </h2>
              <button
                onClick={() => !isUploading && setIsUploadModalOpen(false)}
                disabled={isUploading}
                className={`text-[rgba(245,237,227,0.5)] hover:text-[#C4A265] transition-colors ${
                  isUploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <IoClose size={24} />
              </button>
            </div>

            <label
              onDragEnter={!isUploading ? handleDrag : undefined}
              onDragLeave={!isUploading ? handleDrag : undefined}
              onDragOver={!isUploading ? handleDrag : undefined}
              onDrop={!isUploading ? handleDrop : undefined}
              className={`border-2 border-dashed rounded-xl p-10 text-center transition-all block ${
                isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              } ${
                dragActive
                  ? "border-[#C4A265] bg-[rgba(196,162,101,0.1)]"
                  : "border-[rgba(196,162,101,0.14)]"
              }`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C4A265] mb-4"></div>
                  <p className="text-[#F5EDE3] mb-2">Uploading...</p>
                  <p className="text-[rgba(245,237,227,0.5)] text-sm">
                    Please wait while we upload your clothes
                  </p>
                </div>
              ) : (
                <>
                  <IoCloudUploadOutline
                    size={48}
                    className="mx-auto text-[rgba(245,237,227,0.3)] mb-4"
                  />
                  <p className="text-[#F5EDE3] mb-2">
                    Drag and drop your clothes images here
                  </p>
                  <p className="text-[rgba(245,237,227,0.5)] text-sm mb-4">
                    or click anywhere to browse — you can select multiple files
                  </p>
                  <div className="inline-block bg-[#C4A265] text-[#1a0508] px-4 py-2 rounded-lg font-semibold text-sm">
                    Browse Files
                  </div>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                disabled={isUploading}
                multiple
                onChange={(e) =>
                  e.target.files && handleFileUpload(e.target.files)
                }
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}

      {/* Detail/Edit Modal */}
      {isDetailModalOpen && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a0508] border border-[rgba(196,162,101,0.14)] rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl text-[#F5EDE3] font-medium">
                Edit Clothes
              </h2>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-[rgba(245,237,227,0.5)] hover:text-[#C4A265] transition-colors"
              >
                <IoClose size={24} />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="aspect-square bg-[#2a0a10] rounded-xl overflow-hidden border border-[rgba(196,162,101,0.08)]">
                <img
                  src={editingItem.image}
                  alt={editingItem.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[#F5EDE3] block mb-2 text-sm">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingItem.name}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, name: e.target.value })
                    }
                    className="w-full bg-[#0f0204] text-[#F5EDE3] border border-[rgba(196,162,101,0.14)] rounded-lg px-4 py-2 focus:outline-none focus:border-[rgba(196,162,101,0.4)]"
                  />
                </div>
                <div>
                  <label className="text-[#F5EDE3] block mb-2 text-sm">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={editingItem.brand}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, brand: e.target.value })
                    }
                    className="w-full bg-[#0f0204] text-[#F5EDE3] border border-[rgba(196,162,101,0.14)] rounded-lg px-4 py-2 focus:outline-none focus:border-[rgba(196,162,101,0.4)]"
                  />
                </div>
                <div>
                  <label className="text-[#F5EDE3] block mb-2 text-sm">
                    Color
                  </label>
                  <input
                    type="text"
                    value={editingItem.color}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, color: e.target.value })
                    }
                    className="w-full bg-[#0f0204] text-[#F5EDE3] border border-[rgba(196,162,101,0.14)] rounded-lg px-4 py-2 focus:outline-none focus:border-[rgba(196,162,101,0.4)]"
                  />
                </div>
                <div>
                  <label className="text-[#F5EDE3] block mb-2 text-sm">
                    Style
                  </label>
                  <input
                    type="text"
                    value={editingItem.style}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, style: e.target.value })
                    }
                    className="w-full bg-[#0f0204] text-[#F5EDE3] border border-[rgba(196,162,101,0.14)] rounded-lg px-4 py-2 focus:outline-none focus:border-[rgba(196,162,101,0.4)]"
                  />
                </div>
                <div>
                  <label className="text-[#F5EDE3] block mb-2 text-sm">
                    Category
                  </label>
                  <select
                    value={editingItem.category}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        category: e.target.value,
                      })
                    }
                    className="w-full bg-[#0f0204] text-[#F5EDE3] border border-[rgba(196,162,101,0.14)] rounded-lg px-4 py-2 focus:outline-none focus:border-[rgba(196,162,101,0.4)] appearance-none cursor-pointer"
                  >
                    {categories
                      .filter((c) => c !== "All")
                      .map((cat) => (
                        <option key={cat} value={cat} className="bg-[#0f0204]">
                          {cat}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-[#C4A265] text-[#1a0508] py-3 rounded-lg font-semibold hover:bg-[rgba(196,162,101,0.8)] transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-[#34020E] text-[#F5EDE3] py-3 rounded-lg font-semibold hover:bg-[#1a0508] transition-colors"
              >
                <IoTrash size={18} className="inline mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
