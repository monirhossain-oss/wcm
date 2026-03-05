import Image from "next/image";
import Link from "next/link";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default async function PopularCreators() {
    let creators = [];

    try {
        const res = await fetch(
            `${API_BASE_URL}/api/users/famous-creators?limit=8&offset=0`,
            { cache: "no-store" }
        );

        const data = await res.json();
        creators = data?.data || [];
    } catch (error) {
        console.error("Error fetching popular creators:", error);
    }

    return (
        <section className="py-8">
            <div className="max-w-7xl mx-auto px-6">

                <div className="mb-10 ">
                    <h2 className="text-3xl font-bold">
                        Popular Creators
                    </h2>
                    <p className="text-gray-500 mt-2">
                        Verified & Top Performing Creators
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {creators.map((creator) => (
                        <div
                            key={creator._id}
                            className="bg-white dark:bg-zinc-800 rounded-sm shadow hover:shadow-lg transition p-6 text-center"
                        >
                            <div className="relative w-24 h-24 mx-auto mb-4">
                                <Image
                                    src={
                                        creator.profile?.profileImage ||
                                        "/default-avatar.png"
                                    }
                                    alt={creator.username}
                                    fill
                                    className="rounded-full object-cover"
                                />
                            </div>

                            <h3 className="font-semibold text-lg">
                                {creator.firstName} {creator.lastName}
                            </h3>

                            <p className="text-sm text-gray-500">
                                {creator.profile?.city || "Unknown"},{" "}
                                {creator.profile?.country || "World"}
                            </p>

                            <p className="text-xs text-gray-400 mt-2">
                                {creator.totalListings} Listings
                            </p>

                            <Link
                                href={`/profile/${creator._id}`}
                                className="mt-4 py-1 px-4 inline-block text-sm bg-orange-400 text-white rounded-2xl hover:bg-orange-700 transition"
                            >
                                View Profile
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-10">
                    <Link
                        href="/creators"
                        className="text-sm font-semibold text-orange-500 hover:underline"
                    >
                        View All →
                    </Link>
                </div>

            </div>
        </section>
    );
}