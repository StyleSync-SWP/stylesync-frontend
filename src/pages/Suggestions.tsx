import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { wardrobeApi } from "../services/wardrobeApi";
import { outfitApi } from "../services/outfitApi";
import Menu from "../components/Menu";
import {
  IoAdd,
  IoCloudUploadOutline,
  IoClose,
  IoChatbubble,
  IoSend,
  IoRefresh,
  IoHeart,
  IoArrowBack,
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
  id: string | null;
  garmentIds: string[];
  items: ClothingItem[];
  description: string;
  rating: number;
  confidence: number;
  savedToHistory: boolean;
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

const VARIATION_SUFFIX = " Give me a different variation.";

const stripVariationSuffix = (prompt: string) =>
  prompt.replace(/(?: Give me a different variation\.)+$/g, "");

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
    weather: "",
  });
  const [suggestedOutfit, setSuggestedOutfit] =
    useState<SuggestedOutfit | null>(null);
  const [allSuggestedOutfits, setAllSuggestedOutfits] = useState<
    SuggestedOutfit[]
  >([]);
  const [currentOutfitIndex, setCurrentOutfitIndex] = useState(0);
  const [originalQuery, setOriginalQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [favoritedOutfits, setFavoritedOutfits] = useState<Set<string>>(new Set());

  const convertApiOutfits = (
    outfits: any[],
    displayPrompt: string,
  ): SuggestedOutfit[] =>
    outfits
      .map((outfit: any) => {
        const garmentIds: string[] = outfit.garment_ids || [];
        const items = garmentIds
          .map((id: string) => wardrobeItems.find((w) => w.id === id))
          .filter(Boolean) as ClothingItem[];

        return {
          id: outfit.id ?? null,
          garmentIds,
          items,
          description: displayPrompt,
          rating: outfit.rating || 0,
          confidence: 95,
          savedToHistory: false,
        };
      })
      .filter((outfit) => outfit.items.length > 0);

  const saveOutfitToHistory = async (
    outfit: SuggestedOutfit,
  ): Promise<SuggestedOutfit> => {
    if (outfit.savedToHistory && outfit.id) return outfit;
    const saved = await outfitApi.saveOutfit(
      outfit.description,
      outfit.garmentIds,
    );
    return { ...outfit, id: saved.id, savedToHistory: true };
  };

  const applyOutfitBatch = async (convertedOutfits: SuggestedOutfit[]) => {
    const savedFirst = await saveOutfitToHistory(convertedOutfits[0]);
    const allOutfits = [savedFirst, ...convertedOutfits.slice(1)];
    setAllSuggestedOutfits(allOutfits);
    setCurrentOutfitIndex(0);
    setSuggestedOutfit(savedFirst);
  };

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

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const colorPart =
        selectedColors.length > 0
          ? ` Preferred colors: ${selectedColors.join(", ")}.`
          : "";

      let query = "";
      if (inputMode === "text") {
        query = textInput ? `${textInput}${colorPart}` : "";
      } else {
        query = `A ${dropdownValues.style} outfit for ${dropdownValues.occasion} in ${dropdownValues.weather} weather.${colorPart}`;
      }

      const response = await outfitApi.suggestOutfit(query);
      setOriginalQuery(query);

      const outfits = Array.isArray(response) ? response : [response];

      if (!outfits || outfits.length === 0) {
        console.error("No outfit returned from backend");
        setIsLoading(false);
        return;
      }

      const convertedOutfits = convertApiOutfits(outfits, query);

      if (convertedOutfits.length === 0) {
        console.error("No valid outfits with matching items");
        setIsLoading(false);
        return;
      }

      await applyOutfitBatch(convertedOutfits);

      // Clear both inputs after submission
      setTextInput("");
      setDropdownValues({ occasion: "", style: "", weather: "" });
      setSelectedColors([]);
    } catch (err) {
      console.error("Failed to get suggestion", err);
    }
    setIsLoading(false);
    setUserRating(0);
  };

  const handleTrySimilar = async () => {
    if (!suggestedOutfit || allSuggestedOutfits.length === 0) return;

    if (currentOutfitIndex < allSuggestedOutfits.length - 1) {
      try {
        const nextIndex = currentOutfitIndex + 1;
        const saved = await saveOutfitToHistory(allSuggestedOutfits[nextIndex]);
        const updated = [...allSuggestedOutfits];
        updated[nextIndex] = saved;
        setAllSuggestedOutfits(updated);
        setCurrentOutfitIndex(nextIndex);
        setSuggestedOutfit(saved);
        setUserRating(0);
      } catch (err) {
        console.error("Failed to save outfit to history", err);
      }
    } else {
      setIsLoading(true);
      try {
        const baseQuery = originalQuery || stripVariationSuffix(suggestedOutfit.description);
        const variationQuery = `${baseQuery}${VARIATION_SUFFIX}`;
        const response = await outfitApi.suggestOutfit(variationQuery);

        const outfits = Array.isArray(response) ? response : [response];

        if (!outfits || outfits.length === 0) {
          console.error("No outfit returned from backend");
          setIsLoading(false);
          return;
        }

        const convertedOutfits = convertApiOutfits(outfits, baseQuery);

        if (convertedOutfits.length === 0) {
          console.error("No valid outfits with matching items");
          setIsLoading(false);
          return;
        }

        await applyOutfitBatch(convertedOutfits);
      } catch (err) {
        console.error("Failed to get similar suggestion", err);
      }
      setIsLoading(false);
      setUserRating(0);
    }
  };

  const handleSaveOutfit = async () => {
    if (!suggestedOutfit) return;

    try {
      const saved = await saveOutfitToHistory(suggestedOutfit);
      if (saved.id !== suggestedOutfit.id || !saved.savedToHistory) {
        const updated = [...allSuggestedOutfits];
        updated[currentOutfitIndex] = saved;
        setAllSuggestedOutfits(updated);
        setSuggestedOutfit(saved);
      }

      await outfitApi.rateOutfit(saved.id!, { is_favorite: true });

      setFavoritedOutfits((prev) => new Set(prev).add(saved.id!));

      Swal.fire({
        title: "Outfit Saved!",
        text: "This outfit has been saved as a favourite outfit.",
        icon: "success",
        background: "#34020E",
        color: "#fff",
        confirmButtonColor: "#C4A265",
      });
    } catch (err) {
      console.error("Failed to save outfit as favorite", err);
      Swal.fire({
        title: "Error",
        text: "Failed to save outfit as favorite.",
        icon: "error",
        background: "#34020E",
        color: "#fff",
        confirmButtonColor: "#C4A265",
      });
    }
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

  const pillBtn = (
    active: boolean,
    border = "border-[rgba(196,162,101,0.14)]",
  ) =>
    `px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all text-[#F5EDE3] ${
      active
        ? "border-[#C4A265] bg-[#C4A265] text-[#1a0508] scale-105"
        : `${border} opacity-70 hover:opacity-100 hover:border-[rgba(196,162,101,0.35)]`
    }`;

  return (
    <div className="bg-[#0f0204] min-h-dvh">
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
              Outfit Suggestions
            </h1>
          </div>
        </div>
        <div className="h-px bg-[rgba(196,162,101,0.09)] mb-8"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[18px]">
          {/* Section 1: Clothes Selection */}
          <div className="bg-[#1a0508] border border-[rgba(196,162,101,0.14)] rounded-xl p-6">
            <h2 className="font-serif text-xl text-[#F5EDE3] font-medium mb-4">
              Select Your Clothes
            </h2>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#C4A265] text-[#1a0508] rounded-lg hover:bg-[rgba(196,162,101,0.8)] transition-colors font-semibold text-sm"
              >
                <IoAdd size={20} />
                Upload New
              </button>
              <span className="text-[rgba(245,237,227,0.4)] text-sm self-center">
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
                      ? "ring-2 ring-[#C4A265]"
                      : "hover:ring-2 hover:ring-[rgba(196,162,101,0.35)]"
                  }`}
                >
                  <div className="aspect-square bg-[#2a0a10]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {selectedClothes.find((c) => c.id === item.id) && (
                    <div className="absolute top-2 right-2 bg-[#C4A265] rounded-full p-1">
                      <IoHeart size={16} className="text-[#1a0508]" />
                    </div>
                  )}
                  <div className="p-2">
                    <p className="text-[#F5EDE3] text-xs truncate">
                      {item.name}
                    </p>
                    <p className="text-[rgba(245,237,227,0.4)] text-xs">
                      {item.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {selectedClothes.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[rgba(196,162,101,0.12)]">
                <h3 className="text-[#F5EDE3] text-sm font-medium mb-2">
                  Selected Items:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedClothes.map((item) => (
                    <span
                      key={item.id}
                      className="text-xs bg-[#34020E] text-[#F5EDE3] px-2 py-1 rounded"
                    >
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Input Section */}
          <div className="bg-[#1a0508] border border-[rgba(196,162,101,0.14)] rounded-xl p-6">
            <h2 className="font-serif text-xl text-[#F5EDE3] font-medium mb-4">
              Provide Your Preferences
            </h2>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setInputMode("text")}
                className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                  inputMode === "text"
                    ? "bg-[#C4A265] text-[#1a0508]"
                    : "bg-[#0f0204] text-[#F5EDE3] border border-[rgba(196,162,101,0.14)] hover:border-[rgba(196,162,101,0.35)]"
                }`}
              >
                <IoChatbubble className="inline mr-2" />
                Chat Input
              </button>
              <button
                onClick={() => setInputMode("dropdown")}
                className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                  inputMode === "dropdown"
                    ? "bg-[#C4A265] text-[#1a0508]"
                    : "bg-[#0f0204] text-[#F5EDE3] border border-[rgba(196,162,101,0.14)] hover:border-[rgba(196,162,101,0.35)]"
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
                  className="w-full bg-[#0f0204] text-[#F5EDE3] border border-[rgba(196,162,101,0.14)] rounded-lg p-4 min-h-32 resize-none focus:outline-none focus:border-[rgba(196,162,101,0.4)]"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-[#F5EDE3] block mb-2 text-sm">
                    Occasion
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Casual",
                      "Formal",
                      "Business",
                      "Date Night",
                      "Party",
                      "Outdoor",
                    ].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() =>
                          setDropdownValues({
                            ...dropdownValues,
                            occasion:
                              dropdownValues.occasion === option.toLowerCase()
                                ? ""
                                : option.toLowerCase(),
                          })
                        }
                        className={pillBtn(
                          dropdownValues.occasion === option.toLowerCase(),
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[#F5EDE3] block mb-2 text-sm">
                    Style
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Minimalist",
                      "Bold & Trendy",
                      "Classic",
                      "Bohemian",
                      "Sporty",
                      "Elegant",
                    ].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() =>
                          setDropdownValues({
                            ...dropdownValues,
                            style:
                              dropdownValues.style === option.toLowerCase()
                                ? ""
                                : option.toLowerCase(),
                          })
                        }
                        className={pillBtn(
                          dropdownValues.style === option.toLowerCase(),
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[#F5EDE3] block mb-2 text-sm">
                    Weather
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["Hot", "Warm", "Cool", "Cold", "Rainy"].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() =>
                          setDropdownValues({
                            ...dropdownValues,
                            weather:
                              dropdownValues.weather === option.toLowerCase()
                                ? ""
                                : option.toLowerCase(),
                          })
                        }
                        className={pillBtn(
                          dropdownValues.weather === option.toLowerCase(),
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[#F5EDE3] block mb-2 text-sm">
                    Colors
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COLORS.map(({ label, bg, border }) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => toggleColor(label)}
                        className={`flex items-center gap-1.5 ${pillBtn(selectedColors.includes(label), border)}`}
                      >
                        <span
                          className={`w-3 h-3 rounded-full ${bg} border border-white/20`}
                        />
                        {label}
                      </button>
                    ))}
                  </div>
                  {selectedColors.length > 0 && (
                    <p className="text-[rgba(245,237,227,0.4)] text-xs mt-2">
                      Selected: {selectedColors.join(", ")}
                    </p>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full mt-6 bg-[#C4A265] text-[#1a0508] font-semibold py-3 rounded-lg hover:bg-[rgba(196,162,101,0.8)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#1a0508]" />
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
          <div className="mt-8 bg-[#1a0508] border border-[rgba(196,162,101,0.14)] rounded-xl p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <h2 className="font-serif text-xl text-[#F5EDE3] font-medium text-center md:text-left w-full md:w-auto">
                Suggested Outfit
              </h2>
              <div className="flex flex-row md:flex-row gap-2 w-full md:w-auto">
                <button
                  onClick={handleTrySimilar}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#0f0204] border border-[rgba(196,162,101,0.14)] text-[#F5EDE3] rounded-lg hover:border-[rgba(196,162,101,0.35)] transition-colors"
                >
                  <IoRefresh size={18} />
                  Try Similar
                </button>
                <button
                  onClick={handleSaveOutfit}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#C4A265] text-[#1a0508] rounded-lg hover:bg-[rgba(196,162,101,0.8)] transition-colors"
                >
                  <IoHeart size={18} />
                  Add to favourites
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 mt-2">
              <div className="space-y-0.5 w-full mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                  <div>
                    <h3 className="text-[#F5EDE3] font-medium mb-2">
                      Description
                    </h3>
                    <p className="text-[rgba(245,237,227,0.6)]">
                      {suggestedOutfit.description}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-[#F5EDE3] font-medium mb-2">
                      Your Rating (1-10)
                    </h3>
                    <div className="flex gap-1 flex-wrap justify-center">
                      {renderStars(userRating || suggestedOutfit.rating, true)}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[#F5EDE3] font-medium mb-3">Items</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                  {suggestedOutfit.items.map((item, index) => (
                    <div
                      key={index}
                      className="bg-[#0f0204] border border-[rgba(196,162,101,0.08)] rounded-lg overflow-hidden"
                    >
                      <div className="aspect-square bg-[#2a0a10]">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-[#F5EDE3] text-xs p-2 truncate">
                        {item.name}
                      </p>
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
          <div className="bg-[#1a0508] border border-[rgba(196,162,101,0.14)] rounded-2xl p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl text-[#F5EDE3] font-medium">
                Upload Clothes
              </h2>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-[rgba(245,237,227,0.5)] hover:text-[#C4A265] transition-colors"
              >
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
              } ${dragActive ? "border-[#C4A265] bg-[rgba(196,162,101,0.1)]" : "border-[rgba(196,162,101,0.14)]"}`}
            >
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
          </div>
        </div>
      )}
    </div>
  );
}
