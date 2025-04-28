import logo from "../../public/logo.jpg";

export default function LandingPageHero(){
    return(
      <main className="flex items-center justify-around px-6 py-5 md:py-18 ">
      <div className="max-w-lg flex-col md:flex-row">
        <div className="text-xl md:text-5xl font-bold text-[#1F3C9A]">
          SplitEasy: The Smart Way to Share Expenses
        </div>
        <div className="text-sm md:text-lg text-[#1d214b] mt-2 md:mt-6 ">
          Tired of managing group expenses manually? SplitEasy makes it
          effortless! Whether you're splitting bills with friends, planning a
          trip, or sharing rent, our seamless platform helps you keep track of
          who owes what.
        </div>
      </div>

      <img src={logo} alt="image of something" className="w-[250px] h-[250px] lg:w-[500px] lg:h-[500px]" />
    </main>
    );
}