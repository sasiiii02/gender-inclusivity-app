import React, { useState, useEffect } from 'react';

const QuoteWidget = () => {
  const [quote, setQuote] = useState({ text: '', author: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fallbackQuote = {
    text: "Inclusivity is not a box to check—it's a culture to build.",
    author: "InclusiveSpace"
  };

  const fetchQuote = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('https://api.quotable.io/random?tags=inspirational|inclusivity');
      if (!res.ok) throw new Error('API failed');
      const data = await res.json();
      setQuote({ text: data.content, author: data.author });
    } catch (err) {
      console.warn('Quote API error, using fallback:', err);
      setQuote(fallbackQuote);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  if (loading) {
    return (
      <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100">
        <p className="text-indigo-400 text-sm italic">Loading inspiration...</p>
      </div>
    );
  }

  return (
    <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100">
      <p className="text-indigo-800 italic">"{quote.text}"</p>
      <p className="text-indigo-600 text-sm mt-2">— {quote.author}</p>
      <button 
        onClick={fetchQuote} 
        className="mt-3 text-xs text-indigo-500 hover:text-indigo-700 transition-colors"
        disabled={loading}
      >
        {loading ? 'Loading...' : 'New Quote ↻'}
      </button>
      {error && (
        <p className="text-xs text-amber-600 mt-1">(Using offline quote)</p>
      )}
    </div>
  );
};

export default QuoteWidget;