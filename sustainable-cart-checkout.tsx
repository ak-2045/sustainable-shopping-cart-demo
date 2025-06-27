"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import {
  ShoppingCart,
  Leaf,
  Truck,
  Package,
  Info,
  Route,
  Gift,
  Car,
  Lightbulb,
  ArrowRight,
  Recycle,
  Zap,
  Clock,
  Users,
  TreePine,
  Sprout,
  Heart,
  Shield,
  ExternalLink,
  OctagonAlert,
} from "lucide-react"

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  carbonScore: number;
  carbonReason: string;
  description: string;
  image: string;
}

interface Alternative {
  id: string;
  name: string;
  price: number;
  carbonScore: number;
  durabilityIndex: string;
  carbonSavings: number;
  originalItemId: string;
  image: string;
}

// Carbon Info Tooltip Component
function CarbonInfoTooltip({ 
  carbonScore, 
  carbonReason, 
  isVisible, 
  onToggle 
}: {
  carbonScore: number;
  carbonReason: string;
  isVisible: boolean;
  onToggle: () => void;
}) {
  // Choose icon based on score
  const getIcon = (score: number) => {
    if (score <= 30) return <Leaf className="h-3 w-3 mr-1" />;
    if (score <= 60) return <Zap className="h-3 w-3 mr-1 text-yellow-300" />;
    return <OctagonAlert className="h-3 w-3 mr-1 text-red-300" />;
  };

  const getTooltipIcon = (score: number) => {
    if (score <= 30) return <Leaf className="h-4 w-4 text-green-400" />;
    if (score <= 60) return <Zap className="h-4 w-4 text-yellow-300" />;
    return <OctagonAlert className="h-4 w-4 text-red-300" />;
  };

  const getScoreColor = (score: number) => {
    if (score <= 30) return "border-green-400 bg-green-900/90"
    if (score <= 60) return "border-yellow-400 bg-yellow-900/90"
    return "border-red-400 bg-red-900/90"
  }

  const getButtonColor = (score: number) => {
    if (score <= 30) return "bg-green-700 border-green-500 text-white hover:bg-green-600"
    if (score <= 60) return "bg-yellow-600 border-yellow-400 text-black hover:bg-yellow-500"
    return "bg-red-700 border-red-500 text-white hover:bg-red-600"
  }

  return (
    <div className="relative inline-block">
      <Badge 
        className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
          carbonScore <= 30 
            ? "bg-green-600 hover:bg-green-500 text-white" 
            : carbonScore <= 60 
            ? "bg-yellow-600 hover:bg-yellow-500 text-black"
            : "bg-red-600 hover:bg-red-500 text-white"
        }`}
        onClick={onToggle}
      >
        {getIcon(carbonScore)}
        {carbonScore} CO₂
      </Badge>
      
      {isVisible && (
        <div className={`absolute z-50 top-8 right-0 w-72 p-4 rounded-lg border-2 ${getScoreColor(carbonScore)} backdrop-blur-sm shadow-xl`}>
          <div className="flex items-center gap-2 mb-2">
            {getTooltipIcon(carbonScore)}
            <span className="font-semibold text-white">Carbon Footprint Info</span>
          </div>
          <p className="text-sm text-gray-200 mb-3">{carbonReason}</p>
          
          <Button
            size="sm" 
            variant="outline" 
            className={`${getButtonColor(carbonScore)} text-xs`}
            onClick={() => window.open('/carbon-footprint', '_blank')}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Learn More
          </Button>
        </div>
      )}
    </div>
  )
}

// Environmental Impact Tooltip
function EnvironmentalTooltip({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-green-400 hover:text-green-300">
            <Info className="h-3 w-3" />
          </Button>
        </TooltipTrigger>
      </Tooltip>
    </TooltipProvider>
  )
}

// CartItemCard Component
function CartItemCard({ 
  item, 
  alternative, 
  showAlternative, 
  toggleAlternative,
  onSwap,
  isSwapping 
}: {
  item: CartItem;
  alternative?: Alternative;
  showAlternative: boolean;
  toggleAlternative: () => void;
  onSwap: (originalId: string, alternativeId: string) => void;
  isSwapping: boolean;
}) {
  const [showCarbonInfo, setShowCarbonInfo] = useState(false)

  return (
    <Card className="mb-4 bg-white border border-gray-300 shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-300">
            <img 
              src={`${item.image}`} 
              alt={item.name} 
              className="w-full h-full object-cover rounded-lg" 
              loading="lazy"
            />
            </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
              <CarbonInfoTooltip 
                carbonScore={item.carbonScore}
                carbonReason={item.carbonReason}
                isVisible={showCarbonInfo}
                onToggle={() => setShowCarbonInfo(!showCarbonInfo)}
              />
            </div>

            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl font-bold text-gray-900">₹{item.price.toLocaleString()}</span>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">Qty: {item.quantity}</span>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {item.description}
            </p>

            {alternative && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleAlternative}
                    className="text-green-900 border-green-400 hover:bg-green-50 hover:border-green-500 bg-white flex items-center gap-2"
                  >
                    <Leaf className="h-4 w-4" />
                    {showAlternative ? "Hide" : "View"} Green Alternative
                  </Button>
                  {}
                  <EnvironmentalTooltip>
                      <Info className="h-4 w-4 text-green-500" />
                  </EnvironmentalTooltip>
                </div>

                {showAlternative && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center border border-green-200">
                        <img 
                        src={`${alternative.image}`} 
                        alt={item.name} 
                        className="w-full h-full object-cover rounded-lg" 
                        loading="lazy"
                      />
                        
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900 text-lg">{alternative.name}</span>
                          <Badge className="bg-green-100 text-green-700 border border-green-300 flex items-center gap-1">
                            <TreePine className="h-3 w-3" />
                            Eco-Friendly
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <span className="text-gray-700 font-bold text-xl">₹{alternative.price.toLocaleString()}</span>
                          <div className="flex items-center gap-1 text-green-700">
                            <Shield className="h-4 w-4" />
                            <span className="text-sm">{alternative.durabilityIndex}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                          <Leaf className="h-4 w-4 text-green-500" />
                          <p className="text-sm text-green-700">
                            Saves <span className="font-bold">{alternative.carbonSavings}kg CO₂</span>
                          </p>
                          <Heart className="h-4 w-4 text-red-400" />
                        </div>

                        <Button
                          size="sm"
                          onClick={() => onSwap(item.id, alternative.id)}
                          disabled={isSwapping}
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
                        >
                          {isSwapping ? (
                            <>
                              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                              Swapping...
                            </>
                          ) : (
                            <>
                              <ArrowRight className="h-4 w-4" />
                              Switch to Eco-Friendly
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function SustainableCartCheckout() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Kuber Industries Strong Plastic Bathroom Bucket 13 LTR (Green)",
      price: 199,
      quantity: 1,
      carbonScore: 75,
      carbonReason: "Emits 4.2 kg CO₂ due to plastic manufacturing, petroleum-based raw materials, and energy-intensive production processes",
      description: "Durable and lightweight 13L plastic bucket with an ergonomic handle for easy carrying, perfect for daily household use, built to resist cracks, stains, and wear.",
      image: "https://m.media-amazon.com/images/I/61kqgK5hkoL._SX679_.jpg?",
    },
    {
      id: "2",
      name: "Go Store Large Non-Slip Wooden Bamboo Cutting Board",
      price: 599,
      quantity: 1,
      carbonScore: 15,
      carbonReason: "Low emissions from sustainable bamboo sourcing, minimal processing, and renewable material lifecycle",
      description: "Premium bamboo cutting board with natural antimicrobial properties. Sustainably harvested and eco-friendly finish.",
      image: "https://m.media-amazon.com/images/I/71mxX1AtmWL._SX679_.jpg",
    },
    {
      id: "3",
      name: "Synthetic Yoga Mat for Men & Women | 6mm TPE Cushioning",
      price: 899,
      quantity: 1,
      carbonScore: 68,
      carbonReason: "High CO₂ from petroleum-based PVC materials, chemical processing, and non-biodegradable manufacturing",
      description: "High-grip synthetic yoga mat with excellent cushioning. Non-slip surface ideal for all yoga practices and workouts. Lightweight & portable with carry bag.",
      image: "https://m.media-amazon.com/images/I/41F2uwP7PpL._SX300_SY300_QL70_FMwebp_.jpg",
    },
  ]);

  const [alternatives] = useState<Alternative[]>([
    {
      id: "alt-1",
      name: "Recycled Steel Storage Container",
      price: 249,
      carbonScore: 25,
      durabilityIndex: "3x more durable",
      carbonSavings: 2.8,
      originalItemId: "1",
      image: "https://m.media-amazon.com/images/I/31eHkZLh36L._SX300_SY300_QL70_FMwebp_.jpg",
    },
    {
      id: "alt-2",
      name: "Natural Cork Yoga Mat",
      price: 1299,
      carbonScore: 22,
      durabilityIndex: "2x more durable",
      carbonSavings: 3.1,
      originalItemId: "3",
      image: "https://m.media-amazon.com/images/I/71qjBFs7ncL._SX679_.jpg",
    },
  ]);

  const [visibleAltIds, setVisibleAltIds] = useState<string[]>([]);
  const [deliveryOption, setDeliveryOption] = useState("green")
  const [packagingOption, setPackagingOption] = useState("standard")
  const [showRouteModal, setShowRouteModal] = useState(false)
  const [routeOptimizationProgress, setRouteOptimizationProgress] = useState(0)
  const [showOptimization, setShowOptimization] = useState(false)
  const [swappingItems, setSwappingItems] = useState<Set<string>>(new Set())

  const toggleAlternative = (itemId: string) => {
    setVisibleAltIds((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Route optimization simulation
  useEffect(() => {
    if (showOptimization) {
      const interval = setInterval(() => {
        setRouteOptimizationProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 2
        })
      }, 50)
      return () => clearInterval(interval)
    }
  }, [showOptimization])

  const swapProduct = async (originalId: string, alternativeId: string) => {
    const alternative = alternatives.find((alt) => alt.id === alternativeId)
    if (!alternative) return

    setSwappingItems((prev) => new Set(prev).add(originalId))

    // Simulate loading time
    await new Promise((resolve) => setTimeout(resolve, 800))

    setCartItems((items) =>
      items.map((item) =>
        item.id === originalId
          ? {
              id: alternativeId,
              name: alternative.name,
              price: alternative.price,
              quantity: item.quantity,
              carbonScore: alternative.carbonScore,
              carbonReason: "Eco-friendly alternative with reduced carbon footprint",
              description: item.description,
              image: alternative.image,
            }
          : item,
      ),
    )

    setSwappingItems((prev) => {
      const newSet = new Set(prev)
      newSet.delete(originalId)
      return newSet
    })
  }

  const calculateTotalCO2 = () => {
    return cartItems.reduce((total, item) => total + item.carbonScore * item.quantity * 0.1, 0)
  }

  const calculateSavings = () => {
    let productSavings = 0
    const deliverySavings = deliveryOption === "green" ? 1.6 : deliveryOption === "balanced" ? 0.8 : 0
    const packagingSavings = packagingOption === "biodegradable" ? 0.4 : 0

    cartItems.forEach((item) => {
      const wasSwapped = alternatives.some((alt) => alt.id === item.id)
      if (wasSwapped) {
        const alt = alternatives.find((a) => a.id === item.id)
        if (alt) productSavings += alt.carbonSavings
      }
    })

    return { productSavings, deliverySavings, packagingSavings }
  }

  const savings = calculateSavings()
  const totalSavings = savings.productSavings + savings.deliverySavings + savings.packagingSavings
  const hasGreenChoices = totalSavings > 0

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
              <ShoppingCart className="h-8 w-8 text-green-700" />
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              </div>

              {/* Cart Items */}
              <div className="space-y-4">
                {cartItems.map((item) => {
                  const alternative = alternatives.find(
                    (alt) => alt.originalItemId === item.id
                  );
                  const showAlt = visibleAltIds.includes(item.id);

                  return (
                    <CartItemCard
                      key={item.id}
                      item={item}
                      alternative={alternative}
                      showAlternative={showAlt}
                      toggleAlternative={() => toggleAlternative(item.id)}
                      onSwap={swapProduct}
                      isSwapping={swappingItems.has(item.id)}
                    />
                  );
                })}
              </div>

              {/* Delivery Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Choose Delivery Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={deliveryOption} onValueChange={setDeliveryOption}>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 p-4 border-2 border-green-200 rounded-lg bg-green-50 cursor-pointer">
                        <RadioGroupItem value="green" id="green" />
                        <Label htmlFor="green" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2 font-semibold text-green-800">
                                <Leaf className="h-4 w-4" />
                                Green Option (Free)
                              </div>
                              <p className="text-sm text-green-600">Arrives in 2 days — ₹0 delivery fee</p>
                              <Tooltip>
                                <TooltipTrigger className="text-xs text-green-500 underline">
                                  Why is this green?
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    We club your order with nearby deliveries to reduce emissions. Your delivery
                                    driver is paid fully.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <Dialog open={showRouteModal} onOpenChange={setShowRouteModal}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-green-600 border-green-600 hover:bg-green-50"
                                  onClick={() => {
                                    setShowOptimization(true)
                                    setRouteOptimizationProgress(0)
                                  }}
                                >
                                  <Route className="h-4 w-4 mr-1" />
                                  Route Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-green-600" />
                                    AI-Optimized Green Delivery Route
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-6">
                                  {/* Route Optimization Progress */}
                                  {showOptimization && routeOptimizationProgress < 100 && (
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                      <div className="flex items-center gap-2 mb-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                        <span className="font-medium text-blue-800">AI Optimizing Route...</span>
                                      </div>
                                      <Progress value={routeOptimizationProgress} className="mb-2" />
                                      <p className="text-sm text-blue-600">
                                        Analyzing {Math.floor(routeOptimizationProgress / 10)} delivery points...
                                      </p>
                                    </div>
                                  )}

                                  {/* Route Comparison */}
                                  <div className="grid md:grid-cols-2 gap-6">
                                    {/* Fast Route */}
                                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                      <div className="flex items-center gap-2 mb-3">
                                        <Zap className="h-4 w-4 text-red-600" />
                                        <span className="font-semibold text-red-800">Fast Route (High Carbon)</span>
                                      </div>
                                      <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                          <span>Distance:</span>
                                          <span className="font-medium">147 km</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Delivery Time:</span>
                                          <span className="font-medium">Same Day</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>CO₂ Emissions:</span>
                                          <span className="font-medium text-red-600">4.2 kg</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Deliveries Batched:</span>
                                          <span className="font-medium">1 (yours only)</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Green Route */}
                                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                      <div className="flex items-center gap-2 mb-3">
                                        <Leaf className="h-4 w-4 text-green-600" />
                                        <span className="font-semibold text-green-800">
                                          Green Route (Optimized)
                                        </span>
                                      </div>
                                      <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                          <span>Distance:</span>
                                          <span className="font-medium">298 km</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Delivery Time:</span>
                                          <span className="font-medium">2 Days</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>CO₂ Emissions:</span>
                                          <span className="font-medium text-green-600">2.6 kg</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Deliveries Batched:</span>
                                          <span className="font-medium">5 orders</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Impact Summary */}
                                  <div className="bg-green-100 p-6 rounded-lg border border-green-300">
                                    <div className="text-center mb-4">
                                      <h3 className="text-lg font-semibold text-green-800 mb-2">
                                        Environmental Impact
                                      </h3>
                                      <div className="text-3xl font-bold text-green-600">1.6kg CO₂ Saved</div>
                                      <p className="text-sm text-green-700">by choosing green delivery</p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                      <div className="bg-white p-3 rounded">
                                        <Users className="h-6 w-6 text-green-600 mx-auto mb-1" />
                                        <div className="font-semibold text-green-800">5</div>
                                        <div className="text-xs text-green-600">Orders Batched</div>
                                      </div>
                                      <div className="bg-white p-3 rounded">
                                        <Route className="h-6 w-6 text-green-600 mx-auto mb-1" />
                                        <div className="font-semibold text-green-800">49km</div>
                                        <div className="text-xs text-green-600">Distance Saved</div>
                                      </div>
                                      <div className="bg-white p-3 rounded">
                                        <Clock className="h-6 w-6 text-green-600 mx-auto mb-1" />
                                        <div className="font-semibold text-green-800">2hrs</div>
                                        <div className="text-xs text-green-600">Fuel Saved</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="balanced" id="balanced" />
                        <Label htmlFor="balanced" className="flex-1 cursor-pointer">
                          <div className="font-semibold">Balanced Option (₹25)</div>
                          <p className="text-sm text-gray-600">Arrives in 1 day — 50% delivery fee waiver</p>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="fast" id="fast" />
                        <Label htmlFor="fast" className="flex-1 cursor-pointer">
                          <div className="font-semibold">Fast Option (₹50)</div>
                          <p className="text-sm text-gray-600">Arrives today — full fee applies</p>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Packaging Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Choose Packaging Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={packagingOption} onValueChange={setPackagingOption}>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard" className="flex-1 cursor-pointer">
                          <div className="font-semibold">Standard Packaging — Free</div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border-2 border-green-200 rounded-lg bg-green-50 cursor-pointer">
                        <RadioGroupItem value="biodegradable" id="biodegradable" />
                        <Label htmlFor="biodegradable" className="flex-1 cursor-pointer">
                          <div className="font-semibold text-green-800">Biodegradable Packaging — ₹12</div>
                          <div className="relative group inline-block">
                            <span className="text-xs text-green-500 underline cursor-pointer">
                              Why choose this?
                            </span>
                            <div className="absolute left-0 bottom-7 z-20 hidden group-hover:block w-64 p-3 bg-green-50 border-2 border-green-700 rounded-lg shadow-lg transition-all">
                              <p className="text-green-800 text-sm">
                                Eco-packaging helps reduce plastic waste and decomposes naturally
                              </p>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Checkout Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{cartItems.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery:</span>
                    <span>{deliveryOption === "green" ? "Free" : deliveryOption === "balanced" ? "₹25" : "₹50"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Packaging:</span>
                    <span>{packagingOption === "biodegradable" ? "₹12" : "Free"}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>
                      ₹
                      {cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) +
                        (deliveryOption === "green" ? 0 : deliveryOption === "balanced" ? 25 : 50) +
                        (packagingOption === "biodegradable" ? 12 : 0)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <Leaf className="h-5 w-5" />
                    Your Carbon Impact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{calculateTotalCO2().toFixed(1)}kg CO₂</div>
                    <p className="text-sm text-gray-600">Total cart emissions</p>
                  </div>

                  {hasGreenChoices && (
                    <div>
                      <Separator />
                      <div className="space-y-3">
                        <h4 className="font-semibold text-green-800">Carbon Savings Breakdown:</h4>

                        {savings.productSavings > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>Product Alternative Switch:</span>
                            <span className="text-green-600 font-medium">-{savings.productSavings}kg CO₂</span>
                          </div>
                        )}

                        {savings.deliverySavings > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>Delivery Optimization:</span>
                            <span className="text-green-600 font-medium">-{savings.deliverySavings}kg CO₂</span>
                          </div>
                        )}

                        {savings.packagingSavings > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>Packaging Choice:</span>
                            <span className="text-green-600 font-medium">-{savings.packagingSavings}kg CO₂</span>
                          </div>
                        )}

                        <Separator />
                        <div className="flex justify-between font-semibold text-green-700">
                          <span>Total CO₂ Saved:</span>
                          <span>{totalSavings.toFixed(1)}kg</span>
                        </div>

                        <div className="p-3 bg-green-100 rounded-lg text-sm text-green-800">
                          <div className="flex items-center gap-2 mb-1">
                            <Car className="h-4 w-4" />
                            <span>= Skipping a {Math.round(totalSavings * 5.6)}km car ride</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Lightbulb className="h-4 w-4" />
                            <span>= Powering an LED bulb for {Math.round(totalSavings * 0.8)} months</span>
                          </div>
                        </div>

                        {totalSavings >= 3 && (
                          <div className="p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                            <div className="flex items-center gap-2 text-yellow-800 font-semibold">
                              <Gift className="h-4 w-4" />
                              Green Reward Unlocked!
                            </div>
                            <p className="text-sm text-yellow-700 mt-1">
                              You earned 10% off your next order for saving {totalSavings.toFixed(1)}kg CO₂!
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {!hasGreenChoices && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-blue-900 text-sm mb-2">You're already ahead of <strong>58% of shoppers</strong>♻️</p>
                      <p className="text-blue-600 text-xs">
                        Just one greener switch can help the planet and earn you rewards! Try biodegradable packaging or alternative delivery route for rewards.  
                      </p>
                      <p className="text-blue-600 text-xs"></p>
                    </div>
                  )}
                </CardContent>
              </Card>

              

              <Button className="w-full  bg-blue-700 hover:bg-blue-900 text-white py-6 text-lg shadow-lg hover:shadow-xl transition-all">
                Proceed to Payment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}