import CultureSlider from './CultureSlider';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

// ১. ক্লায়েন্টের দেওয়া স্ট্যাটিক ইমেজ এবং মহাদেশের ম্যাপিং
export const continentsData = [
    {
        title: "Asia",
        image: "/aisa.jpg",
        countries: [
            "Afghanistan", "Armenia", "Azerbaijan", "Bangladesh", "Bhutan", "Brunei",
            "Cambodia", "China", "Georgia", "India", "Indonesia", "Japan", "Kazakhstan",
            "Kyrgyzstan", "Laos", "Malaysia", "Maldives", "Mongolia", "Myanmar", "Nepal",
            "North Korea", "Philippines", "Singapore", "South Korea", "Sri Lanka",
            "Taiwan", "Tajikistan", "Thailand", "Timor-Leste", "Turkmenistan",
            "Uzbekistan", "Vietnam"
        ]
    },

    {
        title: "Middle East",
        image: "/Middle East.jpg",
        countries: [
            "Bahrain", "Cyprus", "Iran", "Iraq", "Israel", "Jordan", "Kuwait", "Lebanon",
            "Oman", "Palestine", "Qatar", "Saudi Arabia", "Syria", "Turkey",
            "United Arab Emirates", "Yemen"
        ]
    },

    {
        title: "Europe",
        image: "/europe.jpg",
        countries: [
            "Albania", "Andorra", "Austria", "Belarus", "Belgium", "Bosnia and Herzegovina",
            "Bulgaria", "Croatia", "Czech Republic", "Denmark", "Estonia", "Finland",
            "France", "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy",
            "Kosovo", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Malta",
            "Moldova", "Monaco", "Montenegro", "Netherlands", "North Macedonia", "Norway",
            "Poland", "Portugal", "Romania", "Russia", "San Marino", "Serbia", "Slovakia",
            "Slovenia", "Spain", "Sweden", "Switzerland", "Ukraine", "United Kingdom",
            "Vatican City"
        ]
    },

    {
        title: "Africa",
        image: "/Africa.jpg",
        countries: [
            "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cameroon",
            "Cape Verde", "Central African Republic", "Chad", "Comoros", "Congo",
            "DR Congo", "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Eswatini",
            "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Ivory Coast",
            "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar", "Malawi", "Mali",
            "Mauritania", "Mauritius", "Morocco", "Mozambique", "Namibia", "Niger",
            "Nigeria", "Rwanda", "Sao Tome and Principe", "Senegal", "Seychelles",
            "Sierra Leone", "Somalia", "South Africa", "South Sudan", "Sudan",
            "Tanzania", "Togo", "Tunisia", "Uganda", "Zambia", "Zimbabwe"
        ]
    },

    {
        title: "Latin America",
        image: "/Latin America.jpg",
        countries: [
            "Argentina", "Bolivia", "Brazil", "Chile", "Colombia", "Costa Rica", "Cuba",
            "Dominican Republic", "Ecuador", "El Salvador", "Guatemala", "Haiti",
            "Honduras", "Jamaica", "Mexico", "Nicaragua", "Panama", "Paraguay", "Peru",
            "Puerto Rico", "Uruguay", "Venezuela"
        ]
    }
];

export default async function CultureDataWrapper() {
    try {
        // সব লিস্টিং নিয়ে আসছি (লিমিট বাড়িয়ে দিন যাতে সব দেশ কাভার হয়)
        const res = await fetch(`${API_BASE_URL}/api/listings/public?limit=250`, {
            next: { revalidate: 30 }
        });

        if (!res.ok) throw new Error('Failed to fetch listings');

        const data = await res.json();
        const allListings = data.listings || [];

        // ২. প্রতিটি মহাদেশের জন্য লিস্টিং কাউন্ট করা
        const finalData = continentsData.map(continent => {
            // এই মহাদেশের আন্ডারে কতগুলো লিস্টিং আছে তা বের করা
            const count = allListings.filter(listing =>
                continent.countries.includes(listing.country)
            ).length;

            return {
                _id: continent.title, // আইডি হিসেবে মহাদেশের নাম
                title: continent.title,
                image: continent.image, // স্ট্যাটিক ইমেজ
                listingCount: count
            };
        });

        // ৩. লিস্টিং নাই এমন মহাদেশ বাদ দিতে চাইলে নিচের লাইনটি রাখুন (ঐচ্ছিক)
        const filteredContinents = finalData.filter(item => item.listingCount > 0);

        // ৪. লিস্টিং অনুযায়ী সর্ট করা (বেশি লিস্টিং আগে)
        filteredContinents.sort((a, b) => b.listingCount - a.listingCount);

        return <CultureSlider items={filteredContinents} API_BASE_URL={API_BASE_URL} />;

    } catch (error) {
        console.error("Culture Fetch Error:", error);
        return <div className="text-xs text-gray-400">Failed to load continents.</div>;
    }
}