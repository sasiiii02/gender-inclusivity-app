import { useState, useEffect, useMemo } from "react";
import { Search, Loader2, BookOpen } from "lucide-react";
import { toast } from "react-hot-toast";
import { getAllArticles } from "../../services/supportService";
import SupportCard from "../../components/support/SupportCard";
import CategoryChip from "../../components/support/CategoryChip";
import SupportChatBot from "../../components/support/SupportChatBot";
import SupportChatInterface from "../../components/support/SupportChatInterface";

const SupportHome = () => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getAllArticles();
        setArticles(data || []);
        
        // Extract unique categories
        const catMap = new Set(["All"]);
        (data || []).forEach(article => {
          if (article.category?.name) {
            catMap.add(article.category.name);
          }
        });
        setCategories(Array.from(catMap));
      } catch (error) {
        toast.error("Failed to load support articles");
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            article.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || article.category?.name === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [articles, searchQuery, selectedCategory]);

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-500">
      
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        
        {/* Left Side: Articles & Search */}
        <div className="flex-1 w-full lg:max-w-[calc(100%-400px)]">
          {/* Header Section */}
          <div className="text-left mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
              Support Center
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl">
              Access resources, guides, and dedicated help articles. If you can't find what you need, use our AI Assistant.
            </p>

            {/* Search Bar */}
            <div className="relative group max-w-xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-purple-600 transition-colors">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-4 py-4 border border-transparent bg-white shadow-lg rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-24 bg-white rounded-3xl border border-gray-50 shadow-sm">
              <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
            </div>
          ) : (
            <>
              {/* Categories */}
              <div className="flex flex-wrap items-center gap-2 mb-10">
                {categories.map(cat => (
                  <CategoryChip 
                    key={cat} 
                    category={cat} 
                    isSelected={selectedCategory === cat} 
                    onClick={() => setSelectedCategory(cat)} 
                  />
                ))}
              </div>

              {/* Articles Grid */}
              {filteredArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                  {filteredArticles.map((article) => (
                    <SupportCard key={article._id} article={article} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-500 max-w-xs mx-auto">We couldn't match your search. Try using broader keywords or clearing filters.</p>
                  <button 
                    onClick={() => {setSearchQuery(""); setSelectedCategory("All");}}
                    className="mt-6 px-6 py-2 bg-purple-50 text-purple-600 font-bold rounded-xl hover:bg-purple-100 transition-colors"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Side: Shared Assistant Side Panel (visible on large screens) */}
        <aside className="hidden lg:block w-[380px] sticky top-8 h-[750px] shrink-0">
          <SupportChatInterface isEmbedded={true} />
        </aside>

      </div>

      {/* Floating Chatbot (always there, useful for mobile and fallback) */}
      <SupportChatBot />
    </div>
  );
};

export default SupportHome;
