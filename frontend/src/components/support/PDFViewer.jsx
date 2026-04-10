import { AlertTriangle } from "lucide-react";

const PDFViewer = ({ pdfUrl }) => {
  if (!pdfUrl) return null;

  return (
    <div className="w-full bg-gray-900 rounded-xl overflow-hidden shadow-inner border border-gray-800 mt-8">
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex justify-between items-center text-xs text-gray-300">
        <span className="font-mono">PDF Preview</span>
        <span className="flex items-center text-yellow-500/80"><AlertTriangle className="w-3 h-3 mr-1"/> Some browsers may auto-download</span>
      </div>
      <div className="aspect-[1/1.4] w-full max-h-[80vh] relative">
        <iframe
          src={pdfUrl}
          className="w-full h-full border-0 absolute top-0 left-0"
          title="PDF Document"
        />
      </div>
    </div>
  );
};

export default PDFViewer;
