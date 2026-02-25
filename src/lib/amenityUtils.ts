import {
    Wifi,
    Coffee,
    Wind,
    Tv,
    Utensils,
    Bath,
    ShieldCheck,
    Zap,
    Waves,
    CigaretteOff,
    Gamepad2,
    Wine,
    Airplay,
    DoorOpen,
    Briefcase,
    Smartphone,
    Flame,
    Snowflake,
    Refrigerator
} from "lucide-react";

export const amenityMapping: Record<string, { icon: any, image?: string, description: string }> = {
    "free wi-fi": {
        icon: Wifi,
        description: "High-speed internet access throughout the hotel premises and in all guest rooms."
    },
    "mini bar": {
        icon: Wine,
        description: "A well-stocked selection of premium spirits, fine wines, and non-alcoholic beverages."
    },
    "air conditioning": {
        icon: Snowflake,
        description: "Individually controlled climate systems to ensure your perfect room temperature."
    },
    "smart tv": {
        icon: Tv,
        description: "Large 4K screens with streaming services and a wide range of international channels."
    },
    "safe": {
        icon: ShieldCheck,
        description: "Secure in-room safe for your valuables and peace of mind."
    },
    "coffee maker": {
        icon: Coffee,
        description: "Nespresso machine with a premium selection of artisanal coffee blends."
    },
    "bathtub": {
        icon: Bath,
        description: "Luxurious deep-soaking bathtub for ultimate relaxation."
    },
    "balcony": {
        icon: DoorOpen,
        description: "Private outdoor space with stunning views of the surrounding area."
    },
    "spa": {
        icon: Waves,
        description: "Rejuvenate your body and mind with our world-class spa treatments."
    },
    "gym": {
        icon: Zap,
        description: "State-of-the-art fitness center equipped with the latest modern machinery."
    },
    "breakfast": {
        icon: Utensils,
        description: "Complimentary gourmet breakfast served daily in our main restaurant."
    },
    "room service": {
        icon: Smartphone,
        description: "24/7 in-room dining service offering a wide variety of local and international dishes."
    }
};
