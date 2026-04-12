import ListingCard from './ListingCard';

export default function ListingGrid({ listings, lastElementRef }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
      {listings.map((item, index) => (
        <div 
          key={item._id} 
          ref={index === listings.length - 1 ? lastElementRef : null}
        >
          <ListingCard item={item} />
        </div>
      ))}
    </div>
  );
}