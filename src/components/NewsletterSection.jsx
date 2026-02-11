export default function NewsletterSection() {
    return (
        <section className="py-20 bg-[#F57C00] text-white text-center">
            <h2 className="text-3xl font-semibold mb-4">Subscribe to our newsletter</h2>
            <p className="mb-6">Get updates on new listings and cultural experiences.</p>
            <form className="flex flex-col md:flex-row justify-center gap-4 max-w-md mx-auto">
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="px-4 py-3 rounded-lg text-black flex-1"
                />
                <button
                    type="submit"
                    className="px-6 py-3 rounded-lg bg-[#7A1E1E] hover:bg-[#5c1919] transition"
                >
                    Subscribe
                </button>
            </form>
        </section>
    );
}
