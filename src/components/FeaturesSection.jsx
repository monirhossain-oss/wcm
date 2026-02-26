import Image from 'next/image';

const featuredCultures = [
  {
    name: 'Japanese Crafts',
    listings: '1,247 listings',
    image: '/JapaneseCrafts.png',
  },
  {
    name: 'African Textiles',
    listings: '892 listings',
    image: '/AfricanTextiles.png',
  },
  {
    name: 'Mexican Folk Art',
    listings: '1,034 listings',
    image: '/MexicanFolkArt.png',
  },
  {
    name: 'Indian Jewelry',
    listings: '765 listings',
    image: '/IndianJewelry.png',
  },
  {
    name: 'Nordic Design',
    listings: '621 listings',
    image: '/NordicDesign.png',
  },
];

export default function FeaturedCultures() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-8 lg:px-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[#1F1F1F] dark:text-[#ededed]">
            Featured cultures
          </h2>
          <p className="text-sm text-[#555555] dark:text-[#cccccc]">
            Browse popular cultural categories
          </p>
        </div>
        <a href="#" className="text-[#F57C00] hover:underline font-semibold text-sm">
          View all &rarr;
        </a>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {featuredCultures.map((culture) => (
          <div
            key={culture.name}
            className="bg-[#F2F2F2] dark:bg-[#1F1F1F] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="relative w-full h-48">
              <Image src={culture.image} alt={culture.name} fill className="object-cover" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-[#1F1F1F] dark:text-[#ededed]">
                {culture.name}
              </h3>
              <p className="text-sm text-[#555555] dark:text-[#cccccc]">{culture.listings}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
