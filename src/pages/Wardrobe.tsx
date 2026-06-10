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

const CATEGORY_MAP: Record<string, string> = {
    't-shirt': 'Tops', 'shirt': 'Tops', 'blouse': 'Tops',
    'hoodie': 'Tops', 'sweater': 'Tops', 'cardigan': 'Tops',
    'vest': 'Tops', 'crop top': 'Tops', 'polo shirt': 'Tops',
    'turtleneck': 'Tops',
    'skirt': 'Bottoms', 'pants': 'Bottoms', 'jeans': 'Bottoms',
    'shorts': 'Bottoms', 'leggings': 'Bottoms', 'wide-leg pants': 'Bottoms',
    'mini skirt': 'Bottoms', 'midi skirt': 'Bottoms', 'maxi skirt': 'Bottoms',
    'jacket': 'Outerwear', 'blazer': 'Outerwear', 'coat': 'Outerwear',
    'trench coat': 'Outerwear', 'puffer jacket': 'Outerwear', 'denim jacket': 'Outerwear',
    'dress': 'Dresses', 'jumpsuit': 'Dresses', 'romper': 'Dresses',
    'sneakers': 'Shoes', 'boots': 'Shoes', 'sandals': 'Shoes',
    'heels': 'Shoes', 'loafers': 'Shoes', 'mules': 'Shoes',
    'ankle boots': 'Shoes', 'platform shoes': 'Shoes',
    'bag': 'Accessories', 'belt': 'Accessories', 'scarf': 'Accessories',
    'hat': 'Accessories', 'socks': 'Accessories', 'gloves': 'Accessories',
    'sunglasses': 'Accessories', 'jewellery': 'Accessories',
    'backpack': 'Accessories', 'tote bag': 'Accessories',
    'swimsuit': 'Accessories', 'bikini top': 'Accessories', 'bikini bottom': 'Accessories',
}

interface ClothingItem {
  id: string;
  name: string;
  brand: string;
  code: string;
  color: string;
  style: string;
  category: string;
  image: string;
}

interface SuggestionItem {
  id: string;
  name: string;
  brand: string;
  price: string;
  image: string;
  reason: string;
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
        const mappedData = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          brand: item.brand || "",
          code: item.code || "",
          color: item.color || "",
          style: item.style || "",
          category: CATEGORY_MAP[item.category?.toLowerCase()] || "Accessories",
          image: item.image_base64,
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

  const buySuggestions: SuggestionItem[] = [
    {
      id: "b1",
      name: "Beige Trench Coat",
      brand: "Burberry",
      price: "$890",
      image:
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400",
      reason: "Perfect match for your casual style",
    },
    {
      id: "b2",
      name: "White Sneakers",
      brand: "Nike",
      price: "$120",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
      reason: "Complements your existing wardrobe",
    },
  ];

  const sellSuggestions: SuggestionItem[] = [
    {
      id: "s1",
      name: "Old Graphic Tee",
      brand: "Various",
      price: "$15",
      image:
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400",
      reason: "Doesn't match your current style",
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [editingItem, setEditingItem] = useState<ClothingItem | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<"upload" | "search">(
    "upload",
  );
  const [activeTab, setActiveTab] = useState<"myWardrobe" | "buy" | "sell">(
    "myWardrobe",
  );

  const categories = [
    "All",
    "Tops",
    "Bottoms",
    "Outerwear",
    "Dresses",
    "Shoes",
    "Accessories",
  ];

  const filteredClothes = clothes.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.color.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
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
      setIsLoading(true);
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
          category: CATEGORY_MAP[newGarment.category?.toLowerCase()] || "Accessories",
          image: newGarment.image_base64,
        });
      }

      setClothes((prev) => [...prev, ...newItems]);
      setIsUploadModalOpen(false);
    } catch (err) {
      console.error("Failed to upload garments", err);
      alert(
        "Failed to upload one or more images. They might be too large or the server is busy.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnlineSearch = () => {
    const newClothing: ClothingItem = {
      id: Date.now().toString(),
      name: "Searched Item",
      brand: "Brand Name",
      code: "CODE123",
      color: "Various",
      style: "Modern",
      category: "Tops",
      image:
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400",
    };
    setClothes([...clothes, newClothing]);
    setIsUploadModalOpen(false);
  };

  const handleItemClick = (item: ClothingItem) => {
    setSelectedItem(item);
    setEditingItem({ ...item });
    setIsDetailModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (editingItem) {
      try {
        const updateData = {
          name: editingItem.name,
          brand: editingItem.brand,
          code: editingItem.code,
          color: editingItem.color,
          style: editingItem.style,
          category: editingItem.category,
        };
        const updated = await wardrobeApi.updateGarment(
          editingItem.id,
          updateData,
        );

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

  return (
    <div className="bg-[#34020E] min-h-dvh">
      {isLoading && <LoadingOverlay />}

      <Menu />

      <div className="px-6 sm:px-6 md:px-10 py-7">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-white hover:text-[#FE7743] mb-6 transition-colors"
        >
          <IoArrowBack size={24} />
          <span className="font-medium">Back to Dashboard</span>
        </button>

        {/* Tab Menu */}
        <div className="flex gap-1.5 mb-6 bg-gray-900/50 p-1.5 rounded-2xl backdrop-blur-sm border border-gray-700/50">
          <button
            onClick={() => setActiveTab("myWardrobe")}
            className={`flex-1 px-2 sm:px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
              activeTab === "myWardrobe"
                ? "bg-gradient-to-r from-[#FE7743] to-[#FF9A5C] text-black shadow-lg shadow-[#FE7743]/30"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
          >
            <span className="hidden sm:inline">My Wardrobe</span>
            <span className="sm:hidden">Wardrobe</span>
          </button>
          <button
            onClick={() => setActiveTab("buy")}
            className={`flex-1 px-2 sm:px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
              activeTab === "buy"
                ? "bg-gradient-to-r from-[#FE7743] to-[#FF9A5C] text-black shadow-lg shadow-[#FE7743]/30"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
          >
            <span className="hidden sm:inline">Suggestions to buy</span>
            <span className="sm:hidden">To buy</span>
          </button>
          <button
            onClick={() => setActiveTab("sell")}
            className={`flex-1 px-2 sm:px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
              activeTab === "sell"
                ? "bg-gradient-to-r from-[#FE7743] to-[#FF9A5C] text-black shadow-lg shadow-[#FE7743]/30"
                : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
          >
            <span className="hidden sm:inline">Suggestions to sell</span>
            <span className="sm:hidden">To sell</span>
          </button>
        </div>

        {/* Search and Filter Section - Only for My Wardrobe */}
        {activeTab === "myWardrobe" && (
          <div className="flex flex-col md:flex-row gap-3 mb-6 py-2 justify-between">
            <div className="relative w-full sm:flex-1 py-2 sm:py-1 sm:max-w-50">
              <IoSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search by name, brand or color..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-idle pl-10 bg-gray-800 text-white border-gray-600 rounded-md w-full sm:min-w-65 sm:text-sm py-2 text-base sm:py-1"
              />
            </div>

            <div className="flex items-center gap-2 flex-nowrap justify-between">
              <div className="relative sm:justify-between flex mr-4 bg-gray-800 px-2 min-w-40 sm:max-w-50 rounded-md">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none input input-idle bg-gray-800 text-white border-gray-600 rounded-md py-1 pl-2 focus:outline-none focus:ring-0 focus:border-gray-600"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <div className="pointer-events-none inset-y-0 flex pl-5 sm:pl-0 items-center text-white/70">
                  <FiChevronDown size={16} />
                </div>
              </div>

              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="btn-primary btn-primary-orange flex items-center justify-center min-w-40 gap-2 border-2 border-white rounded-md px-2 text-white"
              >
                <IoAdd size={16} />
                Add Clothes
              </button>
            </div>
          </div>
        )}

        {/* Content based on active tab */}
        {activeTab === "myWardrobe" && (
          <>
            {/* Clothes Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-10">
              {filteredClothes.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#FE7743] transition-all"
                >
                  <div className="aspect-square bg-gray-700">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-white font-medium text-sm truncate">
                      {item.name}
                    </h3>
                    <p className="text-gray-400 text-xs">{item.brand}</p>
                    <div className="flex gap-1 mt-2 flex-wrap">
                      <span className="text-xs bg-[#273F4F] text-white px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      <span className="text-xs bg-gray-700 text-white px-2 py-0.5 rounded">
                        {item.color}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "buy" && (
          <>
            {/* Suggestions to Buy Section */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-white mb-4">
                Suggested to Buy
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {buySuggestions.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-800 rounded-xl overflow-hidden"
                  >
                    <div className="aspect-square bg-gray-700">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-white font-medium text-sm truncate">
                        {item.name}
                      </h3>
                      <p className="text-gray-400 text-xs">{item.brand}</p>
                      <p className="text-[#FE7743] font-bold text-sm mt-1">
                        {item.price}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        {item.reason}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "sell" && (
          <>
            {/* Suggestions to Sell Section */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Suggested to Sell
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sellSuggestions.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-800 rounded-xl overflow-hidden"
                  >
                    <div className="aspect-square bg-gray-700">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-white font-medium text-sm truncate">
                        {item.name}
                      </h3>
                      <p className="text-gray-400 text-xs">{item.brand}</p>
                      <p className="text-green-500 font-bold text-sm mt-1">
                        {item.price}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        {item.reason}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#34020E] rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Add Clothes</h2>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-white hover:text-[#FE7743]"
              >
                <IoClose size={24} />
              </button>
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setUploadMethod("upload")}
                className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                  uploadMethod === "upload"
                    ? "bg-[#FE7743] text-black"
                    : "bg-gray-700 text-white"
                }`}
              >
                Upload Image
              </button>
              <button
                onClick={() => setUploadMethod("search")}
                className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                  uploadMethod === "search"
                    ? "bg-[#FE7743] text-black"
                    : "bg-gray-700 text-white"
                }`}
              >
                Search Online
              </button>
            </div>

            {uploadMethod === "upload" ? (
              <label
                onDragEnter={!isLoading ? handleDrag : undefined}
                onDragLeave={!isLoading ? handleDrag : undefined}
                onDragOver={!isLoading ? handleDrag : undefined}
                onDrop={!isLoading ? handleDrop : undefined}
                className={`border-2 border-dashed rounded-xl p-10 text-center transition-all block ${
                  isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                } ${dragActive ? "border-[#FE7743] bg-[#FE7743] bg-opacity-10" : "border-gray-600"}`}
              >
                <IoCloudUploadOutline
                  size={48}
                  className="mx-auto text-gray-400 mb-4"
                />
                <p className="text-white mb-2">
                  Drag and drop your clothes images here
                </p>
                <p className="text-white text-sm mb-4">
                  or click anywhere to browse — you can select multiple files
                </p>
                <div className="btn-primary btn-primary-orange inline-block text-white">
                  Browse Files
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={isLoading}
                  onChange={(e) =>
                    e.target.files && handleFileUpload(e.target.files)
                  }
                  className="hidden"
                />
              </label>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-white block mb-2">Brand</label>
                  <input
                    type="text"
                    placeholder="Enter brand name"
                    className="input input-idle bg-gray-800 text-white border-gray-600"
                  />
                </div>

                <div>
                  <label className="text-white block mb-2">Product Code</label>
                  <input
                    type="text"
                    placeholder="Enter product code"
                    className="input input-idle bg-gray-800 text-white border-gray-600"
                  />
                </div>

                <button
                  onClick={!isLoading ? handleOnlineSearch : undefined}
                  disabled={isLoading}
                  className="btn-primary btn-primary-orange w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Search Online
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detail/Edit Modal */}
      {isDetailModalOpen && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#34020E] rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Edit Clothes</h2>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-white hover:text-[#FE7743]"
              >
                <IoClose size={24} />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="aspect-square bg-gray-700 rounded-xl overflow-hidden">
                <img
                  src={editingItem.image}
                  alt={editingItem.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-white block mb-2">Name</label>
                  <input
                    type="text"
                    value={editingItem.name}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, name: e.target.value })
                    }
                    className="input input-idle bg-gray-800 text-white border-gray-600"
                  />
                </div>
                <div>
                  <label className="text-white block mb-2">Brand</label>
                  <input
                    type="text"
                    value={editingItem.brand}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, brand: e.target.value })
                    }
                    className="input input-idle bg-gray-800 text-white border-gray-600"
                  />
                </div>
                <div>
                  <label className="text-white block mb-2">Product Code</label>
                  <input
                    type="text"
                    value={editingItem.code}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, code: e.target.value })
                    }
                    className="input input-idle bg-gray-800 text-white border-gray-600"
                  />
                </div>
                <div>
                  <label className="text-white block mb-2">Color</label>
                  <input
                    type="text"
                    value={editingItem.color}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, color: e.target.value })
                    }
                    className="input input-idle bg-gray-800 text-white border-gray-600"
                  />
                </div>
                <div>
                  <label className="text-white block mb-2">Style</label>
                  <input
                    type="text"
                    value={editingItem.style}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, style: e.target.value })
                    }
                    className="input input-idle bg-gray-800 text-white border-gray-600"
                  />
                </div>
                <div>
                  <label className="text-white block mb-2">Category</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        category: e.target.value,
                      })
                    }
                    className="input input-idle bg-gray-800 text-white border-gray-600"
                  >
                    {categories
                      .filter((c) => c !== "All")
                      .map((cat) => (
                        <option key={cat} value={cat}>
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
                className="btn-primary btn-primary-orange flex-1"
              >
                Save Changes
              </button>
              <button
                onClick={handleDelete}
                className="btn-primary bg-red-600 hover:bg-red-700 text-white flex-1"
              >
                <IoTrash size={20} className="inline mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
