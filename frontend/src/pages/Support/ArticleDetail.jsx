import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Download, FileText, Loader2, ChevronRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { getArticleById } from "../../services/supportService";
import PDFViewer from "../../components/support/PDFViewer";

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await getArticleById(id);
        setArticle(data);
      } catch (error) {
        toast.error("Failed to fetch article details");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchArticle();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center flex-col items-center py-32 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
        <p className="text-gray-500 font-medium">Loading article...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Article Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-sm mx-auto">We couldn't find the article you're looking for. It may have been moved or removed.</p>
        <Link to="/student/support" className="inline-flex items-center px-8 py-3 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-200">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Support Center
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-500">
      {/* Breadcrumb / Back Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8 overflow-hidden whitespace-nowrap">
        <Link to="/student/support" className="hover:text-purple-600 transition-colors font-medium">Support Center</Link>
        <ChevronRight className="w-4 h-4 flex-shrink-0" />
        <span className="text-gray-900 font-bold truncate">{article.title}</span>
      </nav>

      {/* Main Content Area */}
      <article className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-10 md:p-12">
        <div className="mb-8 border-b border-gray-100 pb-8">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-700 mb-4">
            {article.category?.name || "General Guidance"}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            {article.title}
          </h1>
        </div>

        <div className="prose prose-purple prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
          {article.content}
        </div>

        {article.pdfUrl && (
          <div className="mt-12 pt-8 border-t border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Attached Document</h3>
            
            <a 
              href={article.pdfUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between w-full sm:w-auto min-w-[250px] px-6 py-4 bg-gray-50 hover:bg-purple-50 border border-gray-200 hover:border-purple-200 rounded-xl transition-all group"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded bg-white shadow-sm flex items-center justify-center mr-4 border border-gray-100">
                  <FileText className="w-5 h-5 text-red-500" />
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-sm font-semibold text-gray-900 group-hover:text-purple-700 transition">View Document Source</div>
                  <div className="text-xs text-gray-500 font-mono">PDF Format</div>
                </div>
              </div>
              <Download className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition" />
            </a>

            <PDFViewer pdfUrl={article.pdfUrl} />
          </div>
        )}
      </article>
    </div>
  );
};

export default ArticleDetail;
