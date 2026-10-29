const MasonryImage = ({ src }) => {
    return (
        <div className="relative overflow-hidden rounded-2xl">
            <img
                src={src}
                alt="Blog Grid"
                className="w-full h-auto object-contain rounded-2xl transition-transform duration-500 hover:scale-105"
                loading="lazy"
            />
        </div>
    );
};