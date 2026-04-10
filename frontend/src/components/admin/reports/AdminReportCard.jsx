import React from 'react';

const AdminReportCard = ({ label, value, color, icon: Icon }) => {
    const colorMap = {
        amber: 'border-amber-500 text-amber-600 bg-amber-50/50',
        blue: 'border-blue-500 text-blue-600 bg-blue-50/50',
        green: 'border-green-500 text-green-600 bg-green-50/50',
        purple: 'border-purple-500 text-purple-600 bg-purple-50/50',
        stone: 'border-stone-400 text-stone-600 bg-stone-50'
    };

    return (
        <div className={`card border-l-4 p-6 shadow-sm hover:shadow-md transition-all duration-300 group ${colorMap[color] || colorMap.stone}`}>
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-1 group-hover:text-stone-700 transition-colors">
                        {label}
                    </h4>
                    <p className="text-3xl font-serif font-bold text-stone-900">
                        {value ?? 0}
                    </p>
                </div>
                {Icon && (
                    <div className={`p-3 rounded-2xl bg-white shadow-sm transition-transform group-hover:scale-110 duration-300`}>
                        <Icon className="w-6 h-6 opacity-80" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminReportCard;
