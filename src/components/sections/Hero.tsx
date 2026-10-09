const Hero = () => {
  return (
    <section className="bg-[#FFF7FE]">
      <div className="mx-auto grid min-h-[520px] max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 lg:min-h-[720px] lg:grid-cols-2 lg:px-8 lg:py-0">
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[4px] text-[#C572DE] sm:mb-5 sm:text-sm lg:tracking-[6px]">
            Meowiie Rental
          </p>

          <h1 className="text-4xl font-black leading-tight text-gray-900 sm:text-5xl lg:text-7xl">
            Become
            <br />
            Your Favorite
            <br />
            Character
          </h1>

          <p className="mx-auto mt-6 max-w-md text-base leading-7 text-gray-500 sm:text-lg lg:mx-0 lg:mt-8 lg:leading-8">
            Professional cosplay costume, wig styling and makeup service.
          </p>

          <button className="mt-8 rounded-full bg-[#C572DE] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#B363D8] sm:mt-10 sm:px-7 sm:py-3.5 lg:mt-12 lg:px-8 lg:py-4 lg:text-base">
            Explore Collection
          </button>
        </div>

        <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
          <div className="flex h-[260px] w-full max-w-[420px] items-center justify-center rounded-[30px] bg-[#F2D7FF] text-2xl font-bold text-[#A04BC9] shadow-[0_20px_50px_rgba(197,114,222,0.15)] sm:h-[340px] sm:rounded-[40px] lg:h-[650px] lg:w-[500px] lg:rounded-[50px] lg:text-3xl">
            IMAGE
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;