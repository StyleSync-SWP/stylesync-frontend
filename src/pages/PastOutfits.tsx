import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { outfitApi } from "../services/outfitApi";
import { wardrobeApi } from "../services/wardrobeApi";
import Menu from "../components/Menu";
import LoadingOverlay from "../components/LoadingOverlay";
import {
  IoShareSocial,
  IoDownload,
  IoClose,
  IoChatbubble,
  IoTrash,
  IoArrowBack,
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

type ThumbnailItem = { name: string; image: string };

// Given a max number of grid slots, show as many items as fit; once the
// outfit has more items than slots, show one fewer image and turn the last
// slot into a "+N" overlay for the rest.
function getVisibleThumbnails(
  items: ThumbnailItem[],
  maxSlots: number,
): { visible: ThumbnailItem[]; overflow: number } {
  if (items.length <= maxSlots) {
    return { visible: items, overflow: 0 };
  }
  const visibleCount = maxSlots - 1;
  return {
    visible: items.slice(0, visibleCount),
    overflow: items.length - visibleCount,
  };
}

function OutfitThumbnails({ items }: { items: ThumbnailItem[] }) {
  const mobile = getVisibleThumbnails(items, 4);
  const desktop = getVisibleThumbnails(items, 6);

  return (
    <>
      {/* Mobile: 2x2 grid, 4 slots total */}
      <div className="grid grid-cols-2 gap-0.5 p-0.5 bg-[#0f0204] sm:hidden">
        {mobile.visible.map((item, index) => (
          <div
            key={index}
            className="aspect-square bg-[#2a0a10] rounded overflow-hidden"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {mobile.overflow > 0 && (
          <div className="aspect-square bg-[#34020E] rounded flex items-center justify-center text-[rgba(196,162,101,0.3)] text-xs">
            +{mobile.overflow}
          </div>
        )}
      </div>

      {/* Bigger screens: 3-col grid, 6 slots total */}
      <div className="hidden sm:grid grid-cols-3 gap-0.5 p-0.5 bg-[#0f0204]">
        {desktop.visible.map((item, index) => (
          <div
            key={index}
            className="aspect-square bg-[#2a0a10] rounded overflow-hidden"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {desktop.overflow > 0 && (
          <div className="aspect-square bg-[#34020E] rounded flex items-center justify-center text-[rgba(196,162,101,0.3)] text-xs">
            +{desktop.overflow}
          </div>
        )}
      </div>
    </>
  );
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
  const [selectedForDeletion, setSelectedForDeletion] = useState<Set<string>>(new Set());

  // Mock data for demo
  const [outfits, setOutfits] = useState<OutfitItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const [historyData, wardrobeData] = await Promise.all([
          outfitApi.getHistory(),
          wardrobeApi.getWardrobe(),
        ]);

        // Create a map for quick garment lookup
        const garmentMap = wardrobeData.reduce((acc: any, item: any) => {
          acc[item.id] = { name: item.name, image: item.image_base64 };
          return acc;
        }, {});

        const mappedOutfits = historyData.map((outfit: any) => ({
          id: outfit.id,
          date: new Date(outfit.created_at).toISOString().split("T")[0],
          rating: outfit.rating || 0,
          items: outfit.garment_ids.map(
            (id: string) =>
              garmentMap[id] || { name: "Unknown Item", image: "" },
          ),
          caption: outfit.prompt,
          isFavorited: outfit.is_favorite,
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
        new Date(outfit.date) >=
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) ||
      (dateFilter === "month" &&
        new Date(outfit.date) >=
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

    const matchesRating =
      ratingFilter === "all" ||
      (ratingFilter === "favorites" && outfit.isFavorited) ||
      (ratingFilter === "5" && outfit.rating == 5) ||
      (ratingFilter === "4" && outfit.rating == 4) ||
      (ratingFilter === "3" && outfit.rating == 3) ||
      (ratingFilter === "2" && outfit.rating == 2) ||
      (ratingFilter === "1" && outfit.rating == 1);

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
          outfit.id === selectedOutfit.id ? { ...outfit, rating } : outfit,
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
        try {
          setIsDeleting(true);
          await outfitApi.deleteOutfit(selectedOutfit.id);
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
        } catch (err) {
          console.error("Failed to delete outfit", err);
          Swal.fire({
            title: "Error",
            text: "Failed to remove the outfit.",
            icon: "error",
            background: "#34020E",
            color: "#fff",
          });
        } finally {
          setIsDeleting(false);
        }
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedForDeletion.size === 0) return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `This will remove ${selectedForDeletion.size} outfit(s) from your history.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#C4A265",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete them!",
      background: "#34020E",
      color: "#fff",
    });

    if (result.isConfirmed) {
      try {
        setIsDeleting(true);
        for (const id of selectedForDeletion) {
          await outfitApi.deleteOutfit(id);
        }
        setOutfits(outfits.filter((outfit) => !selectedForDeletion.has(outfit.id)));
        setSelectedForDeletion(new Set());
        Swal.fire({
          title: "Deleted!",
          text: "The selected outfits have been removed.",
          icon: "success",
          background: "#34020E",
          color: "#fff",
          confirmButtonColor: "#C4A265",
        });
      } catch (err) {
        console.error("Failed to delete outfits", err);
        Swal.fire({
          title: "Error",
          text: "Failed to delete one or more outfits.",
          icon: "error",
          background: "#34020E",
          color: "#fff",
          confirmButtonColor: "#C4A265",
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleCleanAll = async () => {
    if (outfits.length === 0) return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete ALL outfits from your history. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#C4A265",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete all!",
      background: "#34020E",
      color: "#fff",
    });

    if (result.isConfirmed) {
      try {
        setIsDeleting(true);
        for (const outfit of outfits) {
          await outfitApi.deleteOutfit(outfit.id);
        }
        setOutfits([]);
        setSelectedForDeletion(new Set());
        Swal.fire({
          title: "Cleared!",
          text: "All outfits have been removed from your history.",
          icon: "success",
          background: "#34020E",
          color: "#fff",
          confirmButtonColor: "#C4A265",
        });
      } catch (err) {
        console.error("Failed to clean history", err);
        Swal.fire({
          title: "Error",
          text: "Failed to clean history.",
          icon: "error",
          background: "#34020E",
          color: "#fff",
          confirmButtonColor: "#C4A265",
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedForDeletion(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
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
      <span
        key={i}
        className={i < rating ? "text-yellow-400" : "text-gray-600"}
      >
        ★
      </span>
    ));
  };

  const renderInteractiveStars = (
    rating: number,
    isInteractive: boolean = false,
  ) => {
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
          ${i < displayRating ? "text-yellow-400 scale-125" : "text-gray-600 scale-100"}
          ${isInteractive ? "hover:scale-150 cursor-pointer" : "cursor-default"}
          ${isInteractive && i < displayRating ? "animate-star-pop" : ""}
        `}
        style={{
          textShadow:
            i < displayRating ? "0 0 10px rgba(250, 204, 21, 0.5)" : "none",
        }}
      >
        ★
      </button>
    ));
  };

  return (
    <div className="bg-[#0f0204] min-h-dvh">
      <Menu />

      <div className="px-10 py-10 max-w-[1360px] mx-auto">
        {/* Page header + search */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 sm:gap-0 mb-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-[rgba(245,237,227,0.4)] hover:text-[#C4A265] transition-colors"
            >
              <IoArrowBack size={24} />
            </button>
            <h1 className="font-serif text-3xl md:text-[36px] text-[#F5EDE3] font-medium">
              Past Outfits
            </h1>
          </div>
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search outfits…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#1a0508] border border-[rgba(196,162,101,0.14)] text-[#F5EDE3] px-4 py-2.5 pl-10 text-sm font-light w-full sm:w-[220px] focus:outline-none focus:border-[rgba(196,162,101,0.4)]"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[rgba(196,162,101,0.4)] text-sm">
                ⌕
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full bg-[#1a0508] border border-[rgba(196,162,101,0.14)] text-[rgba(245,237,227,0.55)] px-4 py-2.5 pl-3.5 text-xs font-light cursor-pointer focus:outline-none focus:border-[rgba(196,162,101,0.4)]"
              >
                <option value="all">All time</option>
                <option value="recent">Last 30 days</option>
                <option value="month">Last 7 days</option>
              </select>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="w-full bg-[#1a0508] border border-[rgba(196,162,101,0.14)] text-[rgba(245,237,227,0.55)] px-4 py-2.5 pl-3.5 text-xs font-light cursor-pointer focus:outline-none focus:border-[rgba(196,162,101,0.4)]"
              >
                <option value="all">All</option>
                <option value="favorites">Favorites</option>
                <option value="5">5 stars</option>
                <option value="4">4 stars</option>
                <option value="3">3 stars</option>
                <option value="2">2 stars</option>
                <option value="1">1 star</option>
              </select>
            </div>
            {selectedForDeletion.size > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="bg-[#1a0508] text-[#F5EDE3] px-4 py-2.5 font-medium text-sm hover:bg-[#34020E] transition-colors border border-[rgba(196,162,101,0.14)]"
              >
                Delete Selected ({selectedForDeletion.size})
              </button>
            )}
            <button
              onClick={handleCleanAll}
              className="bg-[#1a0508] text-[#F5EDE3] px-4 py-2.5 font-medium text-sm hover:bg-[#34020E] transition-colors border border-[rgba(196,162,101,0.14)]"
            >
              Clean All
            </button>
          </div>
        </div>
        <div className="h-px bg-[rgba(196,162,101,0.09)] mb-8"></div>

        {/* Outfits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[18px]">
          {filteredOutfits.map((outfit) => (
            <div
              key={outfit.id}
              className="bg-[#1a0508] border border-[rgba(196,162,101,0.14)] rounded-xl overflow-hidden cursor-pointer hover:border-[rgba(196,162,101,0.35)] transition-all relative"
            >
              {/* Selection checkbox */}
              <div
                className="absolute top-3 right-3 z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSelection(outfit.id);
                }}
              >
                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                  selectedForDeletion.has(outfit.id)
                    ? 'bg-[#C4A265] border-[#C4A265]'
                    : 'border-[rgba(196,162,101,0.3)] bg-[#1a0508]'
                }`}>
                  {selectedForDeletion.has(outfit.id) && (
                    <div className="w-3 h-3 bg-[#1a0508] rounded-sm" />
                  )}
                </div>
              </div>

              <div onClick={() => handleOutfitClick(outfit)}>
                <OutfitThumbnails items={outfit.items} />
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2.5">
                    <p className="text-[rgba(245,237,227,0.28)] text-xs">
                      {outfit.date}
                    </p>
                    <span className="text-[#C4A265] text-xs tracking-widest">
                      {renderStars(outfit.rating)}
                    </span>
                  </div>
                  <p className="text-[rgba(245,237,227,0.6)] text-sm mb-3.5 line-clamp-2 font-light leading-relaxed">
                    {outfit.caption}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[rgba(245,237,227,0.22)]">
                      {outfit.items.length} items
                    </span>
                    <button
                      onClick={(e) => handleToggleFavorite(outfit.id, e)}
                      className={`${
                        outfit.isFavorited
                          ? "text-[#C4A265]"
                          : "text-[rgba(245,237,227,0.2)]"
                      } hover:text-[#C4A265] transition-colors text-lg`}
                    >
                      {outfit.isFavorited ? "♥" : "♡"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOutfits.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[rgba(245,237,227,0.4)] text-lg font-light">
              No outfits found matching your criteria.
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedOutfit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a0508] border border-[rgba(196,162,101,0.14)] rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl text-[#F5EDE3] font-medium">
                Outfit Details
              </h2>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-[rgba(245,237,227,0.5)] hover:text-[#C4A265] transition-colors"
              >
                <IoClose size={24} />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Outfit Items */}
              <div>
                <h3 className="text-sm tracking-widest text-[#C4A265] uppercase mb-3">
                  Items
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {selectedOutfit.items.map((item, index) => (
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

              {/* Details and Actions */}
              <div className="space-y-4">
                <div>
                  <label className="text-[rgba(245,237,227,0.4)] text-xs tracking-widest uppercase block mb-1">
                    Date
                  </label>
                  <p className="text-[#F5EDE3]">{selectedOutfit.date}</p>
                </div>

                <div>
                  <label className="text-[rgba(245,237,227,0.4)] text-xs tracking-widest uppercase block mb-1">
                    Rating (click to edit)
                  </label>
                  <div className="flex gap-2">
                    {renderInteractiveStars(selectedOutfit.rating, true)}
                  </div>
                </div>

                <div>
                  <label className="text-[rgba(245,237,227,0.4)] text-xs tracking-widest uppercase block mb-1">
                    <IoChatbubble className="inline mr-1" />
                    Caption
                  </label>
                  <textarea
                    value={editingCaption}
                    onChange={(e) => setEditingCaption(e.target.value)}
                    onBlur={handleSaveCaption}
                    className="w-full bg-[#0f0204] border border-[rgba(196,162,101,0.14)] text-[#F5EDE3] rounded-lg p-3 min-h-24 resize-none focus:outline-none focus:border-[rgba(196,162,101,0.4)]"
                    placeholder="Add a caption..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleDisfavorOutfit}
                    className="btn-primary bg-[#34020E] hover:bg-[#2a0a10] text-[#F5EDE3] border border-[rgba(196,162,101,0.3)] flex-1"
                  >
                    <IoTrash size={20} className="inline mr-2" />
                    Remove
                  </button>
                </div>

                <div className="border-t border-[rgba(196,162,101,0.12)] pt-4">
                  <label className="text-[rgba(245,237,227,0.4)] text-xs tracking-widest uppercase block mb-3">
                    Export Options
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={handleShareLink}
                      className="flex-1 bg-[#0f0204] border border-[rgba(196,162,101,0.14)] hover:border-[rgba(196,162,101,0.35)] text-[#F5EDE3] rounded-lg py-3 flex items-center justify-center gap-2 transition-colors"
                    >
                      <IoShareSocial size={20} />
                      Share Link
                    </button>
                    <button
                      onClick={handleDownloadImage}
                      className="flex-1 bg-[#0f0204] border border-[rgba(196,162,101,0.14)] hover:border-[rgba(196,162,101,0.35)] text-[#F5EDE3] rounded-lg py-3 flex items-center justify-center gap-2 transition-colors"
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

      {isDeleting && <LoadingOverlay />}
    </div>
  );
}
