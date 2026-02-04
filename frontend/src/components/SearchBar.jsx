import React, { useState } from 'react';
import { Search } from 'lucide-react';

function SearchBar({ onSearch }) {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full"
        >
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sand-500 group-focus-within:text-sand-600 transition-colors">
                    <Search size={18} />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-20 py-2 border border-sand-200 rounded-lg leading-5 bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sand-300 focus:border-transparent shadow-sm text-sm transition-all"
                    placeholder="Search by area..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-label="Search properties by area"
                />
                <button
                    type="submit"
                    className="absolute inset-y-1 right-1 px-3 bg-forest-600 text-sand-50 rounded-md text-sm font-medium hover:bg-forest-700 transition-colors"
                    aria-label="Submit search"
                >
                    Search
                </button>
            </div>
        </form>
    );
}

export default SearchBar;
