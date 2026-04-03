import { Image as ImageIcon } from "lucide-react";

const galleryItems = [
    { id: 1, imageUrl: "https://picsum.photos/seed/academy1/500/375", title: "Campus Overview" },
    { id: 2, imageUrl: "https://picsum.photos/seed/academy2/500/375", title: "Lecture Halls" },
    { id: 3, imageUrl: "https://picsum.photos/seed/academy3/500/375", title: "Laboratory" },
    { id: 4, imageUrl: "https://picsum.photos/seed/academy4/500/375", title: "Library" },
    { id: 5, imageUrl: "https://picsum.photos/seed/academy5/500/375", title: "Student Activities" },
    { id: 6, imageUrl: "https://picsum.photos/seed/academy6/500/375", title: "Graduation Ceremony" },
];

const AcademicGallery = () => {
    return (
        <section className="px-6 py-16 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <ImageIcon className="w-6 h-6 text-primary" />
                    <h3 className="text-xl font-black text-primary uppercase tracking-tight">Academic Gallery</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {galleryItems.map((item) => (
                        <article
                            key={item.id}
                            className="group relative rounded-2xl overflow-hidden bg-gray-50 shadow-md hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-full h-full object-cover rounded-2xl transition-transform duration-500 ease-out group-hover:scale-110"
                                />
                            </div>
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent pt-12 pb-4 px-4 rounded-b-2xl">
                                <h3 className="text-white font-black text-[10px] uppercase tracking-wider">
                                    {item.title}
                                </h3>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AcademicGallery;
