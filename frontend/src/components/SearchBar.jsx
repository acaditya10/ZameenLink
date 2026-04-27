import React, { useState } from 'react';
import { Search } from 'lucide-react';

function SearchBar({ onSearch }) {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onSearch(query);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full"
        >
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sand-600 group-focus-within:text-forest-500 transition-colors">
                    <Search size={18} />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-4 py-2.5 border border-sand-300 rounded-xl leading-5 bg-sand-50 text-charcoal-500 placeholder-sand-600 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent shadow-sm text-sm transition-all duration-200"
                    placeholder="Search by area..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    aria-label="Search properties by area"
                />
            </div>
        </form>
    );
}

export default SearchBar;
