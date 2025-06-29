"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  DollarSign,
  Calendar,
  Heart,
  Bed,
  Bath,
  Mail,
  Phone,
  MessageCircle,
  ArrowLeft,
  Share2,
  Home,
  Car,
  PawPrint,
  Snowflake,
  Settings,
  CheckCircle,
  Clock,
  User,
  Shield,
  PhoneCall,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LuckyOpinion } from "@/components/ui/lucky-opinion";
import { Chat } from "@/components/ui/chat";
import { getUserInfo } from "@/lib/auth";
import toast from "react-hot-toast";

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  startDate: string;
  endDate: string;
  imageUrls: string[];
  summary?: string;
  tags: string[];
  bedrooms: string;
  bathrooms: string;
  petsAllowed: boolean;
  laundryInBuilding: boolean;
  parkingAvailable: boolean;
  airConditioning: boolean;
  school?: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    phone?: string;
    verified: boolean;
    memberSince: string;
    responseRate: number;
    responseTime: string;
  };
  _count: {
    likes: number;
  };
  createdAt: string;
  updatedAt: string;
  detailedDescription?: string;
  rules?: string[];
  utilities?: string[];
  nearbyAmenities?: string[];
}

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    token: string;
  } | null>(null);

  useEffect(() => {
    fetchListing();
    // Get current user info using the utility function
    console.log("Listing page useEffect - checking for user info...");
    const userInfo = getUserInfo();
    if (userInfo) {
      setCurrentUser(userInfo);
      console.log("User info loaded successfully:", userInfo);
    } else {
      console.log("No user info found, user will need to log in");
    }
  }, [params.listing]);

  const fetchListing = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/listings/${params.listing}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch listing");
      }

      setListing(data.listing);
    } catch (error) {
      toast.error("Failed to load listing");
      console.error("Error fetching listing:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatMemberSince = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const handleContact = () => {
    // Always open in-app messaging
    console.log("handleContact called, currentUser:", currentUser);
    console.log("localStorage contents:", {
      token: localStorage.getItem("token"),
      user: localStorage.getItem("user"),
      userInfo: localStorage.getItem("userInfo"),
    });

    if (!currentUser) {
      console.log("No currentUser, redirecting to login");
      toast.error("Please log in to send messages");
      router.push("/auth/login");
      return;
    }
    console.log(
      "Opening chat for listing:",
      listing?.id,
      "with user:",
      listing?.user.id
    );
    setIsChatOpen(true);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? "Removed from favorites" : "Added to favorites");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading listing...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Listing not found
          </h2>
          <p className="text-gray-600 mb-6">
            The listing you're looking for doesn't exist.
          </p>
          <Link href="/listings/browse">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              Back to Browse
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/listings/browse">
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Browse</span>
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Images */}
            <div className="mb-8">
              <div className="relative mb-4">
                <img
                  src={listing.imageUrls[selectedImage]}
                  alt={listing.title}
                  className="w-full h-96 object-cover rounded-2xl"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/90 hover:bg-white"
                    onClick={handleLike}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isLiked ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/90 hover:bg-white"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Thumbnail Images */}
              {listing.imageUrls.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {listing.imageUrls.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index
                          ? "border-emerald-500"
                          : "border-gray-200"
                      }`}
                    >
                      <img
                        src={url}
                        alt={`${listing.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Title and Basic Info */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {listing.title}
              </h1>
              <div className="flex items-center space-x-6 text-gray-600 mb-4">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{listing.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>
                    {formatDate(listing.startDate)} -{" "}
                    {formatDate(listing.endDate)}
                  </span>
                </div>
              </div>{" "}
              <div className="flex items-center space-x-6 text-gray-600">
                <div className="flex items-center">
                  <Bed className="w-5 h-5 mr-2" />
                  <span>{listing.bedrooms} bedroom</span>
                </div>
                <div className="flex items-center">
                  <Bath className="w-5 h-5 mr-2" />
                  <span>{listing.bathrooms} bathroom</span>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 mb-8"></div>
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                About this place
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {listing.detailedDescription}
                </p>
              </div>
            </div>
            <div className="border-t border-gray-200 mb-8"></div>{" "}
            {/* Amenities & Policies */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Amenities & Policies
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {listing.petsAllowed && (
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <PawPrint className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">
                        Pets Allowed
                      </div>
                      <div className="text-sm text-gray-600">
                        Pets are welcome in this space
                      </div>
                    </div>
                  </div>
                )}
                {listing.laundryInBuilding && (
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Settings className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">
                        Laundry in Building
                      </div>
                      <div className="text-sm text-gray-600">
                        Washer and dryer available on-site
                      </div>
                    </div>
                  </div>
                )}
                {listing.parkingAvailable && (
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Car className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">
                        Parking Available
                      </div>
                      <div className="text-sm text-gray-600">
                        Parking space included or available
                      </div>
                    </div>
                  </div>
                )}
                {listing.airConditioning && (
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Snowflake className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">
                        Air Conditioning
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="border-t border-gray-200 mb-8"></div>
            {/* Rules */}
            {listing.rules && listing.rules.length > 0 && (
              <>
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    House rules
                  </h2>
                  <div className="space-y-2">
                    {listing.rules.map((rule, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-gray-200 mb-8"></div>
              </>
            )}
            {/* Nearby Amenities */}
            {listing.nearbyAmenities && listing.nearbyAmenities.length > 0 && (
              <>
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    What's nearby
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {listing.nearbyAmenities.map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-gray-200 mb-8"></div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Price Card */}
            <Card className="top-24 mb-6">
              <CardContent className="p-6">
                {" "}
                <div className="mb-4">
                  <div>
                    <span className="text-3xl font-bold text-emerald-600">
                      ${listing.price}
                    </span>
                    <span className="text-gray-600 ml-1">/month</span>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <Button
                    onClick={handleContact}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
                <div className="text-center text-sm text-gray-500">
                  <p>No booking fees • Secure payment</p>
                </div>
              </CardContent>
            </Card>
            {/* Lucky Opinion */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Need advice?
                </h3>
                <LuckyOpinion
                  listing={{
                    id: listing.id,
                    title: listing.title,
                    description: listing.description,
                    price: listing.price,
                    location: listing.location,
                    bedrooms: listing.bedrooms,
                    bathrooms: listing.bathrooms,
                    petsAllowed: listing.petsAllowed,
                    laundryInBuilding: listing.laundryInBuilding,
                    parkingAvailable: listing.parkingAvailable,
                    airConditioning: listing.airConditioning,
                    school: listing.school,
                  }}
                />
              </CardContent>
            </Card>{" "}
            {/* Host Information */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {listing.user.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {listing.user.verified && (
                        <Badge variant="secondary" className="text-xs">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      <span className="text-sm text-gray-600">
                        Member since{" "}
                        {formatMemberSince(listing.user.memberSince)}
                      </span>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <User className="w-4 h-4 mr-2" />
                  View Profile
                </Button>
              </CardContent>
            </Card>{" "}
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      {isChatOpen && currentUser && (
        <Chat
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          currentUserId={currentUser.id}
          token={currentUser.token}
          initialListingId={listing.id}
          initialReceiverId={listing.user.id}
        />
      )}
    </div>
  );
}
