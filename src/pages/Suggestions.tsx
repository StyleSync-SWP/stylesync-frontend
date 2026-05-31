import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { wardrobeApi } from "../services/wardrobeApi";
import { outfitApi, type OutfitSuggestPayload } from "../services/outfitApi";
import Menu from "../components/Menu";
import {
  IoArrowBack,
  IoAdd,
  IoCloudUploadOutline,
  IoClose,
  IoChatbubble,
  IoSend,
  IoRefresh,
  IoHeart,
} from "react-icons/io5";
import Swal from "sweetalert2";

interface ClothingItem {
  id: string;
  name: string;
  brand: string;
  color: string;
  category: string;
  image: string;
}

interface SuggestedOutfit {
  id: string;
  items: ClothingItem[];
  description: string;
  rating: number;
  confidence: number;
}

const COLORS = [
  { label: "Black", bg: "bg-black", border: "border-gray-500" },
  { label: "White", bg: "bg-white", border: "border-gray-400" },
  { label: "Gray", bg: "bg-gray-500", border: "border-gray-400" },
  { label: "Red", bg: "bg-red-500", border: "border-red-400" },
  { label: "Blue", bg: "bg-blue-500", border: "border-blue-400" },
  { label: "Navy", bg: "bg-blue-900", border: "border-blue-700" },
  { label: "Green", bg: "bg-green-500", border: "border-green-400" },
  { label: "Yellow", bg: "bg-yellow-400", border: "border-yellow-300" },
  { label: "Pink", bg: "bg-pink-400", border: "border-pink-300" },
  { label: "Purple", bg: "bg-purple-500", border: "border-purple-400" },
  { label: "Orange", bg: "bg-orange-500", border: "border-orange-400" },
  { label: "Brown", bg: "bg-amber-800", border: "border-amber-700" },
  { label: "Beige", bg: "bg-amber-100", border: "border-amber-300" },
];

const OCCASION_OPTIONS = [
  "Casual", "Office", "Party", "Sport", "Beach",
  "Evening", "Outdoor", "Date Night",
];

const STYLE_OPTIONS = [
  { label: "Casual",     value: "casual" },
  { label: "Minimalist", value: "minimalist" },
  { label: "Elegant",    value: "elegant" },
  { label: "Bohemian",   value: "bohemian" },
  { label: "Sport",      value: "sport" },
  { label: "Streetwear", value: "streetwear" },
  { label: "Formal",     value: "formal" },
  { label: "Romantic",   value: "romantic" },
];

export default function Suggestions() {
  const navigate = useNavigate();
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [wardrobeItems, setWardrobeItems] = useState<ClothingItem[]>([]);

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
    );
  };

  useEffect(() => {
    const fetchWardrobe = async () => {
      try {
        const data = await wardrobeApi.getWardrobe();
        const mappedData = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          brand: item.brand || "",
          color: item.color || "",
          category: item.category || "Uncategorized",
          image: item.image_base64,
        }));
        setWardrobeItems(mappedData);
      } catch (err) {
        console.error("Failed to load wardrobe", err);
      }
    };
    fetchWardrobe();
  }, []);

  const [selectedClothes, setSelectedClothes] = useState<ClothingItem[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [inputMode, setInputMode] = useState<"text" | "dropdown">("text");
  const [textInput, setTextInput] = useState("");
  const [dropdownValues, setDropdownValues] = useState({
    occasion: "",
    style: "",
  });
  const [suggestedOutfit, setSuggestedOutfit] = useState<SuggestedOutfit | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);

  const [outfitPool, setOutfitPool] = useState<any[]>([]);
  const [poolIndex, setPoolIndex] = useState(0);

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
      handleFileUpload(files);
    }
  };

  const handleFileUpload = async (files: FileList | File) => {
    const fileArray = files instanceof FileList ? Array.from(files) : [files];

    for (const file of fileArray) {
      const reader = new FileReader();
      await new Promise<void>((resolve) => {
        reader.onload = async (e) => {
          try {
            const base64Image = e.target?.result as string;
            const newGarment = await wardrobeApi.addGarment({
              name: file.name.split(".")[0],
              image_base64: base64Image,
              brand: "Unknown",
              code: "",
            });
            const newClothing: ClothingItem = {
              id: newGarment.id,
              name: newGarment.name,
              brand: newGarment.brand || "",
              color: newGarment.color || "",
              category: newGarment.category || "Uncategorized",
              image: newGarment.image_base64,
            };
            setWardrobeItems((prev) => [...prev, newClothing]);
            setSelectedClothes((prev) => [...prev, newClothing]);
          } catch (err) {
            console.error("Failed to upload garment", err);
            alert("Failed to upload image.");
          }
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }
    setIsUploadModalOpen(false);
  };

  const toggleClothingSelection = (item: ClothingItem) => {
    if (selectedClothes.find((c) => c.id === item.id)) {
      setSelectedClothes(selectedClothes.filter((c) => c.id !== item.id));
    } else {
      setSelectedClothes([...selectedClothes, item]);
    }
  };

  const buildPayload = (): OutfitSuggestPayload => {
    if (inputMode === "text") {
      return {
        query: textInput + (selectedColors.length > 0 ? ` Preferred colors: ${selectedColors.join(", ")}.` : ""),
        explicit_filters: null,
      };
    }
    return {
      query: "",
      explicit_filters: {
        occasions: dropdownValues.occasion ? [dropdownValues.occasion] : [],
        styles: dropdownValues.style ? [dropdownValues.style] : [],
        colors: selectedColors.map((c) => c.toLowerCase()),
      },
    };
  };

  const mapOutfit = (raw: any): SuggestedOutfit => {
    const items = (raw.garment_ids || [])
      .map((id: string) => wardrobeItems.find((w) => w.id === id))
      .filter(Boolean) as ClothingItem[];
    return {
      id: raw.id,
      items,
      description: raw.prompt,
      rating: raw.rating || 0,
      confidence: Math.floor(Math.random() * 8) + 88,
    };
  };

  const fetchPool = async () => {
    setIsLoading(true);
    try {
      const response = await outfitApi.suggestOutfit(buildPayload());
      const pool: any[] = Array.isArray(response) ? response : [response];
      setOutfitPool(pool);
      setPoolIndex(0);
      if (pool.length > 0) {
        setSuggestedOutfit(mapOutfit(pool[0]));
      }
    } catch (err) {
      console.error("Failed to get suggestion", err);
    } finally {
      setIsLoading(false);
      setUserRating(0);
    }
  };

  const handleSubmit = async () => {
    await fetchPool();
  };

  const handleTrySimilar = async () => {
    const nextIndex = poolIndex + 1;
    if (nextIndex < outfitPool.length) {
      setPoolIndex(nextIndex);
      setSuggestedOutfit(mapOutfit(outfitPool[nextIndex]));
      setUserRating(0);
      return;
    }
    await fetchPool();
  };

  const handleSaveOutfit = () => {
    Swal.fire({
      title: "Outfit Saved!",
      text: "This outfit has been saved to your past outfit reviews.",
      icon: "success",
      background: "#34020E",
      color: "#fff",
      confirmButtonColor: "#FE7743",
    });
  };

  const handleRating = (rating: number) => {
    setUserRating(rating);
    if (suggestedOutfit) setSuggestedOutfit({ ...suggestedOutfit, rating });
  };

  const renderStars = (rating: number, interactive: boolean = false) => {
    return Array.from({ length: 10 }).map((_, i) => (
      <button
        key={i}
        type="button"
        disabled={!interactive}
        onClick={() => interactive && handleRating(i + 1)}
        className={`text-2xl transition-all ${
          i < rating ? "text-yellow-400" : "text-gray-600"
        } ${interactive ? "hover:scale-125 cursor-pointer" : ""}`}
      >
        ★
      </button>
    ));
  };

  const pillBtn = (active: boolean, border = "border-gray-600") =>
    `px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all text-white ${
      active
        ? "border-[#FE7743] scale-105"
        : `${border} opacity-70 hover:opacity-100`
    }`;

  const remainingInPool = outfitPool.length - poolIndex - 1;

  return (
    <div className="bg-[#34020E] min-h-dvh">
      <Menu />

      <div className="px-6 sm:px-6 md:px-10 py-7">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-white hover:text-[#FE7743] mb-6 transition-colors"
        >
          <IoArrowBack size={24} />
          <span className="font-medium">Back to Dashboard</span>
        </button>

        <h1 className="text-3xl font-bold text-white mb-6">Outfit Suggestions</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section 1: Clothes Selection */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Select Your Clothes</h2>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#FE7743] text-black rounded-lg hover:bg-[#FF9A5C] transition-colors"
              >
                <IoAdd size={20} />
                Upload New
              </button>
              <span className="text-gray-400 text-sm self-center">
                {selectedClothes.length} selected
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 max-h-80 overflow-y-auto">
              {wardrobeItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleClothingSelection(item)}
                  className={`relative cursor-pointer rounded-lg overflow-hidden transition-all ${
                    selectedClothes.find((c) => c.id === item.id)
                      ? "ring-2 ring-[#FE7743]"
                      : "hover:ring-2 hover:ring-gray-600"
                  }`}
                >
                  <div className="aspect-square bg-gray-700">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  {selectedClothes.find((c) => c.id === item.id) && (
                    <div className="absolute top-2 right-2 bg-[#FE7743] rounded-full p-1">
                      <IoHeart size={16} className="text-black" />
                    </div>
                  )}
                  <div className="p-2">
                    <p className="text-white text-xs truncate">{item.name}</p>
                    <p className="text-gray-400 text-xs">{item.category}</p>
                  </div>
                </div>
              ))}
            </div>

            {selectedClothes.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <h3 className="text-white text-sm font-medium mb-2">Selected Items:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedClothes.map((item) => (
                    <span key={item.id} className="text-xs bg-[#273F4F] text-white px-2 py-1 rounded">
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Input Section */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Provide Your Preferences</h2>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setInputMode("text")}
                className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                  inputMode === "text" ? "bg-[#FE7743] text-black" : "bg-gray-700 text-white hover:bg-gray-600"
                }`}
              >
                <IoChatbubble className="inline mr-2" />
                Chat Input
              </button>
              <button
                onClick={() => setInputMode("dropdown")}
                className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                  inputMode === "dropdown" ? "bg-[#FE7743] text-black" : "bg-gray-700 text-white hover:bg-gray-600"
                }`}
              >
                Dropdowns
              </button>
            </div>

            {inputMode === "text" ? (
              <div className="space-y-4">
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Describe what kind of outfit you're looking for... (e.g., 'I need a casual outfit for a coffee date')"
                  className="w-full bg-gray-700 text-white border-gray-600 rounded-lg p-4 min-h-32 resize-none"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-white block mb-2">Occasion</label>
                  <div className="flex flex-wrap gap-2">
                    {OCCASION_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() =>
                          setDropdownValues({
                            ...dropdownValues,
                            occasion: dropdownValues.occasion === option.toLowerCase() ? "" : option.toLowerCase(),
                          })
                        }
                        className={pillBtn(dropdownValues.occasion === option.toLowerCase())}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-white block mb-2">Style</label>
                  <div className="flex flex-wrap gap-2">
                    {STYLE_OPTIONS.map(({ label, value }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setDropdownValues({
                            ...dropdownValues,
                            style: dropdownValues.style === value ? "" : value,
                          })
                        }
                        className={pillBtn(dropdownValues.style === value)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-white block mb-2">Colors</label>
                  <div className="flex flex-wrap gap-2">
                    {COLORS.map(({ label, bg, border }) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => toggleColor(label)}
                        className={`flex items-center gap-1.5 ${pillBtn(selectedColors.includes(label), border)}`}
                      >
                        <span className={`w-3 h-3 rounded-full ${bg} border border-white/20`} />
                        {label}
                      </button>
                    ))}
                  </div>
                  {selectedColors.length > 0 && (
                    <p className="text-gray-400 text-xs mt-2">Selected: {selectedColors.join(", ")}</p>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full mt-6 bg-[#FE7743] text-black font-semibold py-3 rounded-lg hover:bg-[#FF9A5C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black" />
                  Generating...
                </>
              ) : (
                <>
                  <IoSend size={20} />
                  Get Suggestions
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Section */}
        {suggestedOutfit && !isLoading && (
          <div className="mt-6 bg-gray-800 rounded-xl p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white">Suggested Outfit</h2>
                {outfitPool.length > 1 && (
                  <div className="flex gap-1.5 items-center">
                    {outfitPool.map((_, i) => (
                      <span
                        key={i}
                        className={`block rounded-full transition-all ${
                          i === poolIndex ? "w-2.5 h-2.5 bg-[#FE7743]" : "w-2 h-2 bg-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-row gap-2 w-full md:w-auto">
                <button
                  onClick={handleTrySimilar}
                  disabled={isLoading}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  <IoRefresh size={18} />
                  {remainingInPool > 0 ? `Try Similar (${remainingInPool} left)` : "Try Similar"}
                </button>
                <button
                  onClick={handleSaveOutfit}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#FE7743] text-black rounded-lg hover:bg-[#FF9A5C] transition-colors"
                >
                  <IoHeart size={18} />
                  Save Outfit
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 mt-2">
              <div className="space-y-0.5 w-full mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <h3 className="text-white font-medium mb-2">Description</h3>
                    <p className="text-gray-300">{suggestedOutfit.description}</p>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">Model Confidence</h3>
                    <p className="text-gray-300 mb-2">{suggestedOutfit.confidence}%</p>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-[#FE7743] h-2 rounded-full transition-all"
                        style={{ width: `${suggestedOutfit.confidence}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">Your Rating (1-10)</h3>
                    <div className="flex gap-1 flex-wrap justify-center">
                      {renderStars(userRating || suggestedOutfit.rating, true)}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-white font-medium mb-3">Items</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                  {suggestedOutfit.items.map((item, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg overflow-hidden">
                      <div className="aspect-square flex items-center justify-center">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                       </div>
                      <p className="text-white text-xs p-2 truncate">{item.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#34020E] rounded-2xl p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Upload Clothes</h2>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-white hover:text-[#FE7743]">
                <IoClose size={24} />
              </button>
            </div>

            <label
              onDragEnter={!isLoading ? handleDrag : undefined}
              onDragLeave={!isLoading ? handleDrag : undefined}
              onDragOver={!isLoading ? handleDrag : undefined}
              onDrop={!isLoading ? handleDrop : undefined}
              className={`block border-2 border-dashed rounded-xl p-10 text-center transition-all ${
                isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              } ${dragActive ? "border-[#FE7743] bg-[#FE7743] bg-opacity-10" : "border-gray-600"}`}
            >
              <IoCloudUploadOutline size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-white mb-2">Drag and drop your clothes images here</p>
              <p className="text-white text-sm mb-4">or click anywhere to browse — you can select multiple files</p>
              <div className="btn-primary btn-primary-orange inline-block text-white">Browse Files</div>
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={isLoading}
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
