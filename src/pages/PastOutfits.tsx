import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { outfitApi } from "../services/outfitApi";
import { wardrobeApi } from "../services/wardrobeApi";
import Menu from "../components/Menu";
import {
  IoSearch,
  IoArrowBack,
  IoHeart,
  IoHeartOutline,
  IoShareSocial,
  IoDownload,
  IoClose,
  IoChatbubble,
  IoTrash,
} from "react-icons/io5";
import Swal from "sweetalert2";

interface OutfitItem {
  id: string;
  date: string;
  rating: number;
  items: {
    name: string;
    image: string;
  }[];
  caption: string;
  isFavorited: boolean;
}

export default function PastOutfits() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [selectedOutfit, setSelectedOutfit] = useState<OutfitItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingCaption, setEditingCaption] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  // Mock data for demo
  const [outfits, setOutfits] = useState<OutfitItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const [historyData, wardrobeData] = await Promise.all([
          outfitApi.getHistory(),
          wardrobeApi.getWardrobe()
        ]);
        
        // Create a map for quick garment lookup
        const garmentMap = wardrobeData.reduce((acc: any, item: any) => {
          acc[item.id] = { name: item.name, image: item.image_base64 };
          return acc;
        }, {});

        const mappedOutfits = historyData.map((outfit: any) => ({
          id: outfit.id,
          date: new Date(outfit.created_at).toISOString().split('T')[0],
          rating: outfit.rating || 0,
          items: outfit.garment_ids.map((id: string) => garmentMap[id] || { name: "Unknown Item", image: "" }),
          caption: outfit.prompt,
          isFavorited: outfit.is_favorite
        }));

        setOutfits(mappedOutfits);
      } catch (err) {
        console.error("Failed to load outfit history", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredOutfits = outfits.filter((outfit) => {
    const matchesSearch =
      outfit.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      outfit.items.some((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesDate =
      dateFilter === "all" ||
      (dateFilter === "recent" &&
        new Date(outfit.date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) ||
      (dateFilter === "month" &&
        new Date(outfit.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

    const matchesRating =
      ratingFilter === "all" ||
      (ratingFilter === "high" && outfit.rating >= 4) ||
      (ratingFilter === "medium" && outfit.rating >= 3 && outfit.rating < 4) ||
      (ratingFilter === "low" && outfit.rating < 3);

    return matchesSearch && matchesDate && matchesRating;
  });

  const handleOutfitClick = (outfit: OutfitItem) => {
    setSelectedOutfit(outfit);
    setEditingCaption(outfit.caption);
    setIsDetailModalOpen(true);
  };

  const handleToggleFavorite = (outfitId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOutfits(
      outfits.map((outfit) =>
        outfit.id === outfitId
          ? { ...outfit, isFavorited: !outfit.isFavorited }
          : outfit,
      ),
    );
  };

  const handleSaveCaption = () => {
    if (selectedOutfit) {
      setOutfits(
        outfits.map((outfit) =>
          outfit.id === selectedOutfit.id
            ? { ...outfit, caption: editingCaption }
            : outfit,
        ),
      );
      setSelectedOutfit({ ...selectedOutfit, caption: editingCaption });
    }
  };

  const handleRatingClick = (rating: number) => {
    if (selectedOutfit) {
      setOutfits(
        outfits.map((outfit) =>
          outfit.id === selectedOutfit.id
            ? { ...outfit, rating }
            : outfit,
        ),
      );
      setSelectedOutfit({ ...selectedOutfit, rating });
    }
  };

  const handleDisfavorOutfit = async () => {
    if (selectedOutfit) {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This will remove the outfit from your favorites and history.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#FE7743",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, remove it!",
        background: "#34020E",
        color: "#fff",
      });

      if (result.isConfirmed) {
        setOutfits(outfits.filter((outfit) => outfit.id !== selectedOutfit.id));
        setIsDetailModalOpen(false);
        setSelectedOutfit(null);
        Swal.fire({
          title: "Removed!",
          text: "The outfit has been removed.",
          icon: "success",
          background: "#34020E",
          color: "#fff",
        });
      }
    }
  };

  const handleShareLink = () => {
    if (selectedOutfit) {
      // Demo: copy a fake link
      const fakeLink = `https://yourapp.com/outfit/${selectedOutfit.id}`;
      navigator.clipboard.writeText(fakeLink);
      Swal.fire({
        title: "Link Copied!",
        text: "Share link has been copied to clipboard.",
        icon: "success",
        background: "#34020E",
        color: "#fff",
      });
    }
  };

  const handleDownloadImage = () => {
    if (selectedOutfit) {
      // Demo: show a message that download would happen
      Swal.fire({
        title: "Download Started",
        text: "Your outfit image is being downloaded.",
        icon: "success",
        background: "#34020E",
        color: "#fff",
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-600"}>
        ★
      </span>
    ));
  };

  const renderInteractiveStars = (rating: number, isInteractive: boolean = false) => {
    const displayRating = isInteractive ? hoverRating || rating : rating;
    
    return Array.from({ length: 5 }).map((_, i) => (
      <button
        key={i}
        type="button"
        disabled={!isInteractive}
        onClick={() => isInteractive && handleRatingClick(i + 1)}
        onMouseEnter={() => isInteractive && setHoverRating(i + 1)}
        onMouseLeave={() => isInteractive && setHoverRating(0)}
        className={`
          text-3xl transition-all duration-200 transform
          ${i < displayRating ? 'text-yellow-400 scale-125' : 'text-gray-600 scale-100'}
          ${isInteractive ? 'hover:scale-150 cursor-pointer' : 'cursor-default'}
          ${isInteractive && i < displayRating ? 'animate-star-pop' : ''}
        `}
        style={{
          textShadow: i < displayRating ? '0 0 10px rgba(250, 204, 21, 0.5)' : 'none',
        }}
      >
        ★
      </button>
    ));
  };

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

        <h1 className="text-3xl font-bold text-white mb-6">Past Outfit Reviews</h1>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-3 mb-6 py-2 justify-between">
          <div className="relative w-full sm:flex-1 py-2 sm:py-1 sm:max-w-50">
            <IoSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search by caption or item name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-idle pl-10 bg-gray-800 text-white border-gray-600 rounded-md w-full sm:min-w-65 sm:text-sm py-2 text-base sm:py-1"
            />
          </div>

          <div className="flex items-center gap-2 flex-nowrap justify-between">
            <div className="relative sm:justify-between flex mr-4 bg-gray-800 px-2 min-w-40 sm:max-w-50 rounded-md">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="appearance-none input input-idle bg-gray-800 text-white border-gray-600 rounded-md py-1 pl-2 focus:outline-none focus:ring-0 focus:border-gray-600"
              >
                <option value="all">All Time</option>
                <option value="recent">Last 30 Days</option>
                <option value="month">Last 7 Days</option>
              </select>
            </div>

            <div className="relative sm:justify-between flex mr-4 bg-gray-800 px-2 min-w-40 sm:max-w-50 rounded-md">
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="appearance-none input input-idle bg-gray-800 text-white border-gray-600 rounded-md py-1 pl-2 focus:outline-none focus:ring-0 focus:border-gray-600"
              >
                <option value="all">All Ratings</option>
                <option value="high">4+ Stars</option>
                <option value="medium">3-4 Stars</option>
                <option value="low">Below 3 Stars</option>
              </select>
            </div>
          </div>
        </div>

        {/* Outfits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOutfits.map((outfit) => (
            <div
              key={outfit.id}
              onClick={() => handleOutfitClick(outfit)}
              className="bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#FE7743] transition-all"
            >
              <div className="grid grid-cols-3 gap-1 p-2 bg-gray-700">
                {outfit.items.slice(0, 3).map((item, index) => (
                  <div key={index} className="aspect-square bg-gray-600 rounded-lg overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {outfit.items.length > 3 && (
                  <div className="aspect-square bg-gray-600 rounded-lg flex items-center justify-center text-white text-sm">
                    +{outfit.items.length - 3}
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-gray-400 text-xs">{outfit.date}</p>
                  <div className="flex gap-1">{renderStars(outfit.rating)}</div>
                </div>
                <p className="text-white text-sm mb-3 line-clamp-2">
                  {outfit.caption}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {outfit.items.length} items
                  </span>
                  <button
                    onClick={(e) => handleToggleFavorite(outfit.id, e)}
                    className={`${
                      outfit.isFavorited ? "text-red-500" : "text-gray-400"
                    } hover:text-red-500 transition-colors`}
                  >
                    {outfit.isFavorited ? (
                      <IoHeart size={20} />
                    ) : (
                      <IoHeartOutline size={20} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOutfits.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No outfits found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedOutfit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#34020E] rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Outfit Details</h2>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-white hover:text-[#FE7743]"
              >
                <IoClose size={24} />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Outfit Items */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Items</h3>
                <div className="grid grid-cols-2 gap-3">
                  {selectedOutfit.items.map((item, index) => (
                    <div key={index} className="bg-gray-800 rounded-lg overflow-hidden">
                      <div className="aspect-square bg-gray-700">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-white text-xs p-2 truncate">{item.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Details and Actions */}
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm block mb-1">Date</label>
                  <p className="text-white">{selectedOutfit.date}</p>
                </div>

                <div>
                  <label className="text-gray-400 text-sm block mb-1">Rating (click to edit)</label>
                  <div className="flex gap-2">
                    {renderInteractiveStars(selectedOutfit.rating, true)}
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 text-sm block mb-1">
                    <IoChatbubble className="inline mr-1" />
                    Caption
                  </label>
                  <textarea
                    value={editingCaption}
                    onChange={(e) => setEditingCaption(e.target.value)}
                    onBlur={handleSaveCaption}
                    className="w-full bg-gray-800 text-white border-gray-600 rounded-md p-3 min-h-24 resize-none"
                    placeholder="Add a caption..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleDisfavorOutfit}
                    className="btn-primary bg-red-600 hover:bg-red-700 text-white flex-1"
                  >
                    <IoTrash size={20} className="inline mr-2" />
                    Remove
                  </button>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <label className="text-gray-400 text-sm block mb-3">Export Options</label>
                  <div className="flex gap-3">
                    <button
                      onClick={handleShareLink}
                      className="flex-1 bg-gray-800 hover:bg-gray-700 text-white rounded-lg py-3 flex items-center justify-center gap-2 transition-colors"
                    >
                      <IoShareSocial size={20} />
                      Share Link
                    </button>
                    <button
                      onClick={handleDownloadImage}
                      className="flex-1 bg-gray-800 hover:bg-gray-700 text-white rounded-lg py-3 flex items-center justify-center gap-2 transition-colors"
                    >
                      <IoDownload size={20} />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
