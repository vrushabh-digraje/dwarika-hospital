const ChairmanMessage = () => {
    const leadership = [
        {
            role: "Chairman",
            heading: "Message from the Chairman",
            name: "Dr. John Doe",
            message:
                "At Dwarika Hospital, our mission is to provide ethical, patient‑centered care that treats every individual with dignity, compassion, and respect. We continuously invest in advanced medical technology and the best clinical talent so that your family receives world‑class treatment close to home.",
            image: "/chairman.png",
        },
        {
            role: "Chief Executive Director",
            heading: "Message from the Chief Executive Director",
            name: "Ms. Jane Doe",
            message:
                "We are committed to delivering a seamless and transparent healthcare experience—right from your first appointment to your complete recovery. By strengthening our systems, processes, and people, we ensure that every interaction at Dwarika Hospital reflects quality, safety, and trust.",
            image: "/chief-executive-director.png",
        },
    ];

    return (
        <section
            id="chairman-message"
            aria-labelledby="leadership-messages-heading"
            className="bg-[#F4F8FB] py-16 px-4 sm:px-6 lg:px-8"
        >
            <div className="mx-auto max-w-6xl">
                <div className="mb-10 text-center">
                    <h2
                        id="leadership-messages-heading"
                        className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary"
                    >
                        Leadership Messages
                    </h2>
                    <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
                        Hear from our senior leadership on how Dwarika Hospital is shaping a safer,
                        kinder, and more advanced healthcare experience for every patient.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {leadership.map((leader) => (
                        <article
                            key={leader.role}
                            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 focus-within:ring-2 focus-within:ring-accent/80 flex flex-col h-full"
                        >
                            <div className="flex flex-col md:flex-row gap-6 p-6 sm:p-8 h-full">
                                <div className="md:w-2/3 flex flex-col justify-center space-y-3">
                                    <p className="text-xs font-semibold tracking-[0.2em] uppercase text-secondary">
                                        {leader.role}
                                    </p>
                                    <h3 className="text-lg sm:text-xl font-bold text-primary">
                                        {leader.heading}
                                    </h3>
                                    <p className="text-sm font-semibold text-slate-900">
                                        {leader.name}
                                    </p>
                                    <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-600">
                                        {leader.message}
                                    </p>
                                </div>

                                <div className="md:w-1/3 flex items-center justify-end">
                                    <div className="w-28 h-32 sm:w-32 sm:h-40 rounded-lg overflow-hidden bg-slate-100 shadow-md">
                                        <img
                                            src={leader.image}
                                            alt={leader.heading}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ChairmanMessage;
